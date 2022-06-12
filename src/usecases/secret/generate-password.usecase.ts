import { Result } from "@core/result";
import { IUseCase } from "@core/usecase";
import bcrypt from "bcryptjs";
import { singleton } from "tsyringe";

export interface IPassword {
  password: string;
}

export type IGeneratePasswordUseCase = IUseCase<IPassword, string>;

@singleton<IGeneratePasswordUseCase>()
export class GeneratePasswordUseCase implements IGeneratePasswordUseCase {
  async execute(data: IPassword): Promise<Result<string>> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);
    return Result.ok(password);
  }
}
