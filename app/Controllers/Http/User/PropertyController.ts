import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Response from "App/Helpers/Response";
import Property from 'App/Models/PropertyListing'
// Transaltion
import i18n from 'App/Helpers/i18n';
const t = i18n.__;


export default class PropertyController{
    async addPropertyType({request,response}:HttpContextContract){
        const property_type = (request.input("property_type"));
        const is_beach_house = (request.input("is_beach_house"));
        const is_dedicated_guest_space = (request.input("is_dedicated_guest_space"));
        const is_business_hosting = (request.input("is_business_hosting"));

        const property = await Property.create({
            property_type,
            is_beach_house,
            is_dedicated_guest_space,
            is_business_hosting
        })

        return response.status(Response.HTTP_OK).json({
            message: t('Property type added'),
            property
          });
    }
}