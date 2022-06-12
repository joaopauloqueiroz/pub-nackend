import { Result } from "@core/result";

export interface IUseCase<D, R> {
  execute(data: D): Promise<Result<R>>;
}
