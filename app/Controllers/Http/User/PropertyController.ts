import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import PropertyListing from 'App/Models/PropertyListing';
import PropertyBed from 'App/Models/PropertyBed';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
// Transaltion
import i18n from 'App/Helpers/i18n';
import { v4 as uuid } from "uuid";
const t = i18n.__;


export default class PropertyController {
    /**
  * @api {post} /user/hosting/list-property/type Property Type
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiVersion 1.0.0
  * @apiName property-type
  * @apiGroup List Property
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


    /**
* @api {put} /user/hosting/list-property/beds/:id Add Beds
* @apiHeader {String} Device-Type Device Type ios/android.
* @apiHeader {String} App-Version Version Code 1.0.0.
* @apiHeader {String} Accept-Language Language Code en OR ar.
* @apiVersion 1.0.0
* @apiName beds
* @apiGroup List Property
*
* @apiParam {Number} id Property unique ID
* 
* @apiParam {Number} no_of_guests
* @apiParam {Number} no_of_bathrooms
* @apiParam {Number} no_of_bedrooms
* @apiParam {Object[]} beds `Array of Beds`.
* 
* @apiParamExample {json} Request-Example:
*{
* "no_of_guests": 2,
*  "no_of_bedrooms": 1,
*  "no_of_bathrooms": 2,
*  "beds": [
*      {
*          "bed_id": 1,
*          "bedroom_name": "Common Space",
*          "count": 2,
*          "is_common_space": true
*      },
*       {
*          "bed_id": 2,
*          "bedroom_name": "BedRoom 1",
*          "count": 2,
*          "is_common_space": false
*      },
*      {
*          "bed_id": 2,
*          "bedroom_name": "BedRoom 1",
*          "count": 3,
*          "is_common_space": false
*      }
*      .
*      .
*      .
*  ]
*  }
*
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 201 Created
*     
* {
*    "message": "Property type added",
*    "data": [
*        {
*            "id": 2,
*            "uid": "31195908-2d43-4905-a28e-faa17de2588b",
*            "property_type": 1,
*            "is_beach_house": 0,
*            "is_dedicated_guest_space": 1,
*            "is_business_hosting": 1,
*            "no_of_guests": 2,
*            "no_of_bedrooms": 1,
*            "no_of_bathrooms": 2,
*            "type": {
*                "id": 1,
*                "uid": "27ce8bdf-1b6c-495b-aca0-a057c0848580",
*                "property_type": "Villa",
*            },
*            "beds": [
*                {
*                    "bed_id": 1,
*                    "property_id": 2,
*                    "bedroom_name": "Common Space",
*                    "is_common_space": 1,
*                    "count": 2,
*                },
*                {
*                    "bed_id": 2,
*                    "property_id": 2,
*                    "bedroom_name": "BedRoom 1",
*                    "is_common_space": 0,
*                    "count": 2,
*                },
*                {
*                    "bed_id": 2,
*                    "property_id": 2,
*                    "bedroom_name": "BedRoom 1",
*                    "is_common_space": 0,
*                    "count": 2
*                }
*            ]
*        }
*    ]
* }
*
* @apiErrorExample {json} Error-Response:
*
*     HTTP/1.1 400 Bad Request
*     {
*    "message": "validation Failed",
*    "error": {
*        "no_of_bedrooms": [
*            "number validation failed"
*        ],
*        "beds.0.bedroom_name": [
*            "required validation failed"
*        ],
*        "beds.2.is_common_space": [
*            "boolean validation failed"
*        ]
*    }
*  }
*
*/


    async addBeds({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                no_of_guests: schema.number(),
                no_of_bedrooms: schema.number(),
                no_of_bathrooms: schema.number(),
                beds: schema.array().members(
                    schema.object().members({
                        bed_id: schema.number(),
                        bedroom_name: schema.string({ trim: true }, [
                            rules.minLength(3),
                        ]),
                        is_common_space: schema.boolean(),
                        count: schema.number(),
                    })
                )
            });
            await request.validate({ schema: validateSchema });
        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_BAD_REQUEST).json({
                message: t('validation Failed'),
                error: error.messages
            });
        }

        const body = request.body();
        const { no_of_guests, no_of_bedrooms, no_of_bathrooms, beds } = body;

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update({
                    no_of_bathrooms,
                    no_of_bedrooms,
                    no_of_guests
                });

            await PropertyBed.query()
                .where({ property_id })
                .delete();

            const bed_data = beds.map(e => {
                e.property_id = property_id;
                e.uid = uuid();
                return e;
            });

            await PropertyBed.createMany(bed_data);

            const property = await PropertyListing.query()
                .where('id', property_id)
                .select(
                    'id',
                    'uid',
                    'property_type',
                    'is_beach_house',
                    'is_dedicated_guest_space',
                    'is_business_hosting',
                    'no_of_guests',
                    'no_of_bedrooms',
                    'no_of_bathrooms'
                )
                .preload('type', builder => builder.select('id', 'uid', 'property_type'))
                .preload('beds', builder => builder.select('bed_id', 'property_id', 'bedroom_name', 'is_common_space', 'count'))
                .finally();

            return response.status(Response.HTTP_CREATED).json({
                message: t('Property beds added'),
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