import { Schema } from "effect";

export class SubscriptionNotSupportedError extends Schema.TaggedErrorClass<SubscriptionNotSupportedError>()(
  "SubscriptionNotSupportedError",
  {
    chainId: Schema.Number,
    message: Schema.String,
    subscriptionType: Schema.String,
  }
) {}

export class SubscriptionDroppedError extends Schema.TaggedErrorClass<SubscriptionDroppedError>()(
  "SubscriptionDroppedError",
  {
    chainId: Schema.Number,
    message: Schema.String,
    subscriptionType: Schema.String,
  }
) {}
