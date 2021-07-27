import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import PropertyListing from 'App/Models/PropertyListing';
import PropertyBed from 'App/Models/PropertyBed';
import PropertyAmenity from 'App/Models/PropertyAmenity';
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
* @apiParam {Number} id Property unique ID (pass as params)
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
                .preload('type', builder => builder.select(
                    'id',
                    'uid',
                    'property_type'
                ))
                .preload('beds', builder => builder.select(
                    'bed_id',
                    'property_id',
                    'bedroom_name',
                    'is_common_space',
                    'count'
                ))
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

    /**
    * @api {put} /user/hosting/list-property/address/:id Add Address
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiVersion 1.0.0
    * @apiName address
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property unique ID (pass as params)
    * 
    * @apiParam {String} country property located in country
    * @apiParam {String} street  house name/number street/road
    * @apiParam {String} [address_optional] Flat, Suite etc.  
    * @apiParam {String} city Name of City.
    * @apiParam {String} state 
    * @apiParam {String} zip_code 
    * 
    * @apiParamExample {json} Request-Example:
    * {
    *    "country": "India",
    *    "city": "Noida",
    *    "street": "Noida Sector 63",
    *    "state": "UP",
    *    "zip_code": "300221",
    *    "address_optional": "H Block"
    * }
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     
    * {
    *    "message": "Property address updated",
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
    *            "country": "India",
    *            "street": "Noida Sector 63",
    *            "address_optional": "H Block",
    *            "state": "UP",
    *            "city": "Noida",
    *            "zip_code": "300221",
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
    *        "state": [
    *            "minLength validation failed"
    *        ]
    *    }
    *   }
    *
    */


    async addPropertyAddress({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                country: schema.string({ trim: true }, [
                    rules.minLength(2),
                ]),
                street: schema.string({ trim: true }, [
                    rules.minLength(2),
                ]),
                city: schema.string({ trim: true }, [
                    rules.minLength(2),
                ]),
                state: schema.string({ trim: true }, [
                    rules.minLength(2),
                ]),
                zip_code: schema.string({ trim: true }, [
                    rules.minLength(3),
                ])
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
        const address = { ...body };

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update(address);

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
                    'no_of_bathrooms',
                    'country',
                    'street',
                    'address_optional',
                    'state',
                    'city',
                    'zip_code'
                )
                .preload('type', builder => builder.select(
                    'id',
                    'uid',
                    'property_type'
                ))
                .preload('beds', builder => builder.select(
                    'bed_id',
                    'property_id',
                    'bedroom_name',
                    'is_common_space',
                    'count'
                ))
                .finally();

            return response.status(Response.HTTP_CREATED).json({
                message: t('Property address added'),
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
    * @api {put} /user/hosting/list-property/amenities/:id Add Location
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiVersion 1.0.0
    * @apiName location
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property unique ID (pass as params)
    * 
    * @apiParam {Number} longitude Ex 10.24
    * @apiParam {Number} latitude  Ex 20.135
    * @apiParam {String} location A-121, Sec-63 Noida, Utter Pradesh 201301.
    * 
    * 
    * 
    * @apiParamExample {json} Request-Example:
    * {
    *    "longitude": 10.24,
    *    "latitude": 20.134,
    *    "location": "A-121, Sec-63 Noida, Utter Pradesh 201301",
    * }
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     
    * {
    *    "message": "Property address updated",
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
    *            "country": "India",
    *            "street": "Noida Sector 63",
    *            "address_optional": "H Block",
    *            "state": "UP",
    *            "city": "Noida",
    *            "zip_code": "300221",
    *            "longitude": 10.24,
    *            "latitude": 20.134,
    *            "location": "A-121, Sec-63 Noida, Utter Pradesh 201301",
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
    *        "location": [
    *            "minLength validation failed"
    *        ]
    *    }
    *   }
    *
    */


    async addPropertyLocation({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                latitude: schema.number(),
                longitude: schema.number(),
                location: schema.string({ trim: true }, [
                    rules.minLength(2),
                ]),
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
        const location = { ...body };

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update(location);

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
                    'no_of_bathrooms',
                    'country',
                    'street',
                    'address_optional',
                    'state',
                    'city',
                    'zip_code',
                    'longitude',
                    'latitude',
                    'location'
                )
                .preload('type', builder => builder.select(
                    'id',
                    'uid',
                    'property_type'
                ))
                .preload('beds', builder => builder.select(
                    'bed_id',
                    'property_id',
                    'bedroom_name',
                    'is_common_space',
                    'count'
                ))
                .finally();

            return response.status(Response.HTTP_CREATED).json({
                message: t('Property location added'),
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
    * @api {put} /user/hosting/list-property/location/:id Add Amenities
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiVersion 1.0.0
    * @apiName amenities
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property unique ID (pass as params)
    * 
    * @apiParam {Number[]} amenities Array of Ids of amenities
    * 
    * 
    * @apiParamExample {json} Request-Example:
    *   {
    *        "amenities": [1,2,3,5]
    *    }
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     
    * {
    *    "message": "Property amenities added",
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
    *            "country": "India",
    *            "street": "Noida Sector 63",
    *            "address_optional": "H Block",
    *            "state": "UP",
    *            "city": "Noida",
    *            "zip_code": "300221",
    *            "longitude": 10.24,
    *            "latitude": 20.134,
    *            "location": "A-121, Sec-63 Noida, Utter Pradesh 201301",
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
    *                .
    *                .
    *                .
    *            ],
    *          "amenities": [
    *            {
    *                "property_id": 2,
    *                "amenity_id": 1,
    *                "id": 9
    *            },
    *            {
    *                "property_id": 2,
    *                "amenity_id": 2,
    *                "id": 10
    *            },
    *            {
    *                "property_id": 2,
    *                "amenity_id": 3,
    *                "id": 11
    *            },
    *            {
    *                "property_id": 2,
    *                "amenity_id": 5,
    *                "id": 12
    *            }
    *           .
    *           .
    *           .
    *        ]
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
    *        "amenities": [
    *            "number validation failed"
    *        ]
    *    }
    *   }
    *
    */


    async addPropertyAmenities({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            const validateSchema = schema.create({
                amenities: schema.array(
                    [rules.minLength(1)]
                ).members(schema.number())
            })

            await request.validate({ schema: validateSchema });
        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_BAD_REQUEST).json({
                message: t('validation Failed'),
                error: error.messages
            });
        }

        const body = request.body();
        const amenities = body.amenities;
        console.log(amenities);
        const amenity_data = amenities.map(e => {
            const item = {
                property_id,
                amenity_id: e,
            }
            return item;
        });

        try {
            await PropertyAmenity.query()
                .where({ property_id })
                .delete();

            await PropertyAmenity.createMany(amenity_data);

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
                    'no_of_bathrooms',
                    'country',
                    'street',
                    'address_optional',
                    'state',
                    'city',
                    'zip_code',
                    'longitude',
                    'latitude',
                    'location'
                )
                .preload('type', builder => builder.select(
                    'id',
                    'uid',
                    'property_type'
                ))
                .preload('beds', builder => builder.select(
                    'bed_id',
                    'property_id',
                    'bedroom_name',
                    'is_common_space',
                    'count'
                ))
                .preload('amenities', builder => builder.select(
                    'property_id',
                    'amenity_id',
                    'id'
                ))
                .finally();

            return response.status(Response.HTTP_CREATED).json({
                message: t('Property amenities added'),
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