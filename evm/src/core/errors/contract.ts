import { Schema } from "effect";

export class ContractReadError extends Schema.TaggedErrorClass<ContractReadError>()(
  "ContractReadError",
  {
    address: Schema.String,
    cause: Schema.optional(Schema.Unknown),
    functionName: Schema.String,
    message: Schema.String,
  }
) {}

export class SimulationFailedError extends Schema.TaggedErrorClass<SimulationFailedError>()(
  "SimulationFailedError",
  {
    address: Schema.String,
    calldata: Schema.optional(Schema.String),
    customErrorName: Schema.optional(Schema.String),
    functionName: Schema.String,
    message: Schema.String,
    phase: Schema.Literal("simulate"),
    revertData: Schema.optional(Schema.String),
    revertReason: Schema.optional(Schema.String),
    sender: Schema.optional(Schema.String),
    value: Schema.optional(Schema.String),
  }
) {}

export class GasEstimationError extends Schema.TaggedErrorClass<GasEstimationError>()(
  "GasEstimationError",
  {
    address: Schema.String,
    calldata: Schema.optional(Schema.String),
    cause: Schema.optional(Schema.Unknown),
    customErrorName: Schema.optional(Schema.String),
    functionName: Schema.String,
    message: Schema.String,
    phase: Schema.Literal("estimate"),
    revertData: Schema.optional(Schema.String),
    revertReason: Schema.optional(Schema.String),
    sender: Schema.optional(Schema.String),
    value: Schema.optional(Schema.String),
  }
) {}

export class ContractWriteError extends Schema.TaggedErrorClass<ContractWriteError>()(
  "ContractWriteError",
  {
    address: Schema.String,
    calldata: Schema.optional(Schema.String),
    cause: Schema.optional(Schema.Unknown),
    functionName: Schema.String,
    message: Schema.String,
    sender: Schema.optional(Schema.String),
    value: Schema.optional(Schema.String),
  }
) {}

export class MulticallError extends Schema.TaggedErrorClass<MulticallError>()("MulticallError", {
  cause: Schema.optional(Schema.Unknown),
  failedCalls: Schema.Number,
  message: Schema.String,
}) {}
