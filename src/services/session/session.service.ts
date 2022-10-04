import { User } from "@prisma/client";
import context from "src/lib/async-context";

export interface SessionServiceDTO {
  user: User;
}

export class SessionService {
  static getSession(): SessionServiceDTO {
    const store = context.getStore();
    if (!store) {
      throw new Error("This service has no authentication");
    }

    return store.get("session") as SessionServiceDTO;
  }
}
