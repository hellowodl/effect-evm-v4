import { Schema } from "effect";

export class ClientNotFoundError extends Schema.TaggedErrorClass<ClientNotFoundError>()(
  "ClientNotFoundError",
  {
    chainId: Schema.Number,
    message: Schema.String,
  }
) {}

export class WalletNotConnectedError extends Schema.TaggedErrorClass<WalletNotConnectedError>()(
  "WalletNotConnectedError",
  {
    chainId: Schema.Number,
    message: Schema.String,
  }
) {}

export class WrongNetworkError extends Schema.TaggedErrorClass<WrongNetworkError>()(
  "WrongNetworkError",
  {
    actualChainId: Schema.Number,
    expectedChainId: Schema.Number,
    message: Schema.String,
  }
) {}

export class TransportError extends Schema.TaggedErrorClass<TransportError>()("TransportError", {
  cause: Schema.optional(Schema.Unknown),
  message: Schema.String,
  url: Schema.String,
}) {}
