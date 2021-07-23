import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Property from 'App/Models/PropertyListing'



export default class PropertyController{
    async propertyListing({request,response}:HttpContextContract){
        const property_type = (request.input("property_type"));
        const is_beach_house = (request.input("is_beach_house"));
        const is_dedicated_guest_space = (request.input("is_dedicated_guest_space"));
        const is_business_hosting = (request.input("is_business_hosting"));
        const no_of_guests = (request.input("no_of_guests"));
        const no_of_bedrooms = (request.input("no_of_bedrooms"));
        const no_of_bathrooms = (request.input("no_of_bathrooms"));
        const country = (request.input("country"));
        const address_optional = (request.input("address_optional"));
        const street = (request.input("street"));
        const city = (request.input("city"));
        const zip_code = (request.input("zip_code"));
        const latitude = (request.input("latitude"));
        const longitude = (request.input("longitude"));
        const location = (request.input("location"));
        const is_email_confirmed = (request.input("is_email_confirmed"));
        const is_phone_confirmed = (request.input("is_phone_confirmed"));
    }
}