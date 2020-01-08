import fs from "fs";
import AWS from "aws-sdk";
import path from "path";
import { Service } from "./index.service";

interface AWSService extends Service {
  uploadFile: (file: any) => void;
  deleteFile: (fileUUID: string) => void;
  deleteFiles: (fileUUIDArray: string[]) => void;
}

let s3: AWS.S3;
const root = path.dirname((require.main as NodeModule).filename);
const extension = "pdf";

const awsService: AWSService = {
  init: async () => {
    try {
      s3 = new AWS.S3({
        accessKeyId: process.env.AWS_KEYID,
        secretAccessKey: process.env.AWS_SECRETKEY
      } as any);
      console.log("AWS service initialized");
    } catch (error) {
      throw error;
    }
  },
  uploadFile: async file => {
    if (!s3) throw new Error("AWS service not yet initialized");
    if (!file.uuid) throw new Error("File has no uuid");
    let _uuid = file.uuid;
    try {
      let _file = fs.readFileSync(`${root}/${file.path}`);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${_uuid}.${extension}`,
        Body: _file,
        ACL: "public-read",
        ContentType: "application/pdf"
      };

      s3.upload(params, (s3Err: Error, data: AWS.S3.ManagedUpload.SendData) => {
        if (s3Err) throw s3Err;
        console.log(`File uploaded successfully at ${data.Location}`);
        `${root}/${file.path}`;
        return _uuid;
      });
    } catch (error) {
      fs.unlinkSync(`${root}/${file.path}`);
      throw error;
    }
  },
  deleteFile: fileUUID => {
    return new Promise((resolve, reject) => {
      s3.deleteObject(
        {
          Key: `${fileUUID}.${extension}`,
          Bucket: process.env.AWS_BUCKET as string
        },
        (err, data) => {
          if (err) {
            reject(err);
          }
          console.log(`File ${fileUUID} deleted succefully.`);
          resolve("OK");
        }
      );
    });
  },
  deleteFiles: async fileUUIDArray => {
    let promiseArray = fileUUIDArray.map(fileUUID => this.deleteFile(fileUUID));
    try {
      let result = await Promise.all(promiseArray);
      return result;
    } catch (err) {
      throw err;
    }
  }
};

export { awsService };
