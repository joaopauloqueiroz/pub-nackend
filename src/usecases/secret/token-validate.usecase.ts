import { Result } from "@core/result";
import { IUseCase } from "@core/usecase";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { singleton } from "tsyringe";

export interface IToken {
  token: string;
}

export type IValidateTokendUseCase = IUseCase<IToken, JwtPayload>;

@singleton<IValidateTokendUseCase>()
export class TokenValidateSession implements IValidateTokendUseCase {
  async execute(data: IToken): Promise<Result<JwtPayload>> {
    try {
      const decoded = Jwt.verify(
        data.token,
        process.env.SECRET as string
      ) as JwtPayload;
      return Result.ok(decoded);
    } catch (err) {
      return Result.fail(err);
    }
  }
}
