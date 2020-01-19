import fs from "fs";
import AWS from "aws-sdk";
import path from "path";
import uuid from "uuid";
import { Service } from "./index.service";
import { File } from "fastify-multer/lib/interfaces";

interface AWSService extends Service {
  uploadFile: (
    file: File & { uuid?: string },
    extension: string
  ) => Promise<string>;
  deleteFile: (fileUUID: string, extension: string) => Promise<void>;
  deleteFiles: (fileUUIDArray: string[], extension: string) => Promise<void>;
}

let s3: AWS.S3;
const root = path.dirname((require.main as NodeModule).filename);

const awsService: AWSService = {
  init: async () => {
    try {
      s3 = new AWS.S3({
        accessKeyId: process.env.AWS_KEYID,
        secretAccessKey: process.env.AWS_SECRETKEY
      } as any);
      console.log("[AWS] AWS service initialized");
    } catch (error) {
      console.log("[AWS] Error during AWS service initialization");
      throw error;
    }
  },
  uploadFile: async (file, extension) => {
    if (!s3) throw new Error("[AWS] AWS service not initialized yet");
    if (!file.uuid)
      console.log(`[AWS] File ${file.filename} has no uuid, creating uuid`);
    const _uuid = file.uuid || uuid.v4();
    console.log(`[AWS] Assigned uuid ${_uuid} to file ${file.filename}`);
    try {
      const _file = fs.readFileSync(`${root}/${file.path}`);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${_uuid}.${extension}`,
        Body: _file,
        ACL: "public-read",
        ContentType: file.mimetype || "application/octet-stream"
      };

      return await new Promise((resolve, reject) => {
        s3.upload(
          params,
          (s3Err: Error, data: AWS.S3.ManagedUpload.SendData) => {
            try {
              if (s3Err) throw s3Err;
              console.log(
                `[AWS] File uploaded successfully at ${data.Location}`
              );
              `${root}/${file.path}`;
              fs.unlinkSync(`${root}/${file.path}`);
              console.log(
                `[AWS] Deleting file ${root}/${file.path} from temp directory`
              );
              resolve(_uuid);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.log("[AWS] Error during file upload");
      console.log(
        `[AWS] Deleting file ${root}/${file.path} from temp directory`
      );
      fs.unlinkSync(`${root}/${file.path}`);
      throw error;
    }
  },
  deleteFile: (fileUUID, extension) => {
    try {
      if (!s3) throw new Error("[AWS] AWS service not initialized yet");
      return new Promise((resolve, reject) => {
        s3.deleteObject(
          {
            Key: `${fileUUID}.${extension}`,
            Bucket: process.env.AWS_BUCKET as string
          },
          (s3Err: Error, data: AWS.S3.DeleteObjectOutput) => {
            if (s3Err) {
              reject(s3Err);
            }
            console.log(`[AWS] File ${fileUUID} deleted succefully.`);
            resolve;
          }
        );
      });
    } catch (error) {
      console.log("[AWS] Error during file deletion");
      throw error;
    }
  },
  deleteFiles: async (fileUUIDArray, extension) => {
    try {
      if (!s3) throw new Error("[AWS] AWS service not initialized yet");
      await Promise.all(
        fileUUIDArray.map(fileUUID => this.deleteFile(fileUUID))
      );
      console.log("[AWS] All files deleted succefully.");
    } catch (error) {
      console.log("[AWS] Error during files deletion");
      throw error;
    }
  }
};

export { awsService };
