import { Context, Effect, Layer, Request, RequestResolver, Result } from "effect";
import type { ContractReaderShape } from "#src/contract/index.js";
import { ContractReader } from "#src/contract/index.js";
import type { MulticallCall } from "#src/types/index.js";

export type MulticallBatchOptions = {
  readonly blockNumber?: bigint | undefined;
  readonly blockTag?: import("viem").BlockTag | undefined;
};

/**
 * Request type for multicall batching.
 * Each request represents a single contract call to be batched.
 */
interface MulticallRequest extends Request.Request<unknown, Error> {
  readonly _tag: "MulticallRequest";
  readonly call: MulticallCall;
  readonly chainId: number;
  readonly options?: MulticallBatchOptions | undefined;
}

const MulticallRequest = Request.tagged<MulticallRequest>("MulticallRequest");

/**
 * Generate a stable cache key for grouping requests by chainId and options.
 */
const stableStringify = (value: unknown): string =>
  JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v));

const keyFor = (chainId: number, options?: MulticallBatchOptions | undefined): string =>
  `${chainId}:${stableStringify(options ?? {})}`;

type RequestGroup = {
  readonly chainId: number;
  readonly entries: readonly Request.Entry<MulticallRequest>[];
  readonly options?: MulticallBatchOptions | undefined;
};

/**
 * Complete all requests in a group with a failure.
 */
const failGroup = (entries: readonly Request.Entry<MulticallRequest>[], error: Error) =>
  Effect.forEach(entries, (entry) => Request.fail(entry, error), { discard: true });

/**
 * Complete all requests in a group with their corresponding results.
 */
const completeGroup = (
  entries: readonly Request.Entry<MulticallRequest>[],
  results: readonly {
    status: "success" | "failure";
    result?: unknown;
    error?: Error;
  }[]
) =>
  Effect.forEach(
    entries,
    (entry, i) => {
      const res = results[i];
      if (res?.status === "success") {
        return Request.succeed(entry, res.result);
      }
      return Request.fail(entry, res?.error ?? new Error("Unknown multicall error"));
    },
    { discard: true }
  );

/**
 * Execute a single multicall group and complete all requests.
 */
const executeGroup = (contractReader: ContractReaderShape, group: RequestGroup) =>
  Effect.gen(function* () {
    const result = yield* contractReader
      .multicall(
        group.chainId,
        group.entries.map((entry) => entry.request.call),
        group.options
      )
      .pipe(Effect.result);

    if (Result.isFailure(result)) {
      const error =
        result.failure instanceof Error ? result.failure : new Error(String(result.failure));
      yield* failGroup(group.entries, error);
    } else {
      yield* completeGroup(group.entries, result.success);
    }
  });

/**
 * Creates a batched RequestResolver that groups multicall requests by chainId and options.
 */
const makeMulticallResolver = (
  contractReader: ContractReaderShape
): RequestResolver.RequestResolver<MulticallRequest> =>
  RequestResolver.makeWith<MulticallRequest>({
    delay: Effect.yieldNow,
    batchKey: (entry) => keyFor(entry.request.chainId, entry.request.options),
    collectWhile: (entries) => entries.size < 100,
    runAll: (entries) => {
      const request = entries[0].request;
      return executeGroup(contractReader, {
        chainId: request.chainId,
        entries,
        options: request.options,
      });
    },
  });

export type MulticallBatcherShape = {
  readonly enqueue: <A>(
    chainId: number,
    call: MulticallCall,
    options?: MulticallBatchOptions | undefined
  ) => Effect.Effect<A, Error>;
};

export class MulticallBatcher extends Context.Service<MulticallBatcher, MulticallBatcherShape>()(
  "ew3/MulticallBatcher"
) {}

/**
 * Live implementation of MulticallBatcher using Effect's Request/RequestResolver.
 * Automatically batches and deduplicates multicall requests across concurrent fibers.
 */
export const MulticallBatcherLive = Layer.effect(
  MulticallBatcher,
  Effect.gen(function* () {
    const contractReader = yield* ContractReader;
    const resolver = makeMulticallResolver(contractReader);

    return MulticallBatcher.of({
      enqueue: <A>(chainId: number, call: MulticallCall, options?: MulticallBatchOptions) =>
        Effect.request(MulticallRequest({ call, chainId, options }), resolver) as Effect.Effect<
          A,
          Error
        >,
    });
  })
);
