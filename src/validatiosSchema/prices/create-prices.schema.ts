import { Type } from "@sinclair/typebox";

export enum IPrices {
  BR = "blr",
}

export const PriceCreateSchema = Type.Object({
  unit_amount: Type.Number(),
  currency: Type.Enum(IPrices),
  product: Type.String(),
});
