import { Schema } from "effect";

export class SignatureVerificationError extends Schema.TaggedErrorClass<SignatureVerificationError>()(
  "SignatureVerificationError",
  {
    cause: Schema.optional(Schema.Unknown),
    message: Schema.String,
    signature: Schema.String,
  }
) {}

export class SignatureRecoveryError extends Schema.TaggedErrorClass<SignatureRecoveryError>()(
  "SignatureRecoveryError",
  {
    cause: Schema.optional(Schema.Unknown),
    message: Schema.String,
    signature: Schema.String,
  }
) {}

export class InvalidSignatureError extends Schema.TaggedErrorClass<InvalidSignatureError>()(
  "InvalidSignatureError",
  {
    message: Schema.String,
    signature: Schema.String,
  }
) {}
