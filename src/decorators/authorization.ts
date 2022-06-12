import { container } from "tsyringe";
import {
  TokenValidateSession,
  IValidateTokendUseCase,
} from "@usecases/secret/token-validate.usecase";
import context from "src/lib/async-context";

export const Authorization = (
  _: any,
  __: any,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;
  const jwtService =
    container.resolve<IValidateTokendUseCase>(TokenValidateSession);

  descriptor.value = async function (...args: any[]) {
    const [req, res] = args;

    const headerToken = req.headers.authorization;

    if (!headerToken) {
      return res.code(401).send();
    }

    const token = headerToken.split(" ");

    if (token.length != 2 || token[0].toLowerCase() !== "bearer") {
      return res.code(401).send();
    }

    let result = await jwtService.execute({ token: token[1] });

    if (result.isFailure) {
      return res.code(401).send();
    }

    const map = new Map();
    map.set("session", result.getValue()?.data);

    context.run(map, () => {
      result = originalMethod.apply(this, args);
    });
  };
};
