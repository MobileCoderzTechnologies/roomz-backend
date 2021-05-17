import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { v4 as uuid } from "uuid";
import Response from "App/Helpers/Response";
import SendOtp from "App/Helpers/SendOtp";
import User from "App/Models/User";
// Transaltion
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

export default class AuthController {

  /**
  * @api {post} /auth/check_account Check Account
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiVersion 1.0.0
  * @apiName CheckAccount
  * @apiGroup Auth
  *
  * @apiParam {String} [email] Email Id.
  * @apiParam {String} [phone_number] Phone number with `country_code`.
  * @apiParam {String} [country_code] Country code with `phone_number`.
  *
  * @apiSuccessExample {json} Success-Response:
  *     [When account is NOT exists with phone number, An OTP will be sent]
  *     HTTP/1.1 200 OK 
  *     {
  *         "otpSid": "VE44b2561601a6e9014bc7bd7b097eb5dd",
  *         "message": "Otp sent on your phone number"
  *     }
  * 
  *     [When account is NOT exists with Email, go to Sign up screen]
  *     HTTP/1.1 201 Created
  *     {
  *       "message": "Create Account"
  *     }
  *     
  *     [When account is exists with Email, go to Login password screen]
  *     HTTP/1.1 202 ACCEPTED 
  *     {
  *       "message": "Welcome back, Amit",
  *       "email": "kaushikabhi999@gmail.com",
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  * 
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Email or Phone number required"
  *     }
  *
  */
  async checkAccount({ request, response }: HttpContextContract) {

    const phone_number = (request.input("phone_number") + '').replace(/^0+/, '');
    const country_code = request.input('country_code');
    const email = request.input('email');
    if (email) {
      const user = await User.findBy('email', email.trim());
      if (user) {
        return response.status(Response.HTTP_ACCEPTED).json({
          email: user.email,
          message: t("Welcome back, %s", user.first_name)
        });
      } else {
        return response.status(Response.HTTP_CREATED).json({
          message: t("Create Account")
        });
      }
    } else if (phone_number && country_code) {
      const user = await User
        .query()
        .where('country_code', country_code)
        .where('phone_number', phone_number)
        .first()
      if (user) {
        return response.status(Response.HTTP_ACCEPTED).json({
          email: user.email,
          message: t("Welcome back, %s", user.first_name)
        });
      } else {
        return await this.sendOtp(request, response);
      }
    } else {
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t("Email or Phone number required")
      });
    }
  }

  async sendOtp(request, response) {

    const validatoionSchema = schema.create({
      phone_number: schema.number(),
      country_code: schema.string({ trim: true }),
    })

    try {
      await request.validate({ schema: validatoionSchema })
    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Invalid phone number or counrty code'),
      });
    }
    const phone_number = (request.input("phone_number") + '').replace(/^0+/, '');
    const country_code = request.input("country_code");

    const classCtrl = new SendOtp();
    const otpSid = await classCtrl.sendOtp(country_code + phone_number);
    if (otpSid && typeof otpSid === 'string') {
      return response.status(Response.HTTP_OK).json({
        otpSid: otpSid,
        message: t('Otp sent on your phone number')
      });
    } else {
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Otp not sent')
      });
    }
  }

  /**
  * @api {post} /auth/resend_otp Resend OTP
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiVersion 1.0.0
  * @apiName ResendOtp
  * @apiGroup Auth
  *
  * @apiParam {String} phone_number Phone number.
  * @apiParam {String} country_code Country code with `phone_number`.
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *         "otpSid": "VE44b2561601a6e9014bc7bd7b097eb5dd",
  *         "message": "Otp sent on your phone number"
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Otp not sent"
  *     }
  * 
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Invalid phone number or counrty code"
  *     }
  *
  */
  async reSendOtp({ request, response }: HttpContextContract) {

    const validatoionSchema = schema.create({
      phone_number: schema.number(),
      country_code: schema.string({ trim: true }),
    })

    try {
      await request.validate({ schema: validatoionSchema })
    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Invalid phone number or counrty code'),
      });
    }
    return await this.sendOtp(request, response);
  }

  /**
  * @api {post} /auth/verify_otp Verify OTP
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiVersion 1.0.0
  * @apiName VerifyOtp
  * @apiGroup Auth
  *
  * @apiParam {Number} phone_number Phone number.
  * @apiParam {String} country_code Country code with `phone_number`.
  * @apiParam {Number} otp One Time Password.
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *        "status": "approved",
  *        "message": "Phone number verified"
  *     }
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
  async verifyOtp({ request, response }: HttpContextContract) {

    const validatoionSchema = schema.create({
      phone_number: schema.number(),
      country_code: schema.string({ trim: true }),
      otp: schema.number()
    })

    try {
      await request.validate({ schema: validatoionSchema })
    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Invalid phone number or counrty code or OTP'),
      });
    }

    const phone_number = (request.input("phone_number") + '').replace(/^0+/, '');
    const country_code = request.input("country_code");
    const otp = request.input("otp");
    const classCtrl = new SendOtp();
    const otpRes = await classCtrl.verifyOtp(country_code + phone_number, otp);
    if (otpRes && typeof otpRes.status === 'string' && otpRes.valid) {
      return response.status(Response.HTTP_OK).json({
        status: otpRes.status,
        message: t('Phone number verified')
      });
    } else if (otpRes && typeof otpRes.status === 'string' && otpRes.valid === false) {
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Incorrect OTP')
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
  }

  /**
  * @api {post} /auth/register Register
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiVersion 1.0.0
  * @apiName Register
  * @apiGroup Auth
  *
  * @apiParam {Number} [phone_number] Phone number.
  * @apiParam {String} [country_code] Country code with `phone_number`.
  * @apiParam {String} first_name First name.
  * @apiParam {String} last_name Last name.
  * @apiParam {String} email Email address.
  * @apiParam {String} password Password.
  * @apiParam {String} dob Date of birth in DD-MM-YYYY format.
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "message": "Registerted successfully",
  *       "data": {
  *           "user": {
  *               "email": "kaushikabhi999@gmail.com",
  *               "uid": "d47f292c-7b63-47bc-8485-3aef1b454551",
  *               "first_name": "Amit",
  *               "last_name": "Kaushik",
  *               "dob": "12-21-1993",
  *               "country_code": "+91",
  *               "phone_number": "9034138099",
  *               "username": "919034138099",
  *               "created_at": "2021-05-15T10:50:08.257+00:00",
  *               "updated_at": "2021-05-15T10:50:08.289+00:00",
  *               "id": 1
  *           },
  *           "accessToken": {
  *               "type": "bearer",
  *               "token": "MQ.zSbTFVKw2PI1C14nj-dqR3i1_2z52k1ONKrXYWvoOkdE9WxTol4M-SEVmYwq"
  *           }
  *       }
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Email already exists"
  *     }
  * 
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Phone number already exists"
  *     }
  * 
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Bad Request"
  *     }
  *
  */
  async register({ request, auth, response }: HttpContextContract) {

    const validatoionSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.maxLength(255),
      ]),
      first_name: schema.string({ trim: true }),
      last_name: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
    })

    try {
      await request.validate({ schema: validatoionSchema })
    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Bad Request'),
      });
    }
    const phone_number = (request.input("phone_number") + '').replace(/^0+/, '');
    const country_code = request.input("country_code");
    const first_name = request.input('first_name');
    const last_name = request.input('last_name');
    const email = request.input('email');
    const password = request.input('password');
    const dob = request.input('dob');
    const alreadyExists = await User.findBy('email', email.trim());
    if (alreadyExists) {
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Email already exists')
      });
    }
    if (phone_number && country_code) {
      const user = await User
        .query()
        .where('country_code', country_code)
        .where('phone_number', phone_number)
        .first()
      if (user) {
        return response.status(Response.HTTP_BAD_REQUEST).json({
          message: t('Phone number already exists')
        });
      }
    }
    const uid = uuid()
    const user = await User.firstOrNew({ email: email });
    user.uid = uid;
    user.email = email;
    user.first_name = first_name;
    user.last_name = last_name;
    user.dob = dob;
    user.password = password;
    user.country_code = country_code;
    user.phone_number = phone_number;
    user.username = country_code ? country_code.replace('+', '') + phone_number : null;
    await user.save()
    const accessToken = await auth.use('api').generate(user)
    const data = {
      user: user,
      accessToken: accessToken
    };
    return response.status(Response.HTTP_OK).json({
      message: t('Registerted successfully'),
      data: data
    });
  }

  /**
  * @api {post} /auth/login Login
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiVersion 1.0.0
  * @apiName Login
  * @apiGroup Auth
  *
  * @apiParam {Number} [phone_number] Phone number.
  * @apiParam {String} [country_code] Country code with `phone_number`.
  * @apiParam {String} [email] Email address.
  * @apiParam {String} password Password.
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "message": "Login successfully",
  *       "data": {
  *           "user": {
  *               "email": "kaushikabhi999@gmail.com",
  *               "uid": "d47f292c-7b63-47bc-8485-3aef1b454551",
  *               "first_name": "Amit",
  *               "last_name": "Kaushik",
  *               "dob": "12-21-1993",
  *               "country_code": "+91",
  *               "phone_number": "9034138099",
  *               "username": "919034138099",
  *               "created_at": "2021-05-15T10:50:08.257+00:00",
  *               "updated_at": "2021-05-15T10:50:08.289+00:00",
  *               "id": 1
  *           },
  *           "accessToken": {
  *               "type": "bearer",
  *               "token": "MQ.zSbTFVKw2PI1C14nj-dqR3i1_2z52k1ONKrXYWvoOkdE9WxTol4M-SEVmYwq"
  *           }
  *       }
  *     }
  * 
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "Invalid credentials"
  *     }
  *
  */
  async login({ request, auth, response }: HttpContextContract) {

    const phone_number = (request.input("phone_number") + '').replace(/^0+/, '');
    const country_code = request.input("country_code");
    const email = request.input('email');
    const password = request.input('password');
    if (email) {
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
          message: t('Invalid parameters'),
        });
      }
      try {
        const accessToken = await auth.use('api').attempt(email, password)
        const user = await User.findBy('email', email);
        const data = {
          user: user,
          accessToken: accessToken
        };
        return response.status(Response.HTTP_OK).json({
          message: t('Login successfully'),
          data: data
        });
      } catch (e) {
        console.log(e)
        return response.status(Response.HTTP_FORBIDDEN).json({
          message: t('Invalid credentials'),
        });
      }
    } else {
      const validatoionSchema = schema.create({
        country_code: schema.string({ trim: true }),
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
      try {
        const username = country_code.replace('+', '') + phone_number;
        const user: any = await User.findBy('username', username);
        const accessToken = await auth.use('api').attempt(user.email, password)
        const data = {
          user: user,
          accessToken: accessToken
        };
        return response.status(Response.HTTP_OK).json({
          message: t('Login successfully'),
          data: data
        });
      } catch (e) {
        console.log(e)
        return response.status(Response.HTTP_FORBIDDEN).json({
          message: t('Invalid credentials'),
        });
      }
    }
  }
}
