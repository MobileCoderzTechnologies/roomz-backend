import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import PropertyListing from 'App/Models/PropertyListing';
import PropertyBed from 'App/Models/PropertyBed';
import PropertyAmenity from 'App/Models/PropertyAmenity';
import PropertyImage from 'App/Models/PropertyImage';
import PropertyRule from 'App/Models/PropertyRule';
import PropertyDetail from 'App/Models/PropertyDetail';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
// Transaltion
import i18n from 'App/Helpers/i18n';
const t = i18n.__;
import { v4 as uuid } from "uuid";
import { PROPERTY_STATUS } from 'App/Constants/PropertyConstant';
import { S3_DIRECTORIES } from 'App/Constants/s3DirectoryConstants';


export default class PropertyController {
    /**
  * @api {post} /user/hosting/list-property/type Property Type
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
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
    async addPropertyType({ request, auth, params, response }: HttpContextContract) {
        const user_id = auth.user?.id;
        const property_id = params.id || null;
        const property_type = request.input("property_type");
        const is_beach_house = request.input("is_beach_house");
        const is_dedicated_guest_space = request.input("is_dedicated_guest_space");
        const is_business_hosting = request.input("is_business_hosting");
        try {
            let validateSchema;
            if (property_type === 1 || property_type == 2) {
                validateSchema = schema.create({
                    property_type: schema.number(),
                    is_beach_house: schema.boolean.optional(),
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
            let property;
            if (property_id) {
                await PropertyListing.query()
                    .where('id', property_id)
                    .update({
                        user_id,
                        property_type,
                        is_beach_house,
                        is_dedicated_guest_space,
                        is_business_hosting
                    });

                property = await PropertyListing.query()
                    .where('id', property_id)
                    .select(
                        'id',
                        'uid',
                        'property_type',
                        'is_beach_house',
                        'is_dedicated_guest_space',
                        'is_business_hosting'
                    )
                    .first();
            }
            else {
                property = await PropertyListing.create({
                    uid: uuid(),
                    user_id,
                    property_type,
                    is_beach_house,
                    is_dedicated_guest_space,
                    is_business_hosting
                });
            }

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
    *@apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName beds
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property ID (pass as params)
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
    *          "serial_number": 0 
    *      },
    *       {
    *          "bed_id": 2,
    *          "bedroom_name": "BedRoom 1",
    *          "count": 2,
    *          "serial_number": 1
    *      },
    *      {
    *          "bed_id": 2,
    *          "bedroom_name": "BedRoom 1",
    *          "count": 3,
    *          "serial_number": 1
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
    *                    "serial_number": 0,
    *                    "count": 2,
    *                },
    *                {
    *                    "bed_id": 2,
    *                    "property_id": 2,
    *                    "bedroom_name": "BedRoom 1",
    *                    "serial_number": 1,
    *                    "count": 2,
    *                },
    *                {
    *                    "bed_id": 2,
    *                    "property_id": 2,
    *                    "bedroom_name": "BedRoom 1",
    *                    "serial_number": 1,
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


    async addBeds({ request, auth, response, params }: HttpContextContract) {
        const property_id = params.id;
        const user_id = auth.user?.id
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
                        serial_number: schema.number(),
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
                .where({ id: property_id, user_id })
                .update({
                    no_of_bathrooms,
                    no_of_bedrooms,
                    no_of_guests
                });

            await PropertyBed.query()
                .where({ property_id })
                .delete();

            const bed_data = beds.map(e => {
                const { bed_id, bedroom_name, serial_number, count } = e;
                const obj = {
                    bed_id,
                    bedroom_name,
                    serial_number,
                    property_id,
                    count,
                    uid: uuid()
                };
                return obj;
            });

            await PropertyBed.createMany(bed_data);

            let property = await PropertyListing.query()
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
                    'serial_number',
                    'count'
                ))
                .finally();

            if (!property) property = [];
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
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName address
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property ID (pass as params)
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


    async addPropertyAddress({ request, auth, response, params }: HttpContextContract) {
        const property_id = params.id;
        const user_id = auth.user?.id
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
        const { state, country, street, city, zip_code, address_optional } = body;

        try {
            await PropertyListing.query()
                .where({ id: property_id, user_id })
                .update({
                    state,
                    country,
                    city,
                    zip_code,
                    street,
                    address_optional
                });

            let property = await PropertyListing.query()
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
                .finally();

            if (!property) property = [];
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
    * @api {put} /user/hosting/list-property/location/:id Add Location
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName location
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property ID (pass as params)
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


    async addPropertyLocation({ request, auth, response, params }: HttpContextContract) {
        const property_id = params.id;
        const user_id = auth.user?.id
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
        const { location, longitude, latitude } = body;

        try {
            await PropertyListing.query()
                .where({ id: property_id, user_id })
                .update({
                    location,
                    latitude,
                    longitude
                });

            let property = await PropertyListing.query()
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
                .finally();

            if (!property) property = [];
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
    * @api {put} /user/hosting/list-property/amenities/:id Add Amenities
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName amenities
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property ID (pass as params)
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
    *{
    *    "message": "Property amenities added",
    *    "data": [
    *        {
    *            "property_id": 1,
    *            "amenity_id": 2
    *        },
    *        {
    *            "property_id": 1,
    *            "amenity_id": 3
    *        },
    *        {
    *            "property_id": 1,
    *            "amenity_id": 5
    *        },
    *        {
    *            "property_id": 1,
    *            "amenity_id": 6
    *        },
    *        {
    *            "property_id": 1,
    *            "amenity_id": 9
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

            let data = await PropertyAmenity.query()
                .where({ property_id })
                .select('property_id', 'amenity_id')
                .finally();

            return response.status(Response.HTTP_CREATED).json({
                message: t('Property amenities added'),
                data
            });

        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
                message: t('Something went wrong')
            });
        }
    }


    /**
   * @api {put} /user/hosting/list-property/guest-requirements/:id Guest Requirements
   * @apiHeader {String} Device-Type Device Type ios/android.
   * @apiHeader {String} App-Version Version Code 1.0.0.
   * @apiHeader {String} Accept-Language Language Code en OR ar.
   * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
   * @apiVersion 1.0.0
   * @apiName guest-requirements
   * @apiGroup List Property
   *
   * @apiParam {Number} id Property ID (pass as params)
   * 
   * @apiParam {Boolean} is_email_confirmed 
   * @apiParam {Boolean} is_phone_confirmed 
   * @apiParam {Boolean} is_payment_information 
   * @apiParam {Boolean} is_trip_purpose 
   * @apiParam {Boolean} is_recommended_from_oh 
   * @apiParam {Boolean} is_id_submitted  guest submitted their id
   * @apiParam {Boolean} is_agree_hr guests agree for home rules (hr) 
   * 
   * 
   * 
   * 
   * @apiParamExample {json} Request-Example:
   * {
   *   "is_email_confirmed": true,
   *   "is_phone_confirmed": true,
   *   "is_payment_information": true,
   *   "is_agree_hr": true,
   *   "is_trip_purpose": true,
   *   "is_id_submitted": true,
   *   "is_recommended_from_oh": true
   *   }
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
   *            "is_email_confirmed": 1,
   *            "is_phone_confirmed": 1,
   *            "is_agree_hr": 1,
   *            "is_payment_information": 1,
   *            "is_trip_purpose": 1,
   *            "is_id_submitted": 1,
   *            "is_recommended_from_oh": 1,
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


    async addPropertyGuestRequirements({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                is_email_confirmed: schema.boolean.optional(),
                is_phone_confirmed: schema.boolean.optional(),
                is_payment_information: schema.boolean.optional(),
                is_agree_hr: schema.boolean.optional(),
                is_trip_purpose: schema.boolean.optional(),
                is_id_submitted: schema.boolean.optional(),
                is_recommended_from_oh: schema.boolean.optional(),
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
        const requirements = { ...body };

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update(requirements);

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property guest requirements added'),
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
    * @api {put} /user/hosting/list-property/house-rules/:id Set House Rule
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName house-rules
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property  ID (pass as params)
    * 
    * @apiParam {object[]} property_rules Array of house rules
    * 
    * 
    * @apiParamExample {json} Request-Example:
    *   {
    *      "property_rules": [
    *        {
    *            "rule_id": 1,
    *            "is_cancelled": true,
    *            "cancel_reason": "test"
    *        },
    *        {
    *            "rule_id": 2
    *        },
    *        {
    *            "rule_id": 3
    *        },
    *        {
    *            "rule_id": 4
    *        },
    *        {
    *            "rule_id": 5
    *        },
    *        {
    *            "is_additional": true,
    *            "description": "test"
    *        }
    *    ]
    *  }
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *  "message": "Property rules added",
    *  "data": [
    *    {
    *        "rule_id": 1,
    *        "property_id": 2,
    *        "is_cancelled": 1,
    *        "cancel_reason": "test",
    *        "is_additional": 0,
    *        "description": null
    *    },
    *    {
    *        "rule_id": 2,
    *        "property_id": 2,
    *        "is_cancelled": 0,
    *        "cancel_reason": null,
    *        "is_additional": 0,
    *        "description": null
    *    },
    *    {
    *        "rule_id": 3,
    *        "property_id": 2,
    *        "is_cancelled": 0,
    *        "cancel_reason": null,
    *        "is_additional": 0,
    *        "description": null
    *    },
    *    {
    *        "rule_id": 4,
    *        "property_id": 2,
    *        "is_cancelled": 0,
    *        "cancel_reason": null,
    *        "is_additional": 0,
    *        "description": null
    *    },
    *    {
    *        "rule_id": 5,
    *        "property_id": 2,
    *        "is_cancelled": 0,
    *        "cancel_reason": null,
    *        "is_additional": 0,
    *        "description": null
    *    },
    *    {
    *        "rule_id": null,
    *        "property_id": 2,
    *        "is_cancelled": 0,
    *        "cancel_reason": null,
    *        "is_additional": 1,
    *        "description": "test"
    *    }
    *   ]
    * }
    
    */


    async setPropertyHomeRules({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            const validateSchema = schema.create({
                property_rules: schema.array(
                    [rules.minLength(5)]
                ).members(
                    schema.object().members({
                        rule_id: schema.number.optional(),
                        is_cancelled: schema.boolean.optional(),
                        cancel_reason: schema.string.optional({ trim: true }, [
                            rules.requiredWhen('is_cancelled', '=', true)
                        ]),
                        is_additional: schema.boolean.optional([
                            rules.requiredIfNotExists('rule_id'),
                        ]),
                        description: schema.string.optional({ trim: true }, [
                            rules.requiredWhen('is_additional', '=', true)
                        ])
                    })
                )
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
        const property_rules = body.property_rules;
        const rule_data = property_rules.filter(e => e.is_additional !== false).map(e => {
            e.property_id = property_id;
            e.uid = uuid();
            const obj = {
                property_id,
                uid: uuid(),
                rule_id: e.rule_id,
                is_cancelled: e.is_cancelled,
                cancel_reason: e.cancel_reason,
                is_additional: e.is_additional,
                description: e.description
            }
            return obj;
        });

        try {
            await PropertyRule.query()
                .where({ property_id })
                .delete();

            await PropertyRule.createMany(rule_data);

            const data = await PropertyRule.query()
                .where({ property_id })
                .select(
                    'rule_id',
                    'property_id',
                    'is_cancelled',
                    'cancel_reason',
                    'is_additional',
                    'description'
                )
                .finally();


            return response.status(Response.HTTP_CREATED).json({
                message: t('Property rules added'),
                data
            });

        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
                message: t('Something went wrong')
            });
        }
    }

    // property details 

    /**
    * @api {put} /user/hosting/list-property/property-details/:id Property Details
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName property-details
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property ID (pass as params)
    * 
    * @apiParam {object[]} property_details Array of details
    * 
    * 
    * @apiParamExample {json} Request-Example:
    *   {
    *    "property_details": [
    *            {
    *                "detail_id": 1,
    *                "explanation": "tell something"
    *            },
    *            {
    *                "detail_id": 2
    *            },
    *            {
    *                "detail_id": 3
    *            }
    *        ]
    *    }
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "Property details added",
    *       "data": [
    *           {
    *               "detail_id": 1,
    *               "property_id": 1,
    *               "explanation": "tell something"
    *           },
    *           {
    *               "detail_id": 2,
    *               "property_id": 1,
    *               "explanation": null
    *           },
    *           {
    *               "detail_id": 3,
    *               "property_id": 1,
    *               "explanation": null
    *           }
    *       ]
    *     }
    *
    */


    async addPropertyDetails({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            const validateSchema = schema.create({
                property_details: schema.array([
                    rules.minLength(2)
                ]).members(
                    schema.object().members({
                        detail_id: schema.number(),
                        explanation: schema.string.optional({ trim: true }, [
                            rules.minLength(5)
                        ])
                    })
                )
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
        const property_details = body.property_details;
        const rule_data = property_details.map(e => {
            const obj = {
                property_id,
                uid: uuid(),
                detail_id: e.detail_id,
                explanation: e.explanation
            }
            return obj;
        });

        try {
            await PropertyDetail.query()
                .where({ property_id })
                .delete();

            await PropertyDetail.createMany(rule_data);

            const data = await PropertyDetail.query()
                .where({ property_id })
                .select(
                    'detail_id',
                    'property_id',
                    'explanation',
                )
                .finally();


            return response.status(Response.HTTP_CREATED).json({
                message: t('Property details added'),
                data
            });

        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
                message: t('Something went wrong')
            });
        }
    }



    /**
      * @api {put} /user/hosting/list-property/description/:id Property Description
      * @apiHeader {String} Device-Type Device Type ios/android.
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiHeader {String} Accept-Language Language Code en OR ar.
      * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
      * @apiVersion 1.0.0
      * @apiName description
      * @apiGroup List Property
      *
      * @apiParam {Number} id Property ID (pass as params)
      * 
      * @apiParam {string} description Describe your place to guests 
      * @apiParam {String} [desc_your_space] about your spaces 
      * @apiParam {String} [desc_interaction_guests] Share how available you during a guest stay 
      * @apiParam {String} [desc_neighbourhood]  Share what makes your neighbourhood special
      * @apiParam {String} [desc_getting_around] Add info about getting around your city
      * 
      * 
      * 
      * 
      * @apiParamExample {json} Request-Example:
      *  {
      *     "description": "This house is newly constructed and loaded with all facilites.",
      *     "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft."
      *   }
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 201 Created
      *     
      * {
      *    "message": "Property description added",
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
      *            "is_email_confirmed": 1,
      *            "is_phone_confirmed": 1,
      *            "is_agree_hr": 1,
      *            "is_payment_information": 1,
      *            "is_trip_purpose": 1,
      *            "is_id_submitted": 1,
      *            "is_recommended_from_oh": 1,
      *            "description": "This house is newly constructed and loaded with all facilites.",
      *            "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft.",
      *            "desc_interaction_guests": null,
      *            "desc_neighbourhood": null,
      *            "desc_getting_around": null 
      *        }
      *    ]
      * }
      *
      *
      */


    async addPropertyDescription({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                description: schema.string({ trim: true }, [
                    rules.minLength(20),
                    rules.maxLength(500),
                ]),
                desc_your_space: schema.string.optional({ trim: true }, [
                    rules.minLength(20),
                    rules.maxLength(500)
                ]),
                desc_interaction_guests: schema.string.optional({ trim: true }, [
                    rules.minLength(20),
                    rules.maxLength(500)
                ]),
                desc_neighbourhood: schema.string.optional({ trim: true }, [
                    rules.minLength(20),
                    rules.maxLength(500)
                ]),
                desc_getting_around: schema.string.optional({ trim: true }, [
                    rules.minLength(20),
                    rules.maxLength(500)
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
        const { description, desc_getting_around, desc_interaction_guests, desc_neighbourhood, desc_your_space } = body;

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update({
                    description,
                    desc_getting_around,
                    desc_interaction_guests,
                    desc_neighbourhood,
                    desc_your_space
                });

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh',
                    'description',
                    'desc_your_space',
                    'desc_interaction_guests',
                    'desc_neighbourhood',
                    'desc_getting_around'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property description added'),
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
      * @api {put} /user/hosting/list-property/name/:id Name of Listing
      * @apiHeader {String} Device-Type Device Type ios/android.
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiHeader {String} Accept-Language Language Code en OR ar.
      * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
      * @apiVersion 1.0.0
      * @apiName name
      * @apiGroup List Property
      *
      * @apiParam {Number} id Property  ID (pass as params)
      * 
      * @apiParam {string} name Name of Listing 
      * 
      * 
      * @apiParamExample {json} Request-Example:
      *  {
      *     "name": "Smart House 3 Star"
      *   }
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 201 Created
      *     
      * {
      *    "message": "Property name added",
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
      *            "is_email_confirmed": 1,
      *            "is_phone_confirmed": 1,
      *            "is_agree_hr": 1,
      *            "is_payment_information": 1,
      *            "is_trip_purpose": 1,
      *            "is_id_submitted": 1,
      *            "is_recommended_from_oh": 1,
      *            "description": "This house is newly constructed and loaded with all facilites.",
      *            "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft.",
      *            "desc_interaction_guests": null,
      *            "desc_neighbourhood": null,
      *            "desc_getting_around": null,
      *            "name": "Smart House 3 Star" 
      *        }
      *    ]
      * }
      *
      *
      */


    async addPropertyName({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                name: schema.string({ trim: true }, [
                    rules.minLength(5),
                    rules.maxLength(50),
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
        const { name } = body;

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update({ name });

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh',
                    'description',
                    'desc_your_space',
                    'desc_interaction_guests',
                    'desc_neighbourhood',
                    'desc_getting_around',
                    'name'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property name added'),
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
      * @api {put} /user/hosting/list-property/phone-number/:id Add Sec Phone Number
      * @apiHeader {String} Device-Type Device Type ios/android.
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiHeader {String} Accept-Language Language Code en OR ar.
      * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
      * @apiVersion 1.0.0
      * @apiName phone_number
      * @apiGroup List Property
      *
      * @apiParam {Number} id Property  ID (pass as params)
      * 
      * @apiParam {string} [country_code] Country Code 
      * @apiParam {string} [sec_phone_number] Phone Number 
      * 
      * 
      * @apiParamExample {json} Request-Example:
      *  {
      *     "country_code": "+91",
      *     "sec_phone_number": "9882553654"
      *   }
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 201 Created
      *     
      * {
      *    "message": "Property secondary phone number added",
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
      *            "is_email_confirmed": 1,
      *            "is_phone_confirmed": 1,
      *            "is_agree_hr": 1,
      *            "is_payment_information": 1,
      *            "is_trip_purpose": 1,
      *            "is_id_submitted": 1,
      *            "is_recommended_from_oh": 1,
      *            "description": "This house is newly constructed and loaded with all facilites.",
      *            "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft.",
      *            "desc_interaction_guests": null,
      *            "desc_neighbourhood": null,
      *            "desc_getting_around": null,
      *            "name": "Smart House 3 Star",
      *            "country_code": "+91",
      *            "sec_phone_number": "9882553654"
      *        }
      *    ]
      * }
      *
      *
      */


    async addSecPhoneNumber({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                country_code: schema.string.optional(),
                sec_phone_number: schema.string.optional(),
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
        const { phone_number, country_code } = body;

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update({
                    phone_number,
                    country_code
                });

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh',
                    'description',
                    'desc_your_space',
                    'desc_interaction_guests',
                    'desc_neighbourhood',
                    'desc_getting_around',
                    'name',
                    'country_code',
                    'sec_phone_number'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property secondary phone number added'),
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
      * @api {put} /user/hosting/list-property/availability/:id Set Availability
      * @apiHeader {String} Device-Type Device Type ios/android.
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiHeader {String} Accept-Language Language Code en OR ar.
      * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
      * @apiVersion 1.0.0
      * @apiName availability
      * @apiGroup List Property
      *
      * @apiParam {Number} id Property ID (pass as params)
      * 
      * @apiParam {Number} advance_notice sameDay = 0, 1day: 1, 2day: 2, 3day: 3
      * @apiParam {Number} cut_off_time Same Day cut-off time 
      * @apiParam {Number} guests_book_time How far the future guests can book 
      * @apiParam {Number} ci_arrive_after Check In arrive after 
      * @apiParam {Number} ci_arrive_before Check In arrive before 
      * @apiParam {Number} ci_leave_before Check In leave before 
      * @apiParam {Number} min_stay  NUmber of nights
      * @apiParam {Number} max_stay  NUmber of nights
      * 
      * 
      * @apiParamExample {json} Request-Example:
      *   {
      *       "advance_notice": 2,
      *       "cut_off_time": 10,
      *       "guests_book_time": 4,
      *       "ci_arrive_after": 10,
      *       "ci_arrive_before": "13",
      *       "ci_leave_before": "16",
      *       "min_stay": 2,
      *       "max_stay": 2
      *    }
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 201 Created
      *     
      * {
      *    "message": "Property name added",
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
      *            "is_email_confirmed": 1,
      *            "is_phone_confirmed": 1,
      *            "is_agree_hr": 1,
      *            "is_payment_information": 1,
      *            "is_trip_purpose": 1,
      *            "is_id_submitted": 1,
      *            "is_recommended_from_oh": 1,
      *            "description": "This house is newly constructed and loaded with all facilites.",
      *            "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft.",
      *            "desc_interaction_guests": null,
      *            "desc_neighbourhood": null,
      *            "desc_getting_around": null,
      *            "name": "Smart House 3 Star",
      *            "country_code": "+91",
      *            "sec_phone_number": "9882554563",
      *            "advance_notice": 2,
      *            "cut_off_time": "10 AM",
      *            "guests_book_time": "4 PM",
      *            "ci_arrive_after": "11 AM",
      *            "ci_arrive_before": "12 PM",
      *            "ci_leave_before": "12 PM",
      *            "min_stay": 2,
      *            "max_stay": 2
      *        }
      *    ]
      * }
      *
      *
      */


    async setPropertyAvailability({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                advance_notice: schema.number(),
                cut_off_time: schema.number(),
                guests_book_time: schema.number(),
                ci_arrive_before: schema.number(),
                ci_arrive_after: schema.number(),
                ci_leave_before: schema.number(),
                min_stay: schema.number([
                    rules.range(1, 100)
                ]),
                max_stay: schema.number([
                    rules.range(1, 100)
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
        const { advance_notice,
            cut_off_time,
            guests_book_time,
            ci_arrive_before,
            ci_arrive_after,
            ci_leave_before,
            min_stay,
            max_stay } = body;

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update({
                    advance_notice,
                    cut_off_time,
                    guests_book_time,
                    ci_arrive_before,
                    ci_arrive_after,
                    ci_leave_before,
                    min_stay,
                    max_stay
                });

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh',
                    'description',
                    'desc_your_space',
                    'desc_interaction_guests',
                    'desc_neighbourhood',
                    'desc_getting_around',
                    'name',
                    'country_code',
                    'sec_phone_number',
                    'advance_notice',
                    'cut_off_time',
                    'guests_book_time',
                    'ci_arrive_after',
                    'ci_arrive_before',
                    'ci_leave_before',
                    'min_stay',
                    'max_stay'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property availability added'),
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
      * @api {put} /user/hosting/list-property/pricing/:id Set Price
      * @apiHeader {String} Device-Type Device Type ios/android.
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiHeader {String} Accept-Language Language Code en OR ar.
      * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
      * @apiVersion 1.0.0
      * @apiName pricing
      * @apiGroup List Property
      *
      * @apiParam {Number} id Property ID (pass as params)
      * 
      * @apiParam {Number} base_price price of your Property per night
      * @apiParam {Boolean} [is_discount_20] 20% discount on your property (default = true)
      * 
      * 
      * 
      * @apiParamExample {json} Request-Example:
      *   {
      *       "base_price": 20,
      *       "is_discount_20": false,
      *    }
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 201 Created
      *     
      * {
      *    "message": "Property price added",
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
      *            "is_email_confirmed": 1,
      *            "is_phone_confirmed": 1,
      *            "is_agree_hr": 1,
      *            "is_payment_information": 1,
      *            "is_trip_purpose": 1,
      *            "is_id_submitted": 1,
      *            "is_recommended_from_oh": 1,
      *            "description": "This house is newly constructed and loaded with all facilites.",
      *            "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft.",
      *            "desc_interaction_guests": null,
      *            "desc_neighbourhood": null,
      *            "desc_getting_around": null,
      *            "name": "Smart House 3 Star",
      *            "country_code": "+91",
      *            "sec_phone_number": "9882554563",
      *            "advance_notice": 2,
      *            "cut_off_time": "10 AM",
      *            "guests_book_time": "4 PM",
      *            "ci_arrive_after": "11 AM",
      *            "ci_arrive_before": "12 PM",
      *            "ci_leave_before": "12 PM",
      *            "min_stay": 2,
      *            "max_stay": 2,
      *            "base_price": 20,
      *            "is_discount_20": false
      *        }
      *    ]
      * }
      *
      *
      */


    async setPropertyPricing({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                base_price: schema.number(),
                is_discount_20: schema.boolean.optional()
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
        const { base_price, is_discount_20 } = body;

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update({
                    base_price,
                    is_discount_20
                });

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh',
                    'description',
                    'desc_your_space',
                    'desc_interaction_guests',
                    'desc_neighbourhood',
                    'desc_getting_around',
                    'name',
                    'country_code',
                    'sec_phone_number',
                    'advance_notice',
                    'cut_off_time',
                    'guests_book_time',
                    'ci_arrive_after',
                    'ci_arrive_before',
                    'ci_leave_before',
                    'min_stay',
                    'max_stay',
                    'base_price',
                    'is_discount_20'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property price added'),
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
      * @api {put} /user/hosting/list-property/laws-and-calender/:id Laws and Calender
      * @apiHeader {String} Device-Type Device Type ios/android.
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiHeader {String} Accept-Language Language Code en OR ar.
      * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
      * @apiVersion 1.0.0
      * @apiName laws-and-calender
      * @apiGroup List Property
      *
      * @apiParam {Number} id Property ID (pass as params)
      * 
      * @apiParam {Boolean} [is_local_laws] Guests Agree your country laws
      * @apiParam {Boolean} [is_updated_calender] Keep calender updated
      * 
      * 
      * 
      * @apiParamExample {json} Request-Example:
      *   {
      *       "is_local_laws": true,
      *       "is_updated_calender": true,
      *    }
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 201 Created
      *     
      * {
      *    "message": "Property updated",
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
      *            "is_email_confirmed": 1,
      *            "is_phone_confirmed": 1,
      *            "is_agree_hr": 1,
      *            "is_payment_information": 1,
      *            "is_trip_purpose": 1,
      *            "is_id_submitted": 1,
      *            "is_recommended_from_oh": 1,
      *            "description": "This house is newly constructed and loaded with all facilites.",
      *            "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft.",
      *            "desc_interaction_guests": null,
      *            "desc_neighbourhood": null,
      *            "desc_getting_around": null,
      *            "name": "Smart House 3 Star",
      *            "country_code": "+91",
      *            "sec_phone_number": "9882554563",
      *            "advance_notice": 2,
      *            "cut_off_time": "10 AM",
      *            "guests_book_time": "4 PM",
      *            "ci_arrive_after": "11 AM",
      *            "ci_arrive_before": "12 PM",
      *            "ci_leave_before": "12 PM",
      *            "min_stay": 2,
      *            "max_stay": 2,
      *            "base_price": 20,
      *            "is_discount_20": false,
      *            "is_local_laws": true,
      *            "is_updated_calender": true,
      *        }
      *    ]
      * }
      *
      *
      */


    async lawsAndCalender({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                is_local_laws: schema.boolean.optional([
                    rules.requiredIfNotExists('is_updated_calender')
                ]),
                is_updated_calender: schema.boolean.optional([
                    rules.requiredIfNotExists('is_local_laws')
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
        const { is_local_laws, is_updated_calender } = body;

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update({
                    is_local_laws,
                    is_updated_calender
                });

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh',
                    'description',
                    'desc_your_space',
                    'desc_interaction_guests',
                    'desc_neighbourhood',
                    'desc_getting_around',
                    'name',
                    'country_code',
                    'sec_phone_number',
                    'advance_notice',
                    'cut_off_time',
                    'guests_book_time',
                    'ci_arrive_after',
                    'ci_arrive_before',
                    'ci_leave_before',
                    'min_stay',
                    'max_stay',
                    'base_price',
                    'is_discount_20',
                    'is_local_laws',
                    'is_updated_calender'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property updated'),
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
          * @api {put} /user/hosting/list-property/questions/:id Questions
          * @apiHeader {String} Device-Type Device Type ios/android.
          * @apiHeader {String} App-Version Version Code 1.0.0.
          * @apiHeader {String} Accept-Language Language Code en OR ar.
          * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
          * @apiVersion 1.0.0
          * @apiName questions
          * @apiGroup List Property
          *
          * @apiParam {Number} id Property ID (pass as params)
          * 
          * @apiParam {Number} [rented_before] I am new = 2, or I have = 1
          * @apiParam {Number} [have_guests] Not Sure Yet = 1, part-time = 2, as often as possible = 3.
          * @apiParam {Number} [notice_guest_ba] SameDay = 0, 1day = 1, 2day =2, ba=>before arrive.
          * @apiParam {Number} [guest_ci_from] Guest Check In Start Time ex: 10.30
          * @apiParam {Number} [guest_ci_to] Guest Check In End Time ex: 16
          * 
          * 
          * 
          * @apiParamExample {json} Request-Example 1:
          *   {
          *        "notice_guest_ba": 2,
          *        "guest_ci_from": 10,
          *        "guest_ci_to": 16
          *    }
          * @apiParamExample {json} Request-Example 2:
          *   {
          *        "rented_before": 1,
          *        "have_guests": 1,
          *    }
          *
          * @apiSuccessExample {json} Success-Response:
          *     HTTP/1.1 201 Created
          *     
          * {
          *    "message": "Property updated",
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
          *            "is_email_confirmed": 1,
          *            "is_phone_confirmed": 1,
          *            "is_agree_hr": 1,
          *            "is_payment_information": 1,
          *            "is_trip_purpose": 1,
          *            "is_id_submitted": 1,
          *            "is_recommended_from_oh": 1,
          *            "description": "This house is newly constructed and loaded with all facilites.",
          *            "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft.",
          *            "desc_interaction_guests": null,
          *            "desc_neighbourhood": null,
          *            "desc_getting_around": null,
          *            "name": "Smart House 3 Star",
          *            "country_code": "+91",
          *            "sec_phone_number": "9882554563",
          *            "advance_notice": 2,
          *            "cut_off_time": 10,
          *            "guests_book_time": 16,
          *            "ci_arrive_after": 11,
          *            "ci_arrive_before": 14,
          *            "ci_leave_before": 16,
          *            "min_stay": 2,
          *            "max_stay": 2,
          *            "base_price": 20,
          *            "is_discount_20": false,
          *            "is_local_laws": true,
          *            "is_updated_calender": true,
          *            "have_guests": 2,
          *            "rented_before": 1,
          *            "notice_guest_ba": 2,
          *            "guest_ci_from": 10,
          *            "guest_ci_to": 16
          *        }
          *    ]
          * }
          *
          *
          */


    async PropertyQuestions({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                rented_before: schema.number.optional([
                    rules.requiredIfNotExists('notice_guest_ba'),
                    rules.requiredIfExists('have_guests')
                ]),
                have_guests: schema.number.optional([
                    rules.requiredIfNotExists('notice_guest_ba'),
                    rules.requiredIfExists('rented_before')
                ]),
                notice_guest_ba: schema.number.optional([
                    rules.requiredIfNotExists('have_guests')
                ]),
                guest_ci_from: schema.number.optional([
                    rules.requiredIfExists('notice_guest_ba')
                ]),
                guest_ci_to: schema.number.optional([
                    rules.requiredIfExists('guest_ci_from')
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
        const questions = { ...body };

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update(questions);

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh',
                    'description',
                    'desc_your_space',
                    'desc_interaction_guests',
                    'desc_neighbourhood',
                    'desc_getting_around',
                    'name',
                    'country_code',
                    'sec_phone_number',
                    'advance_notice',
                    'cut_off_time',
                    'guests_book_time',
                    'ci_arrive_after',
                    'ci_arrive_before',
                    'ci_leave_before',
                    'min_stay',
                    'max_stay',
                    'base_price',
                    'is_discount_20',
                    'is_local_laws',
                    'is_updated_calender',
                    'rented_before',
                    'have_guests',
                    'notice_guest_ba',
                    'guest_ci_from',
                    'guest_ci_to'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property updated'),
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
          * @api {put} /user/hosting/list-property/discounts/:id Long Term Discounts
          * @apiHeader {String} Device-Type Device Type ios/android.
          * @apiHeader {String} App-Version Version Code 1.0.0.
          * @apiHeader {String} Accept-Language Language Code en OR ar.
          * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
          * @apiVersion 1.0.0
          * @apiName discounts
          * @apiGroup List Property
          *
          * @apiParam {Number} id Property ID (pass as params)
          * 
          * @apiParam {Number} weekly_discount 
          * @apiParam {Number} monthly_discount
          *  
          * 
          * @apiParamExample {json} Request-Example :
          *   {
          *        "weekly_discount": 5,
          *        "monthly_discount": 17,
          *    }
          *
          * @apiSuccessExample {json} Success-Response:
          *     HTTP/1.1 201 Created
          *     
          * {
          *    "message": "Property updated",
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
          *            "is_email_confirmed": 1,
          *            "is_phone_confirmed": 1,
          *            "is_agree_hr": 1,
          *            "is_payment_information": 1,
          *            "is_trip_purpose": 1,
          *            "is_id_submitted": 1,
          *            "is_recommended_from_oh": 1,
          *            "description": "This house is newly constructed and loaded with all facilites.",
          *            "desc_your_space": "There is a common area 20x20 ft, and a loan wiht 100x100 ft.",
          *            "desc_interaction_guests": null,
          *            "desc_neighbourhood": null,
          *            "desc_getting_around": null,
          *            "name": "Smart House 3 Star",
          *            "country_code": "+91",
          *            "sec_phone_number": "9882554563",
          *            "advance_notice": 2,
          *            "cut_off_time": 10,
          *            "guests_book_time": 16,
          *            "ci_arrive_after": 11,
          *            "ci_arrive_before": 14,
          *            "ci_leave_before": 16,
          *            "min_stay": 2,
          *            "max_stay": 2,
          *            "base_price": 20,
          *            "is_discount_20": false,
          *            "is_local_laws": true,
          *            "is_updated_calender": true,
          *            "have_guests": 2,
          *            "rented_before": 1,
          *            "notice_guest_ba": 2,
          *            "guest_ci_from": 10,
          *            "guest_ci_to": 16,
          *            "weekly_discount": 5,
          *            "monthly_discount": 17,
          *        }
          *    ]
          * }
          *
          *
          */


    async longTermDiscounts({ request, response, params }: HttpContextContract) {
        const property_id = params.id;
        try {
            let validateSchema = schema.create({
                weekly_discount: schema.number.optional([
                    rules.requiredIfNotExists('monthly_discount')
                ]),
                monthly_discount: schema.number.optional([
                    rules.requiredIfNotExists('weekly_discount')
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
        const { monthly_discount = 0, weekly_discount = 0 } = body;

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update({ monthly_discount, weekly_discount });

            let property = await PropertyListing.query()
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
                    'location',
                    'is_email_confirmed',
                    'is_phone_confirmed',
                    'is_agree_hr',
                    'is_payment_information',
                    'is_trip_purpose',
                    'is_id_submitted',
                    'is_recommended_from_oh',
                    'description',
                    'desc_your_space',
                    'desc_interaction_guests',
                    'desc_neighbourhood',
                    'desc_getting_around',
                    'name',
                    'country_code',
                    'sec_phone_number',
                    'advance_notice',
                    'cut_off_time',
                    'guests_book_time',
                    'ci_arrive_after',
                    'ci_arrive_before',
                    'ci_leave_before',
                    'min_stay',
                    'max_stay',
                    'base_price',
                    'is_discount_20',
                    'is_local_laws',
                    'is_updated_calender',
                    'rented_before',
                    'have_guests',
                    'notice_guest_ba',
                    'guest_ci_from',
                    'guest_ci_to',
                    'monthly_discount',
                    'weekly_discount',
                    'status'
                )
                .finally();

            if (!property) property = [];
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property updated'),
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
          * @api {get} /user/hosting/list-property/publish/:id Publish Property
          * @apiHeader {String} Device-Type Device Type ios/android.
          * @apiHeader {String} App-Version Version Code 1.0.0.
          * @apiHeader {String} Accept-Language Language Code en OR ar.
          * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
          * @apiVersion 1.0.0
          * @apiName publish
          * @apiGroup List Property
          *
          * @apiParam {Number} id Property ID (pass as params)
          * @apiSuccessExample {json} Success-Response:
          *     HTTP/1.1 200 Success
          * {
          *      "message": "Property published"
          *  }
          * 
          */

    async publishProperty({ params, response, auth }: HttpContextContract) {
        try {
            const property_id = params.id;
            const user_id = auth.user?.id;
            const property = await PropertyListing.query()
                .where({ id: property_id, user_id })
                .first();

            if (!property) {
                return response.status(Response.HTTP_BAD_REQUEST).json({
                    message: t('Invalid property id'),
                });
            }
            await PropertyListing.query()
                .where('id', property_id)
                .update({ status: PROPERTY_STATUS.published });

            return response.status(Response.HTTP_OK).json({
                message: t('Property published'),
            });
        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
                message: t('Something went wrong')
            });
        }
    }


    /**
          * @api {get} /user/hosting/list-property/preview/:id Preview Property
          * @apiHeader {String} Device-Type Device Type ios/android.
          * @apiHeader {String} App-Version Version Code 1.0.0.
          * @apiHeader {String} Accept-Language Language Code en OR ar.
          * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
          * @apiVersion 1.0.0
          * @apiName preview
          * @apiGroup List Property
          *
          * @apiParam {Number} id Property ID (pass as params)
          * @apiSuccessExample {json} Success-Response:
          *     HTTP/1.1 200 Success
          * {
            "data": [
                {
                    "id": 1,
                    "uid": "f420c40d-f1ee-435b-a9e5-d9cb33c0605e",
                    "property_type": 2,
                    "is_beach_house": 1,
                    "is_dedicated_guest_space": 0,
                    "is_business_hosting": 1,
                    "no_of_guests": 2,
                    "no_of_bedrooms": 1,
                    "no_of_bathrooms": 2,
                    "country": "India",
                    "address_optional": "H Block",
                    "street": "Noida Sector 63",
                    "city": "Noida",
                    "state": "UP",
                    "zip_code": "300221",
                    "latitude": 20.134,
                    "longitude": 10.24,
                    "location": "A-121, Sec-63 Noida, Utter Pradesh 201301",
                    "is_email_confirmed": 1,
                    "is_phone_confirmed": 1,
                    "is_payment_information": 1,
                    "is_agree_hr": 1,
                    "is_trip_purpose": 1,
                    "is_id_submitted": 1,
                    "is_recommended_from_oh": 0,
                    "cover_photo": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/06-OTP_verification/06-OTP_verification.png",
                    "type": {
                        "property_type": "Apartment",
                        "id": 2
                    },
                    "images": [
                        {
                            "image_url": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/06-OTP_verification/06-OTP_verification.png",
                            "property_id": 1
                        }
                        .
                        .
                        .
                    ],
                    "amenities": [
                        {
                            "amenity_id": 2,
                            "property_id": 1,
                            "amenity_name": {
                                "name": "TVZ",
                                "id": 2
                            }
                        },
                        .
                        .
                        .
                    ],
                    "beds": [
                        {
                            "bed_id": 1,
                            "serial_number": 0,
                            "count": 2,
                            "bedroom_name": "Common Space",
                            "property_id": 1,
                            "bed_type": {
                                "bed_type": "double",
                                "id": 1
                            }
                        },
                        .
                        .
                        .
                    ],
                    "rules": [
                        {
                            "rule_id": 4,
                            "is_additional": 0,
                            "is_cancelled": 0,
                            "cancel_reason": null,
                            "description": null,
                            "rule": {
                                "rule": "Smoking allowed",
                                "id": 4
                            }
                        },
                        {
                            "rule_id": 5,
                            "is_additional": 0,
                            "is_cancelled": 0,
                            "cancel_reason": null,
                            "description": null,
                            "rule": {
                                "rule": "Events allowed",
                                "id": 5
                            }
                        },
                        {
                            "rule_id": null,
                            "is_additional": 1,
                            "is_cancelled": 0,
                            "cancel_reason": null,
                            "description": "test"
                        }
                        .
                        .
                        .
                    ]
                }
            ]
        }
          * 
          */

    async propertyPreview({ response, auth, params }: HttpContextContract) {
        try {
            const property_id = params.id;
            const user_id = auth.user?.id;
            const property = await PropertyListing.query()
                .where({ id: property_id, user_id })
                .preload('type', builder => builder.select('property_type'))
                .preload('beds', builder => {
                    builder.select(
                        'bed_id',
                        'serial_number',
                        'count',
                        'bedroom_name'
                    )
                        .preload('bed_type', builder => builder.select('bed_type'))
                })
                .preload('amenities', builder => {
                    builder
                        .select('amenity_id')
                        .preload('amenity_name', builder => builder.select(
                            'name', 
                            'type', 
                            'description',
                            'icon_url'))
                })
                .preload('details', builder => {
                    builder
                        .select('detail_id', 'explanation')
                        .preload('detail', detailQuery => detailQuery.select(
                            'name',
                            'description'
                        ))
                })
                .preload('images', builder => builder.select('image_url'))
                .first();

            const rules_fixed = await PropertyRule.query()
                .where({ property_id, is_additional: false })
                .select(
                    'rule_id',
                    'is_additional',
                    'is_cancelled',
                    'cancel_reason',
                    'description'
                )
                .preload('rule', builder => builder.select('rule'))
                .finally();


            const rules_additional = await PropertyRule.query()
                .where({ property_id, is_additional: true })
                .select(
                    'rule_id',
                    'is_additional',
                    'is_cancelled',
                    'cancel_reason',
                    'description'
                );

            const rules = rules_fixed.concat(rules_additional);
            const property_json = property?.toJSON();

            const data = [{ ...property_json, rules }]
            response.status(200).json({
                data
            })
        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
                message: t('Something went wrong')
            });
        }
    }



    /**
    * @api {put} /user/hosting/list-property/photos/:id Property Images
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName photos
    * @apiGroup List Property
    *
    * @apiParam {Number} id Property ID (pass as params)
    * 
    * @apiParam {String} cover_photo url of an image
    * @apiParam {Object[]} images urls of images
    * 
    * 
    * @apiParamExample {json} Request-Example:
    *   {
            "cover_photo": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing your email/08-Recognizing your email.png",
            "images": [
                {
                    "image_url": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing your email/08-Recognizing your email.png"
                },
                {
                    "image_url": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing your email - Social/08-Recognizing your email - Social.png"
                }
            ]
        }
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
            "message": "Property images added",
            "data": {
                "cover_photo": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing your email/08-Recognizing your email.png",
                "images": [
                    {
                        "property_id": 1,
                        "image_url": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing your email/08-Recognizing your email.png"
                    },
                    {
                        "property_id": 1,
                        "image_url": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing your email - Social/08-Recognizing your email - Social.png"
                    }
                ]
            }
        }
    *
    *    
    *
    * @apiErrorExample {json} Error-Response:
    *
    *     HTTP/1.1 400 Bad Request
    *     {
    *    "message": "validation Failed",
    *    "error": {
    *        "images": [
    *            "number validation failed"
    *        ]
    *    }
    *   }
    *
    */


    async addPropertyPhotos({ request, response, params, auth }: HttpContextContract) {
        const property_id = params.id;
        const user_id = auth.user?.id;

        try {
            const validateSchema = schema.create({
                cover_photo: schema.string.optional(),
                images: schema.array(
                    [rules.minLength(1)]
                ).members(schema.object().members(
                    {
                        image_url: schema.string()
                    }
                ))
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
        const cover_photo = body.cover_photo || null;
        if (cover_photo) {
            const photo_key = cover_photo.split(S3_DIRECTORIES.propertyFiles)[1];
            await PropertyListing.query()
                .where({ id: property_id, user_id })
                .update({ cover_photo: photo_key })
        }
        const images = body.images;

        const images_data = images.map(e => {
            const image_key = e.image_url.split(S3_DIRECTORIES.propertyFiles)[1];
            const item = {
                property_id,
                image_url: e.image_url,
                image_key
            }
            return item;
        });

        try {
            await PropertyImage.query()
                .where({ property_id })
                .delete();

            await PropertyImage.createMany(images_data);

            let images = await PropertyImage.query()
                .where({ property_id })
                .select('property_id', 'image_url')
                .finally();

            const data = {
                cover_photo,
                images
            }
            return response.status(Response.HTTP_CREATED).json({
                message: t('Property images added'),
                data
            });

        } catch (error) {
            console.log(error)
            return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
                message: t('Something went wrong')
            });
        }
    }





}