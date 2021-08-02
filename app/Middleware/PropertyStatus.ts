import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PropertyListing from "App/Models/PropertyListing";
import Response from "App/Helpers/Response";
import i18n from 'App/Helpers/i18n';
import { PROPERTY_STATUS } from 'App/Constants/PropertyConstant';
const t = i18n.__;
export default class PropertyStatus {
  public async handle({ params, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL;

    const property_id = params.id;

    if (property_id) {
      const property = await PropertyListing.findBy('id', property_id);

      if (!property) {
        return response.status(Response.HTTP_BAD_REQUEST).json({
          status: Response.HTTP_BAD_REQUEST,
          message: t('Property not found')
        })
      }

      if (property?.status === PROPERTY_STATUS.deleted) {
        return response.status(Response.HTTP_BAD_REQUEST).json({
          status: Response.HTTP_BAD_REQUEST,
          message: t('Property not found ')
        })
      }

      if (property?.status === PROPERTY_STATUS.blocked) {
        return response.status(Response.HTTP_BAD_REQUEST).json({
          status: Response.HTTP_BAD_REQUEST,
          message: t('Your property is blocked, please contact admin')
        })
      }
    }
    await next()
  }
}
