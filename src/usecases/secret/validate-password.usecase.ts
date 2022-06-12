import { Result } from "@core/result";
import { IUseCase } from "@core/usecase";
import bcrypt from "bcryptjs";
import { singleton } from "tsyringe";

export interface IPassword {
  password: string;
  passwordHash: string;
}

export type IValidatePasswordUseCase = IUseCase<IPassword, boolean>;

@singleton<IValidatePasswordUseCase>()
export class ValidatePasswordUseCase implements IValidatePasswordUseCase {
  async execute(data: IPassword): Promise<Result<boolean>> {
    const passwordIsValid = await bcrypt.compare(
      data.password,
      data.passwordHash
    );
    return Result.ok(passwordIsValid);
  }
}
