import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Response from "App/Helpers/Response";
import Admin from "App/Models/Admin";
import User from "App/Models/User";
// Transaltion
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

export default class AdminController {

  /**
  * @api {post} /admin/login Login
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiVersion 1.0.0
  * @apiName Login
  * @apiGroup Admin
  *
  * @apiParam {String} email Email.
  * @apiParam {String} password Password.
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *         "message": "Login successfully",
  *         "data": {
  *             "admin": {
  *                 "id": 3
  *                 "email": "admin@roomz.com",
  *                 "country_code": "+91",
  *                 "mobile_number": "90******99",
  *                 "created_at": "2020-08-17 19:58:42",
  *                 "updated_at": "2020-08-17 19:58:42",
  *             },
  *             "accessToken": {
  *                 "type": "bearer",
  *                 "token": "eyJhbGciOiJIUzI1NiI...............lREODosHjzx95uM-jA",
  *                 "refreshToken": null
  *             }
  *         }
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 401 Unauthorized
  *     {
  *       "message": "Invalid credentials",
  *     }
  *
  */
  async login({ request, auth, response }: HttpContextContract) {

    const validatoionSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.maxLength(255)
      ]),
      password: schema.string({ trim: true }),
    })
    try {
      await request.validate({ schema: validatoionSchema })
    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: e.messages(),
      });
    }
    const email = request.input('email');
    const password = request.input('password');
    try {
      const admin: any = await Admin.findBy('email', email);
      if (admin) {
        const accessToken = await auth.use('api').attempt(email, password)
        const data = {
          admin: admin,
          accessToken: accessToken
        };
        return response.status(Response.HTTP_OK).json({
          message: t('Login successfully'),
          data: data
        });
      } else {
        return response.status(Response.HTTP_FORBIDDEN).json({
          message: t('Invalid credentials'),
        });
      }
    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_FORBIDDEN).json({
        message: t('Invalid credentials'),
      });
    }
  }

  /**
  * @api {post} /admin/change_password Change Password
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............lREODosHjzx95uM-jA.
  * @apiVersion 1.0.0
  * @apiName ChangePassword
  * @apiGroup Admin
  * 
  * @apiParam {String} old_password Old Password.
  * @apiParam {String} new_password New Password.
  * @apiParam {String} confirm_password Confirm Password.
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "message": "Password changed successfully",
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Incorrect current password",
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Passwords not matched",
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Password must have 7-15 characters",
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Something went wrong",
  *     }
  *
  */
  async changePassword({ request, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const validatoionSchema = schema.create({
      old_password: schema.string({ trim: true }),
      new_password: schema.string({ trim: true }),
      confirm_password: schema.string({ trim: true }),
    })
    try {
      await request.validate({ schema: validatoionSchema })
    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: e.messages(),
      });
    }
    if (!auth.isLoggedIn) {
      return response.status(Response.HTTP_UNAUTHORIZED).json({
        message: t('Unathorized'),
      });
    }
    const admin_id = auth.user?.id;
    const email = auth.user?.email ?? '';
    const old_password = request.input('old_password');
    const new_password = request.input('new_password');
    const confirm_password = request.input('confirm_password');
    try {
      if (await auth.attempt(email, old_password)) {
        if (new_password !== confirm_password) {
          return response.status(Response.HTTP_BAD_REQUEST).json({
            message: t('Passwords not matched'),
          });
        }
        if (new_password.length < 6 || new_password.length > 15) {
          return response.status(Response.HTTP_BAD_REQUEST).json({
            message: t('Password must have 6-15 characters'),
          });
        }
        const user = await User.find(admin_id);
        const admin = await Admin.findBy('email', email);
        if (admin && user) {
          user.password = new_password;
          admin.password = new_password;
          await admin?.save()
          await user?.save()
          return response.status(Response.HTTP_OK).json({
            message: t('Password changed successfully')
          });
        }
        return response.status(Response.HTTP_BAD_REQUEST).json({
          message: t('Something went wrong')
        });
      }
    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Incorrect current password'),
      });
    }

  }
}
