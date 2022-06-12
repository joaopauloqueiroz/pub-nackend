import { Status } from "@prisma/client";
import { Type } from "@sinclair/typebox";

export const TableCreateSchema = Type.Object({
  name: Type.String(),
  status: Type.Enum(Status),
});
