import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import PropertyListing from 'App/Models/PropertyListing';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
// Transaltion
import i18n from 'App/Helpers/i18n';
import { v4 as uuid } from "uuid";
const t = i18n.__;


export default class PropertyController {
    /**
  * @api {post} /user/hosting/add-property/type Add Property Type
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiVersion 1.0.0
  * @apiName add-property-type
  * @apiGroup Hosting
  *
  * @apiParam {Number} property_type property_type Property Type Id `
  * @apiParam {Boolean} [is_beach_house] required if property_type 'villa' or 'apartment'.
  * @apiParam {Boolean} is_dedicated_guest_space true or false.
  * @apiParam {Boolean} is_business_hosting true of false`.
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 201 Created
  *     
  *     {
  *      "message": "Property type added",
  *       "data": {
  *       "uid": "20586a21-af79-447a-8df4-8b2cce091c72",
  *       "property_type": 1,
  *       "is_beach_house": false,
  *       "is_dedicated_guest_space": true,
  *       "is_business_hosting": true,
  *       "created_at": "2021-07-26T12:58:55.169+05:30",
  *       "updated_at": "2021-07-26T12:58:55.169+05:30",
  *       "id": 1
  *    }
  *  }
  *
  * @apiErrorExample {json} Error-Response:
  *
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "message": "validation Failed",
  *       "error": {
  *       "is_beach_house": [
  *          "required validation failed"
  *      ]
  *    }
  *   }
  *
  */
    async addPropertyType({ request, response }: HttpContextContract) {
        const property_type = request.input("property_type");
        const is_beach_house = request.input("is_beach_house");
        const is_dedicated_guest_space = request.input("is_dedicated_guest_space");
        const is_business_hosting = request.input("is_business_hosting");
        try {
            let validateSchema;
            if (property_type === 1 || property_type == 2) {
                validateSchema = schema.create({
                    property_type: schema.number(),
                    is_beach_house: schema.boolean(),
                    is_dedicated_guest_space: schema.boolean(),
                    is_business_hosting: schema.boolean(),
                });
            }
            else {
                validateSchema = schema.create({
                    property_type: schema.number(),
                    is_dedicated_guest_space: schema.boolean(),
                    is_business_hosting: schema.boolean(),
                });
            }

            await request.validate({ schema: validateSchema });
        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_BAD_REQUEST).json({
                message: t('validation Failed'),
                error: error.messages
            });
        }

        try {
            const property = await PropertyListing.create({
                uid: uuid(),
                property_type,
                is_beach_house,
                is_dedicated_guest_space,
                is_business_hosting
            });
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property type added'),
                data: property
            });
        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
                message: t('Something went wrong')
            });
        }
    }
}