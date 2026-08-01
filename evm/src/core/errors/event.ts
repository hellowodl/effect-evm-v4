import { Schema } from "effect";

export class EventDecodeError extends Schema.TaggedErrorClass<EventDecodeError>()(
  "EventDecodeError",
  {
    cause: Schema.optional(Schema.Unknown),
    log: Schema.Unknown,
    message: Schema.String,
  }
) {}

export class EventWatchError extends Schema.TaggedErrorClass<EventWatchError>()("EventWatchError", {
  cause: Schema.optional(Schema.Unknown),
  chainId: Schema.Number,
  message: Schema.String,
}) {}

export class EventBackfillError extends Schema.TaggedErrorClass<EventBackfillError>()(
  "EventBackfillError",
  {
    cause: Schema.optional(Schema.Unknown),
    chainId: Schema.Number,
    message: Schema.String,
  }
) {}
