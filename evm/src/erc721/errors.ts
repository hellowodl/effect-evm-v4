import { Schema } from "effect";

export class Erc721OwnerNotFoundError extends Schema.TaggedErrorClass<Erc721OwnerNotFoundError>()(
  "Erc721OwnerNotFoundError",
  {
    address: Schema.String,
    chainId: Schema.Number,
    message: Schema.String,
    tokenId: Schema.BigInt,
  }
) {}

export class Erc721NoTokenURIError extends Schema.TaggedErrorClass<Erc721NoTokenURIError>()(
  "Erc721NoTokenURIError",
  {
    address: Schema.String,
    chainId: Schema.Number,
    message: Schema.String,
    tokenId: Schema.BigInt,
  }
) {}

export class Erc721MetadataFetchError extends Schema.TaggedErrorClass<Erc721MetadataFetchError>()(
  "Erc721MetadataFetchError",
  {
    address: Schema.String,
    cause: Schema.optional(Schema.Unknown),
    chainId: Schema.Number,
    message: Schema.String,
    tokenId: Schema.BigInt,
    uri: Schema.String,
  }
) {}

export class Erc721TransferError extends Schema.TaggedErrorClass<Erc721TransferError>()(
  "Erc721TransferError",
  {
    address: Schema.String,
    cause: Schema.optional(Schema.Unknown),
    from: Schema.String,
    message: Schema.String,
    to: Schema.String,
    tokenId: Schema.BigInt,
  }
) {}
