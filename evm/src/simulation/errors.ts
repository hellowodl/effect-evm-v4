import { Schema } from "effect";

export class SimulationError extends Schema.TaggedErrorClass<SimulationError>()("SimulationError", {
  cause: Schema.optional(Schema.Unknown),
  message: Schema.String,
}) {}

export class TenderlyApiError extends Schema.TaggedErrorClass<TenderlyApiError>()(
  "TenderlyApiError",
  {
    message: Schema.String,
    response: Schema.optional(Schema.Unknown),
    statusCode: Schema.Number,
  }
) {}

export class TenderlyRateLimitError extends Schema.TaggedErrorClass<TenderlyRateLimitError>()(
  "TenderlyRateLimitError",
  {
    message: Schema.String,
    retryAfter: Schema.optional(Schema.Number),
  }
) {}

export class TenderlyNotConfiguredError extends Schema.TaggedErrorClass<TenderlyNotConfiguredError>()(
  "TenderlyNotConfiguredError",
  {
    message: Schema.String,
    missingConfig: Schema.Array(Schema.String),
  }
) {}
