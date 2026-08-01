import { describe, expect, it } from "@effect/vitest";
import { Cause, Effect, Exit, Layer, Stream } from "effect";
import { erc20Abi } from "viem";
import type { EventWatchError } from "#src/core/index.js";
import { ClientNotFoundError } from "#src/core/index.js";
import type { DecodedEvent } from "#src/events/index.js";
import { EventStream, ReliableEventStream, ReliableEventStreamLive } from "#src/events/index.js";
import {
  makeMockPublicClientLayer,
  TEST_ADDRESS,
  UNKNOWN_CHAIN_ID,
} from "#src/testing-kit/index.js";

describe("ReliableEventStream - Simple", () => {
  it.effect("ClientNotFoundError when chainId invalid", () =>
    Effect.gen(function* () {
      const layers = Layer.provide(
        ReliableEventStreamLive,
        Layer.merge(
          Layer.succeed(EventStream, {
            decodeReceipt: () => Effect.succeed([]),
            watch: () =>
              Effect.succeed(
                Stream.callback<DecodedEvent<typeof erc20Abi, "Transfer">, EventWatchError>(
                  () => Effect.void
                )
              ),
          } as EventStream["Service"]),
          makeMockPublicClientLayer()
        )
      );

      const reliableStream = yield* Effect.provide(ReliableEventStream, layers);
      const exit = yield* Effect.exit(
        reliableStream.watch({
          abi: erc20Abi,
          address: TEST_ADDRESS,
          chainId: UNKNOWN_CHAIN_ID,
          eventName: "Transfer",
        })
      );

      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        const error = Cause.findErrorOption(exit.cause);
        expect(error._tag).toBe("Some");
        if (error._tag === "Some") {
          expect(error.value).toBeInstanceOf(ClientNotFoundError);
        }
      }
    })
  );
});
