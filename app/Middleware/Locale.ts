import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// Transaltion
import i18n from 'App/Helpers/i18n';

export default class Locale {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const headers = request.headers();
    const locale = headers['accept-language'] && headers['accept-language'] !== 'undefined' ? headers['accept-language'] : 'en';
    i18n.setLocale(locale)
    await next()
  }
}
