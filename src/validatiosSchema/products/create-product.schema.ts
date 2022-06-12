import { Type } from "@sinclair/typebox";

export const ProductCreateSchema = Type.Object({
  name: Type.String(),
  price: Type.Number(),
  description: Type.String(),
});
