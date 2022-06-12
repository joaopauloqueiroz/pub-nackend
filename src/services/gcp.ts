import { Storage } from "@google-cloud/storage";
import { Result } from "@core/result";
import { ErrorCode } from "@consts/error";
import { Readable } from "stream";

export interface ICloudStorageService {
  create(fileBuffer: Buffer, path: string): Promise<Result<boolean>>;
}

export class CloudStorageService implements ICloudStorageService {
  private readonly storage: Storage;
  constructor() {
    this.storage = new Storage({
      keyFilename: "src/config/credentials_service.json",
    });
  }

  create(fileBuffer: Buffer, path: string): Promise<Result<boolean>> {
    return new Promise((resolve, reject) => {
      const readStream = Readable.from(fileBuffer);
      const writeStream = this.storage
        .bucket(process.env.GCS_BUCKET as string)
        .file("myFileStream.jpg")
        .createWriteStream();

      readStream
        .pipe(writeStream)
        .on("finish", () => {
          resolve(Result.ok(true));
        })
        .on("error", (error) => {
          console.log(error);
          reject(Result.fail(ErrorCode.UPDATE_DOCUMENT_GCP));
        });
    });
  }
}
