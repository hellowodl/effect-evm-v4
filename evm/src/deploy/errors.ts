import { Schema } from "effect";

export class DeploymentError extends Schema.TaggedErrorClass<DeploymentError>()("DeploymentError", {
  cause: Schema.optional(Schema.Unknown),
  message: Schema.String,
}) {}

export class DeploymentRevertedError extends Schema.TaggedErrorClass<DeploymentRevertedError>()(
  "DeploymentRevertedError",
  {
    bytecode: Schema.String,
    message: Schema.String,
    revertData: Schema.optional(Schema.String),
  }
) {}

export class BytecodeMismatchError extends Schema.TaggedErrorClass<BytecodeMismatchError>()(
  "BytecodeMismatchError",
  {
    actual: Schema.String,
    address: Schema.String,
    expected: Schema.String,
    message: Schema.String,
  }
) {}
