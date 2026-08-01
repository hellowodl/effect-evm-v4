import { Schema } from "effect";

export class GasPriceUnavailableError extends Schema.TaggedErrorClass<GasPriceUnavailableError>()(
  "GasPriceUnavailableError",
  {
    cause: Schema.optional(Schema.Unknown),
    chainId: Schema.Number,
    message: Schema.String,
  }
) {}
