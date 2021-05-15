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

  async checkAccount({ request, response }: HttpContextContract) {

    const phone_number = (request.input("phone_number") + '').replace(/^0+/, '');
    const country_code = request.input('country_code');
    const email = request.input('email');
    if (email) {
      const user = await User.findBy('email', email.trim());
      if (user) {
        return response.status(Response.HTTP_FOUND).json({
          data: user,
          message: t("Welcome back, %s", user.first_name)
        });
      } else {
        return response.status(Response.HTTP_NOT_FOUND).json({
          message: t("User not found")
        });
      }
    } else if (phone_number && country_code) {
      const user = await User
        .query()
        .where('country_code', country_code)
        .where('phone_number', phone_number)
        .first()
      if (user) {
        return response.status(Response.HTTP_FOUND).json({
          data: user,
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

  async register({ request, auth, response }: HttpContextContract) {

    const validatoionSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: 'users', column: 'email' })
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
          message: t('Phone already exists')
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
          message: e.messages(),
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
          message: 'messages.login_success',
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
