import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import BedType from "App/Models/BedType";
import PropertyType from "App/Models/PropertyType";
import Amenity from "App/Models/Amenity";
import HomeDetail from "App/Models/HomeDetail";
import HomeRule from "App/Models/HomeRule";
import PropertyListing from 'App/Models/PropertyListing';
import PropertyAmenity from 'App/Models/PropertyAmenity';
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

import Env from '@ioc:Adonis/Core/Env';
import { FileUploadOnS3 } from 'App/Helpers/fileUpload';
import { IMAGE_SIZES } from 'App/Constants/ImageSizesConstant';
import { PROPERTY_STATUS } from 'App/Constants/PropertyConstant';


export default class HostingController {
  /**
    * @api {get} /user/hosting/bed-types Bed Types
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName BedTypes
    * @apiGroup Hosting
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "data": [
    *      {
    *           "id": 1,
    *          "uid": "be4805d2-5782-4a8c-af27-9fc70da0dd65",
    *          "bed_type": "double"
    *      },
    *      {
    *           "id": 2,
    *          "uid": "c1cfaaef-db8e-4928-8d86-1f25999fb5d6",
    *          "bed_type": "queen"
    *      },
    *      {
    *          "id": 3,
    *          "uid": "c82267e0-5a11-49b2-9592-e48c5f8f4fbc",
    *          "bed_type": "single"
    *      },
    *      {
    *          "id": 4,
    *          "uid": "878bd05f-194f-4e84-b8f0-e2953f9f8517",
    *          "bed_type": "sofa bed"
    *      }
    *      ]
    *     }
    * @apiErrorExample {json} Error-Response:
    *
    *     HTTP/1.1 500 Internal Serve Error
    *     {
    *        "message": "Something went wrong"
    *      }
    *
    */
  async getBedTypes({ response }: HttpContextContract) {
    try {
      const bedList = await BedType.query()
        .select('id', 'uid', 'bed_type')
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

  /**
    * @api {get} /user/hosting/property-types Property Types
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName PropertyTypes
    * @apiGroup Hosting
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *    "data": [
    *      {
    *        "id": 1,
    *        "uid": "af1ebb9a-80a1-4573-8ba5-98d6a81f3210",
    *        "property_type": "Villa"
    *      },
    *      {
    *         "id":2
    *        "uid": "43d21645-e458-4eed-8db5-d08cde2bdfcd",
    *        "property_type": "Apartment"
    *      },
    *      {
    *       "id":3,
    *        "uid": "c12c0a8f-c07f-46fc-804f-ab198b4e7304",
    *        "property_type": "Farm House"
    *      },
    *      {
    *         "id":4,
    *        "uid": "bb178ee0-d880-4fda-881d-802c0aaa0f22",
    *        "property_type": "Istiraha"
    *      },
    *      {
    *         "id": 5,
    *        "uid": "55133720-6407-4e1a-9fa7-c278e1da85c1",
    *        "property_type": "Camp"
    *      },
    *      {
    *         "id":6
    *        "uid": "2a2391b9-a595-4853-a538-2f6cc5c46263",
    *        "property_type": "Heritage House"
    *      }
    *   ]
    *  }
    * @apiErrorExample {json} Error-Response:
    *
    *     HTTP/1.1 500 Internal Serve Error
    *     {
    *        "message": "Something went wrong"
    *      }
    *
    */
  async getPropertyTypes({ response }: HttpContextContract) {
    try {
      const propertyList = await PropertyType.query()
        .select('id', 'uid', 'property_type')
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

  /**
    * @api {get} /user/hosting/amenities Amenity List
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName Amenities
    * @apiGroup Hosting
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *    "data": [
    *     {
    *       "id": 1,
    *        "uid": "f18580fe-28b0-4954-8d07-7d2f0c40d57f",
    *        "name": "Wifi",
    *        "type": "normal",
    *        "description": null
    *    },
    *    {
    *        "id": 17,
    *        "uid": "696032f1-b749-4629-a8fe-cde62bde6b4f",
    *        "name": "Smoke Alarm",
    *        "type": "safety",
    *        "description": "Check your local lows which may require a working smoke *detector in every room"
    *    },
    *    {
    *        "id": 18,
    *        "uid": "8582c261-a945-444e-bf35-38877ec72d11",
    *        "name": "Carbon monoxide Alarm",
    *        "type": "safety",
    *        "description": "Check your local lows which may require a working carbon *monoxide detector in every room"
    *   },
    *    {
    *        "id": 19,
    *        "uid": "af617c01-8a12-48f5-8e86-1038a630f58a",
    *        "name": "Lock on Bedroom door",
    *        "type": "safety",
    *        "description": "Private room can be locked for safety and privacy"
    *    },
    *    {
    *        "id": 20,
    *        "uid": "20963d0b-8701-44bf-98c5-349544a76034",
    *        "name": "Kitchen",
    *        "type": "space",
    *         "description": "Space where guests can cook their own meal"
    *    },
    * ...
    * ...
    * ...
    *   ]
    *  }
    * @apiErrorExample {json} Error-Response:
    *
    *     HTTP/1.1 500 Internal Serve Error
    *     {
    *        "message": "Something went wrong"
    *      }
    *
    */
  async getAmenities({ response }: HttpContextContract) {
    try {
      const aminityList = await Amenity.query()
        .select('id', 'uid', 'name', 'type', 'description')
        .finally();
      return response.status(Response.HTTP_OK).json({
        data: aminityList
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }


  /**
    * @api {get} /user/hosting/home-details Home Details
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName home-details
    * @apiGroup Hosting
    *
    * @apiSuccessExample {json} Success-Response:
    *   HTTP/1.1 200 OK
    *   {
    *     "data": [
    *   {
    *        "id": 1,
    *        "uid": "954e2ffe-ab0a-4b19-bc87-99eb058228a8",
    *        "name": "Must Climb Stairs",
    *        "description": "Describe the stairs(for example, how many flights)"
    *    },
    *    {
    *        "id": 2,
    *        "uid": "019af93c-e1d6-420d-9c4d-b4246ee4b7ff",
    *        "name": "Potential for noise",
    *        "description": null
    *    },
    *    {
    *        "id": 3,
    *        "uid": "37e68fe7-3fc7-472c-99c9-5428f66159d5",
    *        "name": "Pet(s) live on property",
    *        "description": null
    *    },
    *    {
    *        "id": 4,
    *        "uid": "bcbaf4ce-6839-4b66-b44b-d35293106e8f",
    *        "name": "No parking on property",
    *        "description": null
    *    },
    * .
    * .
    * .
    *     ]
    *   }
    *     
    *    
    *  }
    * @apiErrorExample {json} Error-Response:
    *
    *     HTTP/1.1 500 Internal Serve Error
    *     {
    *        "message": "Something went wrong"
    *      }
    *
    */
  async getHomeDetails({ response }: HttpContextContract) {
    try {
      const homeDetailsList = await HomeDetail.query()
        .select('id', 'uid', 'name', 'description')
        .finally();
      return response.status(Response.HTTP_OK).json({
        data: homeDetailsList
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }


  /**
    * @api {get} /user/hosting/home-rules Home Rules
    * @apiHeader {String} Device-Type Device Type ios/android.
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiHeader {String} Accept-Language Language Code en OR ar.
    * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
    * @apiVersion 1.0.0
    * @apiName home-rules
    * @apiGroup Hosting
    *
    * @apiSuccessExample {json} Success-Response:
    *   HTTP/1.1 200 OK
    *   {
    *     "data": [
    *   {
    *        "id": 1,
    *        "uid": "b2607d2a-2b10-4504-8872-f9b0ab1a986e",
    *        "rule": "Suitable for children (2-12)"
    *    },
    *    {
    *        "id": 2,
    *        "uid": "f7e7a7c0-dac8-4c18-a908-e0677d1d8756",
    *        "rule": "Suitable for infants (under 2)"
    *    },
    *    {
    *        "id": 3,
    *        "uid": "52e7952a-afea-4789-924b-43c883016dff",
    *        "rule": "Suitable for pets"
    *    },
    *    {
    *        "id": 4,
    *        "uid": "26e24756-e13d-47eb-a6bb-f6f0470c428d",
    *        "rule": "Smoking allowed"
    *    },
    *    {
    *        "id": 5,
    *        "uid": "a14a9afc-140b-4ea0-971f-5dc8d3fd54db",
    *        "rule": "Events allowed"
    *    }
    *     ]
    *   }
    *     
    *    
    *  }
    * @apiErrorExample {json} Error-Response:
    *
    *     HTTP/1.1 500 Internal Serve Error
    *     {
    *        "message": "Something went wrong"
    *      }
    *
    */
  async getHomeRule({ response }: HttpContextContract) {
    try {
      const homeRuleList = await HomeRule.query()
        .select('id', 'uid', 'rule')
        .finally();
      return response.status(Response.HTTP_OK).json({
        data: homeRuleList
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }


  /**
      * @api {Post} /user/hosting/upload-images/:id Upload Images
      * @apiHeader {String} Device-Type Device Type ios/android.
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiHeader {String} Accept-Language Language Code en OR ar.
      * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
      * @apiVersion 1.0.0
      * @apiName upload-images
      * @apiGroup Hosting
      * 
      * @apiParam {Files} images Array of images, request body formdata
      * 
      *
      * 
      * @apiSuccessExample {json} Success-Response:
      *   HTTP/1.1 200 OK
      * 
      * {
          "data": [
              {
                  "image_url": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing your email/08-Recognizing your email.png"
              },
              {
                  "image_url": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing your email - Social/08-Recognizing your email - Social.png"
              }
              .
              .
              .
              .
          ]
        }
      */

  async uploadImage({ request, response }: HttpContextContract) {
    try {
      const files = request.files('images');
      const response_arr: { image_url: string }[] = [];
      for (const file of files) {
        const file_name = file.clientName;
        const file_name_dir = file_name.split('.')[0];
        const directory = `property-files/${file_name_dir}`;
        const name = await FileUploadOnS3.uploadFile(file, directory, file_name, null);
        await FileUploadOnS3.makeImageCopies(file, directory);

        if (name) {
          const image_url = `${Env.get('ASSET_URL_S3')}${name}`;
          response_arr.push({
            image_url
          });
        }
      }
      response.status(200).json({
        data: response_arr
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }


  /**
      * @api {Post} /user/hosting/remove-images/:id Remove Images
      * @apiHeader {String} Device-Type Device Type ios/android.
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiHeader {String} Accept-Language Language Code en OR ar.
      * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
      * @apiVersion 1.0.0
      * @apiName remove-images
      * @apiGroup Hosting
      * 
      * @apiParam {Object[]} images array of image urls 
      * 
      * @apiParamExample {json} Request-Example 
        {
          "images": [
              {
                  "image_url": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/08-Recognizing%20your%20email/08-Recognizing%20your%20email.png"
              }
          ]
        }
      *
      * 
      * @apiSuccessExample {json} Success-Response:
      *   HTTP/1.1 200 OK
      * {
      *      "message": "Images deleted"
      *  }
      */

  async deleteImages({ request, response }: HttpContextContract) {
    try {
      const body = request.body();
      const images = body.images;
      const imageConfiguration = IMAGE_SIZES;
      const bucket_name = Env.get('S3_BUCKET');
      for (const image of images) {
        const { image_url } = image;
        const image_key = image_url.split(`/${bucket_name}`)[1];

        console.log('image_key', image_key);
        // delete image 
        const is_deleted = await FileUploadOnS3.removeFileFromS3(image_key);
        console.log('main image deleted', is_deleted);
        // deleting resized image
        const key_split = image_key.split('/');
        key_split.pop();
        const key_string = key_split.join('/');

        for (const config of imageConfiguration) {
          const key = `${key_string}/${config.imagePath}.jpeg`;
          const is_deleted = await FileUploadOnS3.removeFileFromS3(key);

          console.log('key ', key);
          console.log(`${config.imagePath} is deleted`, is_deleted);
        }

      }
      response.status(200).json({
        message: t('Images deleted')
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }


  /**
  * @api {get} /user/hosting/listing-status Listing Status
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
  * @apiVersion 1.0.0
  * @apiName listing-status
  * @apiGroup Hosting
  *
  * @apiSuccessExample {json} Success-Response:
  *   HTTP/1.1 200 OK
  *   {
  *  "data": {
  *          "listing_status": false
  *      }
  * }
  *    
  *
  * @apiErrorExample {json} Error-Response:
  *
  *     HTTP/1.1 500 Internal Serve Error
  *     {
  *        "message": "Something went wrong"
  *      }
  *
  */
  async listingStatus({ auth, response }: HttpContextContract) {
    try {
      const user_id = auth.user?.id;
      const property = await PropertyListing.query()
        .whereNot('status', PROPERTY_STATUS.deleted)
        .where({ user_id })
        .first();

      const listing_status = property ? true : false;

      return response.status(Response.HTTP_OK).json({
        data: {
          listing_status
        }
      })
    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
        message: t('Something went wrong')
      });
    }
  }



  /**
  * @api {get} /user/hosting/my-properties?search=''&beds=4&bedrooms&amenities=1,2,3,4&status=1,2,3&page=1&pageSize=10 My Properties
  * @apiHeader {String} Device-Type Device Type ios/android.
  * @apiHeader {String} App-Version Version Code 1.0.0.
  * @apiHeader {String} Accept-Language Language Code en OR ar.
  * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiI...............
  * @apiVersion 1.0.0
  * @apiName my-properties
  * @apiGroup Hosting
  * 
  * @apiDescription This is the Description.
  * It is multiline capable.
  *
  * Last line of Description.
  *
  * @apiSuccessExample {json} Success-Response:
  *   HTTP/1.1 200 OK
  *   {
    "data": {
        "meta": {
            "total": 1,
            "per_page": 100,
            "current_page": 1,
            "last_page": 1,
            "first_page": 1,
            "first_page_url": "/?page=1",
            "last_page_url": "/?page=1",
            "next_page_url": null,
            "previous_page_url": null
        },
        "data": [
            {
                "id": 6,
                "uid": "93b18dfe-0449-4868-9e9e-556957414123",
                "no_of_bedrooms": 1,
                "no_of_beds": 6,
                "no_of_bathrooms": 1,
                "city": "Dausa",
                "location": "3W2G+X5M, Mahwa, Rajasthan 321608, India",
                "updated_at": "2021-08-13T15:12:12.000+05:30",
                "status": 1,
                "cover_photo": "https://s3.me-south-1.amazonaws.com/roomz-files/property-files/Screenshot from 2021-06-18 15-38-29/Screenshot from 2021-06-18 15-38-29.png"
            }
            .
            .
            .

              ]
          }
      }
  *    
  *
  * @apiErrorExample {json} Error-Response:
  *
  *     HTTP/1.1 500 Internal Serve Error
  *     {
  *        "message": "Something went wrong"
  *      }
  *
  */


  async getPropertyList({ auth, request, response }: HttpContextContract) {
    try {
      const user_id = auth.user?.id;
      const queryString = request.qs();

      const page = queryString.page * 1 || 1;
      const limit = queryString.pageSize * 1 || 100;
      const no_of_beds = queryString.beds * 1 || 0;
      const no_of_bathrooms = queryString.bathrooms * 1 || 0;
      const no_of_bedrooms = queryString.bedrooms * 1 || 0;
      const amenityString = queryString.amenities || '';
      const statusString = queryString.status || '';

      const search = queryString.search || '';

      let query = PropertyListing.query()
        .whereNot({ status: PROPERTY_STATUS.deleted })
        .where({ user_id })

      if (no_of_beds) query = query.where({ no_of_beds })
      if (no_of_bathrooms) query = query.where({ no_of_bathrooms })
      if (no_of_bedrooms) query = query.where({ no_of_bedrooms })

      if (statusString) {
        const status = statusString.split(',');
        query = query.whereIn('status', status)
      }

      if (search) {
        query = query.whereRaw(`name LIKE '%${search}%' OR city LIKE '%${search}%'`)
      }

      if (amenityString) {
        const amenities = amenityString.split(',');
        let amenity_data = await PropertyAmenity.query()
          .whereIn('amenity_id', amenities)
          .distinct('property_id')
          .select(
            'property_id'
          )
          .finally();

        const ids: number[] = [];
        amenity_data.forEach(item => {
          ids.push(item.property_id);
        });

        query = query.whereIn('id', ids);
      }



      const propertyList = await query.select(
        'id',
        'uid',
        'no_of_bedrooms',
        'no_of_beds',
        'no_of_bathrooms',
        'city',
        'location',
        'updated_at',
        'status',
        'cover_photo'
      )
        .orderBy('id', 'desc')
        .paginate(page, limit);

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


