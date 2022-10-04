import { StatusOrder } from "@prisma/client";
import { Type } from "@sinclair/typebox";

export const OrderCreateSchema = Type.Object({
  status: Type.Enum(StatusOrder),
  responsible: Type.String(),
  tableId: Type.String(),
});

export const ListOrderByDateAndStatus = Type.Object({
  status: Type.Enum(StatusOrder),
  start: Type.String(),
  end: Type.String(),
});
