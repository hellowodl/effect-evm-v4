import { Schema } from "effect";

export class SignMessageError extends Schema.TaggedErrorClass<SignMessageError>()(
  "SignMessageError",
  {
    cause: Schema.optional(Schema.Unknown),
    message: Schema.String,
  }
) {}

export class SignTypedDataError extends Schema.TaggedErrorClass<SignTypedDataError>()(
  "SignTypedDataError",
  {
    cause: Schema.optional(Schema.Unknown),
    message: Schema.String,
  }
) {}

export class SignTxError extends Schema.TaggedErrorClass<SignTxError>()("SignTxError", {
  cause: Schema.optional(Schema.Unknown),
  message: Schema.String,
}) {}

export class WalletConnectionError extends Schema.TaggedErrorClass<WalletConnectionError>()(
  "WalletConnectionError",
  {
    cause: Schema.optional(Schema.Unknown),
    message: Schema.String,
  }
) {}

export class ChainSwitchError extends Schema.TaggedErrorClass<ChainSwitchError>()(
  "ChainSwitchError",
  {
    cause: Schema.optional(Schema.Unknown),
    chainId: Schema.Number,
    message: Schema.String,
  }
) {}

export class AddChainError extends Schema.TaggedErrorClass<AddChainError>()("AddChainError", {
  cause: Schema.optional(Schema.Unknown),
  chainId: Schema.Number,
  message: Schema.String,
}) {}

export class AccountNotConnectedError extends Schema.TaggedErrorClass<AccountNotConnectedError>()(
  "AccountNotConnectedError",
  {
    message: Schema.String,
  }
) {}

export class WatchAssetError extends Schema.TaggedErrorClass<WatchAssetError>()("WatchAssetError", {
  cause: Schema.optional(Schema.Unknown),
  message: Schema.String,
}) {}
