import { Type } from "@sinclair/typebox";

export const UserAuthSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});
