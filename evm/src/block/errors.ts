import { Schema } from "effect";

export class BlockNotFoundError extends Schema.TaggedErrorClass<BlockNotFoundError>()(
  "BlockNotFoundError",
  {
    blockIdentifier: Schema.String,
    chainId: Schema.Number,
    message: Schema.String,
  }
) {}

export class BlockTimeoutError extends Schema.TaggedErrorClass<BlockTimeoutError>()(
  "BlockTimeoutError",
  {
    blockNumber: Schema.BigInt,
    chainId: Schema.Number,
    message: Schema.String,
    timeout: Schema.Number,
  }
) {}
