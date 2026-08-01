import { Cache, Clock, Context, Duration, Effect, Exit, Layer, Option } from "effect";

export type CacheConfig = {
  ttl?: number; // default 12_000ms (1 block)
  maxSize?: number; // default 100 entries
  blockScoped?: boolean; // default true - invalidate on new block
};

export type CacheEntry<T> = {
  value: T;
  timestamp: number;
  blockNumber?: bigint;
  ttl?: number;
};

export type RpcCacheShape = {
  readonly get: <T>(key: string) => Effect.Effect<T | null>;
  readonly set: <T>(
    key: string,
    value: T,
    blockNumber?: bigint,
    ttl?: number
  ) => Effect.Effect<void>;
  readonly invalidate: (key: string) => Effect.Effect<void>;
  readonly invalidateBlock: (blockNumber: bigint) => Effect.Effect<void>;
  readonly clear: Effect.Effect<void>;
};

export class RpcCache extends Context.Service<RpcCache, RpcCacheShape>()("ew3/RpcCache") {}

/**
 * Create a cache layer with LRU eviction using Effect's Cache module
 */
export const makeRpcCacheLive = (config?: CacheConfig): Layer.Layer<RpcCache> => {
  const defaultTtl = config?.ttl ?? 12_000;
  const maxSize = config?.maxSize ?? 100;
  const blockScoped = config?.blockScoped ?? true;

  return Layer.effect(
    RpcCache,
    Effect.gen(function* () {
      const cache = yield* Cache.makeWith<string, CacheEntry<unknown>>(
        () => Effect.die("RpcCache values must be populated with set"),
        {
          capacity: maxSize,
          timeToLive: (result) =>
            Exit.isSuccess(result)
              ? Duration.millis(result.value.ttl ?? defaultTtl)
              : Duration.zero,
        }
      );

      const get = <T>(key: string): Effect.Effect<T | null> =>
        Cache.getOption(cache, key).pipe(
          Effect.map(
            Option.match({
              onNone: () => null,
              onSome: (entry) => entry.value as T,
            })
          )
        );

      const set = <T>(
        key: string,
        value: T,
        blockNumber?: bigint,
        entryTtl?: number
      ): Effect.Effect<void> =>
        Effect.gen(function* () {
          const timestamp = yield* Clock.currentTimeMillis;
          yield* Cache.set(cache, key, {
            blockNumber,
            timestamp,
            ttl: entryTtl,
            value,
          }).pipe(Effect.andThen(Cache.getOption(cache, key)), Effect.asVoid);
        });

      const invalidate = (key: string): Effect.Effect<void> => Cache.invalidate(cache, key);

      const invalidateBlock = (blockNumber: bigint): Effect.Effect<void> =>
        Effect.gen(function* () {
          if (!blockScoped) {
            return;
          }

          const entries = yield* Cache.entries(cache);
          yield* Effect.forEach(
            entries,
            ([key, entry]) =>
              entry.blockNumber !== undefined && entry.blockNumber < blockNumber
                ? Cache.invalidate(cache, key)
                : Effect.void,
            { discard: true }
          );
        });

      const clear = Cache.invalidateAll(cache);

      return {
        clear,
        get,
        invalidate,
        invalidateBlock,
        set,
      } satisfies RpcCacheShape;
    })
  );
};
