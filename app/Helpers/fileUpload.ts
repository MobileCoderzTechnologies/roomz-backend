import Env from '@ioc:Adonis/Core/Env';
import { S3 } from 'aws-sdk';
import fs from 'fs';
export class FileUploadOnS3 {
  constructor() {

  }

  static async uploadFile(file: any, directory: string, fileName: string) {
    try {
      const s3 = new S3({
        accessKeyId: Env.get('S3_KEY'),
        secretAccessKey: Env.get('S3_SECRET'),
        region: Env.get('S3_REGION')
      });
      const fileRemoteName = `${directory}/${fileName}`;
      console.log(fileRemoteName);
      return await s3.putObject({
        Bucket: Env.get('S3_BUCKET'),
        Body: fs.readFileSync(file.tmpPath),
        ContentType: file.headers['content-type'],
        Key: fileRemoteName,
        ACL: 'public-read'
      }).promise()
        .then(res => {
          console.log(res);
          return fileRemoteName;
        });
    } catch (err) {
      console.log('failed:', err);
      return false;
    }
  }


  static async removeFileFromS3(fileRemoteName) {
    try {
      const s3 = new S3({
        accessKeyId: Env.get('S3_KEY'),
        secretAccessKey: Env.get('S3_SECRET'),
        region: Env.get('S3_REGION')
      });
      const params = {
        Bucket: Env.get('S3_BUCKET'),
        Delete: {
          Objects: [{
            Key: fileRemoteName
          }]
        }
      };
      await s3.deleteObjects(params);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}