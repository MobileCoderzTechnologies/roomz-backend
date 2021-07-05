import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import BedType from "App/Models/BedType";
import PropertyType from "App/Models/PropertyType";
// Transaltion
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

export default class HostingController {

  async getBedTypes({ response }: HttpContextContract) {
    try {
      const bedList = await BedType.query()
        .select('uid', 'bed_type')
        .finally();

      return response.status(Response.HTTP_OK).json({
        data: bedList
      });


    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }

  async getPropertyTypes({ response }: HttpContextContract) {
    try {
      const propertyList = await PropertyType.query()
        .select('uid', 'property_type')
        .finally();
      return response.status(Response.HTTP_OK).json({
        data: propertyList
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }


}
