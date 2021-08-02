import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { FileUploadOnS3 } from 'App/Helpers/fileUpload';
// import * as sharp from 'sharp';

export default class FilesController {

  async uploadImage({request, response }: HttpContextContract) {
    // const imageConfiguration = [
    //   {
    //     imagePath: "334x192",
    //     height: 334,
    //     width: 192
    //   },
    //   {
    //     imagePath: "160x150",
    //     height: 160,
    //     width: 150
    //   },
    //   {
    //     imagePath: "375x280",
    //     height: 375,
    //     width: 280
    //   },
    //   {
    //     imagePath: "125x100",
    //     height: 125,
    //     width: 100
    //   },
    //   {
    //     imagePath: "328x202",
    //     height: 328,
    //     width: 202
    //   },
    //   {
    //     imagePath: "235x158",
    //     height: 235,
    //     width: 158
    //   },
    //   {
    //     imagePath: "576x250",
    //     height: 576,
    //     width: 250
    //   }
    // ];
    const files = request.files('images');

    for(const file of files){
      const fileName = file.clientName;
      const fileNameDir = fileName.split('.')[0];
      const directory = `property-files/${Date.now()}${fileNameDir}`;
      const name = await FileUploadOnS3.uploadFile(file, directory, fileName);
      console.log(name);
    }

    response.status(200).json({
      files
    })

  }



  async makeCopies({}: HttpContextContract){
    try {
     
      
    } catch (error) {
      
    }
  }
}
