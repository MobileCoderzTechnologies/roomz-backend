import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import PropertyListing from 'App/Models/PropertyListing';
import PropertyRule from 'App/Models/PropertyRule';
import i18n from 'App/Helpers/i18n';
import { ApiFeatures } from 'App/Utils/apiFeatures';
import { PROPERTY_STATUS } from 'App/Constants/PropertyConstant';

const t = i18n.__;



export default class PropertiesController {

  /** 
  * @api {get} /admin/property-list?name=''& Property List
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
  * @apiVersion 1.0.0
  * @apiName property-list
  * @apiGroup Admin
  *
  * @apiParam {String} id Property ID (pass as params)
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 Success
  */
  async getPropertyList({ request, response }: HttpContextContract) {
    try {

      const queryString = request.qs();
      const propertyQuery = PropertyListing.query()
        .whereNotIn('status', [PROPERTY_STATUS.deleted, PROPERTY_STATUS.draft]);
      const apiFeatures = new ApiFeatures(propertyQuery, queryString)
        .filtering()
        .searching(['name', 'city', 'street'])
        .sorting('created_at')
        .pagination();

      const properties = await apiFeatures.query;

      return response.status(Response.HTTP_OK).json({
        properties
      });

    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Something went wrong')
      });
    }
  }


  /**
  * @api {delete} /admin/delete-property/:uid Delete Property
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
  * @apiVersion 1.0.0
  * @apiName delete-property
  * @apiGroup Admin
  *
  * @apiParam {String} id Property ID (pass as params)
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 Success
  * 
  * {
  *  "message": "Property deleted successfully"
  *  }
  */
  async deleteProperty({ response, params }: HttpContextContract) {
    try {
      console.log('start deleting');
      const propertyId = params.id;
      const property = await PropertyListing.query()
        .where('uid', propertyId)
        .first();

      if (property) {
        property.status = PROPERTY_STATUS.deleted;
        await property.save();
      } else {
        return response.status(Response.HTTP_BAD_REQUEST).json({
          message: t('Invalid property Id')
        });
      }

      return response.status(Response.HTTP_OK).json({
        message: t('Property deleted successfully'),
      });

    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Something went wrong')
      });
    }
  }


  /**
  * @api {get} /admin/block-property/:uid Block Unblock Property
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
  * @apiVersion 1.0.0
  * @apiName block-property
  * @apiGroup Admin
  *
  * @apiParam {String} id Property ID (pass as params)
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 Success
  */

  async toggleStatus({ response, params }: HttpContextContract) {
    try {
      const propertyId = params.id;
      const property = await PropertyListing.query()
        .where('uid', propertyId)
        .first();
      
      if (property) {
        if (property.status === PROPERTY_STATUS.blocked) {
          property.status = PROPERTY_STATUS.published;
        }

        if (property.status !== PROPERTY_STATUS.blocked) {
          property.status = PROPERTY_STATUS.blocked;
        }
        property.save();

        return response.status(Response.HTTP_OK).json({
          message: t('Property status updated'),
          property
        });
      }

    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Something went wrong')
      });
    }
  }



  /**
          * @api {get} /admin/property-details/:id Property Details
          * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
          * @apiVersion 1.0.0
          * @apiName property-details
          * @apiGroup Admin
          *
          * @apiParam {String} id Property ID (pass as params)
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

  async propertyDetails({ response, params }: HttpContextContract) {
    try {
      const property_id = params.id;
      const property = await PropertyListing.query()
        .where({ id: property_id })
        .preload('type', builder => builder.select('property_type'))
        .preload('user', builder => {
          builder.select(
            'id',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'avatar',
            'created_at'
          )
        })
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
}
