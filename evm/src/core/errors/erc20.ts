import { Schema } from "effect";

/** Token allowance check failed */
export class ApprovalCheckError extends Schema.TaggedErrorClass<ApprovalCheckError>()(
  "ApprovalCheckError",
  {
    cause: Schema.optional(Schema.Unknown),
    message: Schema.String,
    owner: Schema.String,
    spender: Schema.String,
    tokenAddress: Schema.String,
  }
) {}

/** Token approval transaction failed */
export class ApprovalError extends Schema.TaggedErrorClass<ApprovalError>()("ApprovalError", {
  cause: Schema.optional(Schema.Unknown),
  message: Schema.String,
  spender: Schema.String,
  tokenAddress: Schema.String,
}) {}
