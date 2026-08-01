import type * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Fiber from "effect/Fiber";
import { constVoid as noop } from "effect/Function";
import * as Scope_ from "effect/Scope";
import type { EffectEvmRuntime } from "./runtime.js";

export type ScopedRun = {
  readonly close: () => void;
  readonly fork: <A, E, R>(effect: Effect.Effect<A, E, R>) => Fiber.Fiber<A, E>;
  readonly scope: Scope_.Closeable;
};

export const makeScopedRun = async (runtime: EffectEvmRuntime): Promise<ScopedRun> => {
  const scope = await runtime.runPromise(Scope_.fork(runtime.scope, "sequential"));
  let closed = false;

  const close = () => {
    if (closed) {
      return;
    }
    closed = true;
    runtime.runPromise(Scope_.close(scope, Exit.succeed(undefined))).catch(noop);
  };

  const fork = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    runtime.runFork(Scope_.provide(scope)(effect), {
      onFiberStart: Fiber.runIn(scope),
    });

  return { close, fork, scope };
};
