import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import User from 'App/Models/User';
import { schema } from '@ioc:Adonis/Core/Validator';
// Transaltion
import i18n from 'App/Helpers/i18n';
const t = i18n.__;
import { FileUploadOnS3 } from 'App/Helpers/fileUpload';
import Env from '@ioc:Adonis/Core/Env';
import { S3_DIRECTORIES } from 'App/Constants/s3DirectoryConstants';
import SendOtp from 'App/Helpers/SendOtp';
export default class UsersController {

  /**
    * @api {get} /user/my-profile My Profile
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName my-profile
    * @apiGroup User
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 Created
    * {
    *    "data": [
    *        {
    *            "id": 19,
    *            "uid": "3f1e2577-3e27-4cae-8b96-309f42c5c620",
    *            "first_name": "Pukhraj ",
    *            "last_name": "saini",
    *            "dob": "6-5-2008",
    *            "avatar": null,
    *            "email": "pukhraj@mailinator.com",
    *            "country_code": null,
    *            "phone_number": "null",
    *            "username": null,
    *            "google_id": null,
    *            "facebook_id": null,
    *            "apple_id": null,
    *            "login_type": "EMAIL",
    *            "device_type": null,
    *            "is_active": 1,
    *            "is_verified": 0,
    *            "is_id_verified": 0,
    *            "is_deleted": 0,
    *            "created_at": "2021-06-15T15:21:07.000+05:30",
    *            "updated_at": "2021-06-15T15:21:07.000+05:30"
    *        }
    *    ]
    *   }
    * 
    * @apiErrorExample {json} Error-Response:
    *
    *     HTTP/1.1 500 Internal Serve Error
    *     {
    *        "message": "Something went wrong"
    *      }
    *
    */
  async getMyProfile({ auth, response }: HttpContextContract) {
    try {
      const user_id = auth.user?.uid;
      const user = await User.findBy('uid', user_id);
      return response.status(Response.HTTP_OK).json({
        data: [user]
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }

  /**
  * @api {post} /user/profile-photo Profile Photo
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
  * @apiVersion 1.0.0
  * @apiName profile-photo
  * @apiGroup User
  *
  * @apiParam {File} photo jpeg, jpg, png images
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 201 Created
  *     
  *   {
  *  "message": "Profile photo updated",
  *  "data": [
  *      {
  *          "avatar": "https://s3.me-south-1.amazonaws.com/roomz-files/user-profile-photos/1627900606600-10-Create your file.png"
  *      }
  *  ]
  *  }
  */

  async updateProfilePhoto({ auth, request, response }: HttpContextContract) {
    try {
      const user_id = auth.user?.uid;
      const photo: any = request.file('photo', {
        extnames: ['jpg', 'png', 'jpeg']
      });

      const image_name = `${Date.now()}-${photo.clientName}`;
      const image_url = await FileUploadOnS3.uploadFile(
        photo,
        S3_DIRECTORIES.userProfilePhotos,
        image_name
      );

      if (!image_url) {
        throw ('error');
      }

      const user = await User.findBy('uid', user_id);

      if (user?.avatar) {
        const avatar_key = user.avatar.split(S3_DIRECTORIES.userProfilePhotos)[1];
        console.log(avatar_key);
        const deleted = await FileUploadOnS3.removeFileFromS3(avatar_key);

        console.log('old profile pic deleted', deleted);
      }

      await User.query()
        .where({ uid: user_id })
        .update({ avatar: image_url });

      response.status(Response.HTTP_CREATED).json({
        message: t('Profile photo updated'),
        data: [{ avatar: `${Env.get('ASSET_URL_S3')}${image_url}` }]
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }



  /**
  * @api {put} /user/phone-number Update Phone Number
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
  * @apiVersion 1.0.0
  * @apiName phone-number
  * @apiGroup User
  *
  * @apiParam {String} phone_number Phone number.
  * @apiParam {String} country_code Country code with `phone_number`.
  * @apiParam {String} otp 
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 201 Created
  *  {
  *  "message": "Phone number updated",
  *  "data": [
  *      {
  *          "id": 19,
  *          "uid": "3f1e2577-3e27-4cae-8b96-309f42c5c620",
  *          "first_name": "Pukhraj ",
  *          "last_name": "saini",
  *          "dob": "6-5-2008",
  *          "avatar": "https://s3.me-south-1.amazonaws.com/roomz-files/ user-profile-photos/1627900606600-10-Create your file.png",
  *          "email": "pukhraj@mailinator.com",
  *          "country_code": "+91",
  *          "phone_number": "9882552978",
  *          "username": null,
  *          "google_id": null,
  *          "facebook_id": null,
  *          "apple_id": null,
  *          "login_type": "EMAIL",
  *          "device_type": null,
  *          "is_active": 1,
  *          "is_verified": 1,
  *          "is_id_verified": 0,
  *          "is_deleted": 0,
  *          "created_at": "2021-06-15T15:21:07.000+05:30",
  *          "updated_at": "2021-06-15T15:21:07.000+05:30"
  *      }
  *    ]
  *  } 
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Incorrect OTP"
  *     }
  *
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "OTP expired"
  *     }
  *
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Invalid phone number or counrty code"
  *     }  
  *   
  */


  async updatePhoneNumber({ request, auth, response }: HttpContextContract) {
    try {
      const validateSchema = schema.create({
        phone_number: schema.string(),
        country_code: schema.string(),
        otp: schema.string()
      });
      await request.validate({ schema: validateSchema });
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('validation Failed'),
        error: error.messages
      });
    }

    try {
      const user_id = auth.user?.uid;
      const phone_number = (request.input("phone_number") + '').replace(/^0+/, '');
      const country_code = request.input("country_code");
      const otp = request.input("otp");
      const classCtrl = new SendOtp();
      const otpRes = await classCtrl.verifyOtp(country_code + phone_number, otp);
      if (otpRes && typeof otpRes.status === 'string' && otpRes.valid) {
        await User.query()
          .where({ 'uid': user_id })
          .update({ phone_number, country_code, is_verified: 1 })

        const user = await User.query()
          .where({ uid: user_id })
          .finally();

        response.status(Response.HTTP_CREATED).json({
          message: t('Phone number updated'),
          data: user
        })
      } else if (otpRes && typeof otpRes.status === 'string' && otpRes.valid === false) {
        return response.status(Response.HTTP_BAD_REQUEST).json({
          message: t('Invalid verification code')
        });
      } else if (otpRes && otpRes.status === 404) {
        return response.status(Response.HTTP_OTP_EXPIRED).json({
          message: t('OTP expired')
        });
      } else {
        return response.status(Response.HTTP_BAD_REQUEST).json({
          message: t('OTP error')
        });
      }
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }
}
