import { Effect, Layer, Scope } from "effect";
import { describe, expect, it } from "vitest";
import { buildRuntimeSync, closeRuntime } from "./runtime.js";

describe("react-hooks runtime", () => {
  it("runPromiseExit returns Success on success effects", async () => {
    const runtime = buildRuntimeSync(Layer.empty);
    const exit = await runtime.runPromiseExit(Effect.succeed(123));

    expect(exit._tag).toBe("Success");
    if (exit._tag === "Success") {
      expect(exit.value).toBe(123);
    }

    await closeRuntime(runtime);
  });

  it("runPromiseExit returns Failure on failed effects", async () => {
    const runtime = buildRuntimeSync(Layer.empty);
    const exit = await runtime.runPromiseExit(Effect.fail("nope"));

    expect(exit._tag).toBe("Failure");

    await closeRuntime(runtime);
  });

  it("closeRuntime closes hook and layer resources", async () => {
    const events: string[] = [];
    const layer = Layer.effectDiscard(
      Effect.acquireRelease(
        Effect.sync(() => {
          events.push("acquire layer");
        }),
        () =>
          Effect.sync(() => {
            events.push("release layer");
          })
      )
    );
    const runtime = buildRuntimeSync(layer);

    await runtime.runPromise(
      Scope.addFinalizer(
        runtime.scope,
        Effect.sync(() => {
          events.push("release hook");
        })
      )
    );
    await closeRuntime(runtime);

    expect(events).toEqual(["acquire layer", "release hook", "release layer"]);
  });
});
