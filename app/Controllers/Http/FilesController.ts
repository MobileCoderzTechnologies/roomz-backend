import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import Response from "App/Helpers/Response";
import { FileUploadOnS3 } from 'App/Helpers/fileUpload';
// import { S3_DIRECTORIES } from 'App/Constants/s3DirectoryConstants';
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

export default class FilesController {

  async uploadImage({ request, response }: HttpContextContract) {
    try {
      const files = request.files('images');
      const response_arr: { image_url: string }[] = [];
      for (const file of files) {
        const file_name = file.clientName;
        const file_name_dir = file_name.split('.')[0];
        const directory = `property-files/${file_name_dir}`;
        const name = await FileUploadOnS3.uploadFile(file, directory, file_name, null);
        await FileUploadOnS3.makeImageCopies(file, directory);

        if (name) {
          const image_url = `${Env.get('ASSET_URL_S3')}${name}`;
          response_arr.push({
            image_url
          });
        }
      }
      response.status(200).json({
        data: response_arr
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }

  }
}
