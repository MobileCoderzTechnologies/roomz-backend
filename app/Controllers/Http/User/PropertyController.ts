import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import PropertyListing from 'App/Models/PropertyListing';
import PropertyBed from 'App/Models/PropertyBed';
import PropertyAmenity from 'App/Models/PropertyAmenity';
import PropertyRule from 'App/Models/PropertyRule';
import PropertyDetail from 'App/Models/PropertyDetail';
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
    *@apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
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
                    'is_common_space',
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
   * @apiParam {Number} id Property unique ID (pass as params)
   * 
   * @apiParam {Boolean} is_email_confirmed 
   * @apiParam {Boolean} is_phone_confirmed 
   * @apiParam {Boolean} is_payment_information 
   * @apiParam {Boolean} is_trip_purpose 
   * @apiParam {Boolean} is_no_negative_reviews 
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
   *   "is_no_negative_reviews": true
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
   *            "is_no_negative_reviews": 1,
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
                is_no_negative_reviews: schema.boolean.optional(),
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
                    'is_no_negative_reviews'
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
    * @apiParam {Number} id Property unique ID (pass as params)
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
            return e;
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
    * @apiParam {Number} id Property unique ID (pass as params)
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
            e.property_id = property_id;
            e.uid = uuid();
            return e;
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
      * @apiParam {Number} id Property unique ID (pass as params)
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
      *            "is_no_negative_reviews": 1,
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
        const property_description = { ...body };

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update(property_description);

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
                    'is_no_negative_reviews',
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
      * @apiParam {Number} id Property unique ID (pass as params)
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
      *            "is_no_negative_reviews": 1,
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
        const name = { ...body };

        try {
            await PropertyListing.query()
                .where('id', property_id)
                .update(name);

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
                    'is_no_negative_reviews',
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








}