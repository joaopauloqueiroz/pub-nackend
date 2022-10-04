import { Type } from "@sinclair/typebox";

export const OrderItemCreateSchema = Type.Object({
  orderId: Type.String(),
  productId: Type.String(),
  quantity: Type.Number(),
});
