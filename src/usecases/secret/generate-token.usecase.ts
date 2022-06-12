import { Result } from "@core/result";
import { IUseCase } from "@core/usecase";
import { User } from "@prisma/client";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { singleton } from "tsyringe";

export type IGenerateTokenUseCase = IUseCase<User, string>;

@singleton<IGenerateTokenUseCase>()
export class GenerateTokenUseCase implements IGenerateTokenUseCase {
  async execute(user: Omit<User, "password">): Promise<Result<string>> {
    const token = await Jwt.sign(user, process.env.SECRET as string);
    return Result.ok(token);
  }
}
