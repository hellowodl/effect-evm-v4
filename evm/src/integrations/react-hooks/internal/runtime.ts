import type * as Effect from "effect/Effect";
import * as Effect_ from "effect/Effect";
import * as Exit from "effect/Exit";
import type * as Fiber from "effect/Fiber";
import type * as Layer from "effect/Layer";
import type * as ManagedRuntime from "effect/ManagedRuntime";
import * as ManagedRuntime_ from "effect/ManagedRuntime";
import * as Scope_ from "effect/Scope";

type ReactManagedRuntime = ManagedRuntime.ManagedRuntime<unknown, never>;

export type EffectEvmRuntime = {
  readonly runFork: <A, E, R>(
    effect: Effect.Effect<A, E, R>,
    options?: Effect.RunOptions | undefined
  ) => Fiber.Fiber<A, E>;
  readonly runPromise: <A, E, R>(
    effect: Effect.Effect<A, E, R>,
    options?: Effect.RunOptions | undefined
  ) => Promise<A>;
  readonly runPromiseExit: <A, E, R>(
    effect: Effect.Effect<A, E, R>,
    options?: Effect.RunOptions | undefined
  ) => Promise<Exit.Exit<A, E>>;
  readonly runtime: ReactManagedRuntime;
  readonly scope: Scope_.Closeable;
};

function makeManagedRuntime(layer: Layer.Layer<never, unknown, never>): ReactManagedRuntime {
  return ManagedRuntime_.make(layer as unknown as Layer.Layer<unknown, never, never>);
}

function fromManagedRuntime(
  runtime: ReactManagedRuntime,
  scope: Scope_.Closeable
): EffectEvmRuntime {
  const runFork = <A, E, R>(
    effect: Effect.Effect<A, E, R>,
    options?: Effect.RunOptions | undefined
  ): Fiber.Fiber<A, E> =>
    runtime.runFork(effect as unknown as Effect.Effect<A, E, unknown>, options);

  const runPromise = <A, E, R>(
    effect: Effect.Effect<A, E, R>,
    options?: Effect.RunOptions | undefined
  ): Promise<A> => runtime.runPromise(effect as unknown as Effect.Effect<A, E, unknown>, options);

  const runPromiseExit = <A, E, R>(
    effect: Effect.Effect<A, E, R>,
    options?: Effect.RunOptions | undefined
  ): Promise<Exit.Exit<A, E>> =>
    runtime.runPromiseExit(effect as unknown as Effect.Effect<A, E, unknown>, options);

  return {
    runFork,
    runPromise,
    runPromiseExit,
    runtime,
    scope,
  };
}

export const buildRuntime = async (
  layer: Layer.Layer<never, unknown, never>
): Promise<EffectEvmRuntime> => {
  const runtime = makeManagedRuntime(layer);
  try {
    await runtime.context();
    const scope = await Effect_.runPromise(Scope_.make("sequential"));
    return fromManagedRuntime(runtime, scope);
  } catch (cause) {
    await runtime.dispose().catch(() => undefined);
    throw cause;
  }
};

export const buildRuntimeSync = (layer: Layer.Layer<never, unknown, never>): EffectEvmRuntime => {
  const runtime = makeManagedRuntime(layer);
  try {
    runtime.runSync(Effect_.context<unknown>());
    const scope = Effect_.runSync(Scope_.make("sequential"));
    return fromManagedRuntime(runtime, scope);
  } catch (cause) {
    void runtime.dispose().catch(() => undefined);
    throw cause;
  }
};

export const closeRuntime = async (runtime: EffectEvmRuntime): Promise<void> => {
  try {
    await Effect_.runPromise(Scope_.close(runtime.scope, Exit.void));
  } finally {
    await runtime.runtime.dispose();
  }
};
