import Env from '@ioc:Adonis/Core/Env';
import { IMAGE_SIZES } from 'App/Constants/ImageSizesConstant';
import { S3 } from 'aws-sdk';
import fs from 'fs';
// import Jimp from 'jimp';
import sharp from 'sharp';

export class FileUploadOnS3 {

  constructor() {
  }

  static async uploadFile(
    file: any,
    directory: string,
    fileName: string,
    fileStream?: any
  ) {
    try {
      const file_stream = fileStream ? fileStream : fs.readFileSync(file.tmpPath)
      const s3 = new S3({
        accessKeyId: Env.get('S3_KEY'),
        secretAccessKey: Env.get('S3_SECRET'),
        region: Env.get('S3_REGION')
      });
      const fileRemoteName = `${directory}/${fileName}`;
      console.log(fileRemoteName);
      return await s3.putObject({
        Bucket: Env.get('S3_BUCKET'),
        Body: file_stream,
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

  static async makeImageCopies(file: any, directory: string,) {
    try {
      const imageConfiguration = IMAGE_SIZES;

      for (const imgConfig of imageConfiguration) {
        const buffer = fs.readFileSync(file.tmpPath);
        const resized_image = await sharp(buffer)
          .resize(imgConfig.width, imgConfig.height)
          .toFormat("jpeg")
          .toBuffer()
          .then((res) => {
            return res
          });
        console.log('resized_image');
        console.log(resized_image);
        await this.uploadFile(file, directory, `${imgConfig.imagePath}.jpeg`, resized_image);
      }
      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}