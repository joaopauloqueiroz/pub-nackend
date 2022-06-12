import { Type } from "@sinclair/typebox";

export const UserCreateSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String(),
});
