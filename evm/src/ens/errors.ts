import { Schema } from "effect";

export class EnsNameNotFoundError extends Schema.TaggedErrorClass<EnsNameNotFoundError>()(
  "EnsNameNotFoundError",
  {
    message: Schema.String,
    name: Schema.String,
  }
) {}

export class EnsReverseNameNotFoundError extends Schema.TaggedErrorClass<EnsReverseNameNotFoundError>()(
  "EnsReverseNameNotFoundError",
  {
    address: Schema.String,
    message: Schema.String,
  }
) {}

export class EnsTextNotFoundError extends Schema.TaggedErrorClass<EnsTextNotFoundError>()(
  "EnsTextNotFoundError",
  {
    key: Schema.String,
    message: Schema.String,
    name: Schema.String,
  }
) {}

export class EnsAvatarNotFoundError extends Schema.TaggedErrorClass<EnsAvatarNotFoundError>()(
  "EnsAvatarNotFoundError",
  {
    message: Schema.String,
    name: Schema.String,
  }
) {}

export class EnsResolverNotConfiguredError extends Schema.TaggedErrorClass<EnsResolverNotConfiguredError>()(
  "EnsResolverNotConfiguredError",
  {
    message: Schema.String,
    name: Schema.String,
  }
) {}

export class EnsResolutionError extends Schema.TaggedErrorClass<EnsResolutionError>()(
  "EnsResolutionError",
  {
    cause: Schema.optional(Schema.Unknown),
    message: Schema.String,
    name: Schema.String,
  }
) {}
