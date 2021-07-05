import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Response from "App/Helpers/Response";
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

export default class UserActive {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const userId = auth.user?.uid;
    const user = await User.query()
      .where({ uid: userId })
      .first();

    if (user && user.is_deleted) {
      return response.status(Response.HTTP_UNAUTHORIZED).json({
        status: Response.HTTP_UNAUTHORIZED,
        message: t('Please login again')
      })
    }

    if (user && !user.is_active) {
      return response.status(Response.HTTP_BAD_REQUEST).json({
        status: Response.HTTP_BAD_REQUEST,
        message: t('Your account is inactive, please contact Admin')
      });
    }
    await next()
  }
}
