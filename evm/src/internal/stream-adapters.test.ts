import { describe, expect, it } from "@effect/vitest";
import { Cause, Effect, Exit, Stream } from "effect";
import { fromWatchCallback } from "./stream-adapters.js";

describe("fromWatchCallback", () => {
  it.effect("propagates synchronous watch setup defects", () =>
    Effect.gen(function* () {
      const setupError = new Error("watch setup failed");
      const exit = yield* Stream.runCollect(
        fromWatchCallback<number, Error>({
          mapError: (error) => (error instanceof Error ? error : new Error(String(error))),
          watch: () => {
            throw setupError;
          },
        })
      ).pipe(Effect.exit);

      expect(Exit.hasDies(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        expect(Cause.squash(exit.cause)).toBe(setupError);
      }
    })
  );

  it.effect("runs watch cleanup once when the consumer stops", () =>
    Effect.gen(function* () {
      let cleanups = 0;
      const stream = fromWatchCallback<number, Error>({
        mapError: (error) => (error instanceof Error ? error : new Error(String(error))),
        watch: ({ onData }) => {
          onData(1);
          return () => {
            cleanups += 1;
          };
        },
      });

      const values = yield* Stream.runCollect(Stream.take(stream, 1));

      expect(values).toEqual([1]);
      expect(cleanups).toBe(1);
    })
  );
});
