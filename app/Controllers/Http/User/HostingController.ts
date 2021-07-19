import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Response from "App/Helpers/Response";
import BedType from "App/Models/BedType";
import PropertyType from "App/Models/PropertyType";
import Amenity from "App/Models/Amenity";
import HomeDetail from "App/Models/HomeDetail";
// Transaltion
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

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
  async getHomeRule({ response }: HttpContextContract) {
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





}
