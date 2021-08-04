import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { v4 as uuid } from "uuid";
import Amenity from "App/Models/Amenity";


export default class AmenitySeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Amenity.createMany([
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Wifi',
        'icon_url':'Wifi.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'TV',
        'icon_url':'tv.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Hot Water',
        'icon_url':'hot_water.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Air Conditioning',
        'icon_url':'air_conditioning.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Shampoo',
        'icon_url': 'sampoo.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Hair Dryer',
        'icon_url': 'hair_dryer.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Dedicated Workspace',
        'icon_url': 'dedicated_workspace.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Cooking basics',
        'description': 'Pots and pans, oil salt and pepper',
        'icon_url': 'cooking_basics.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Bathroom essentials',
        'description': 'Towels, shop, shampoo and toilet paper',
        'icon_url': 'bathroom_essentials.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Bath Towel',
        'icon_url': 'bath_towel.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Toilet Paper',
        'icon_url':'toilet_paper.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Body Soap',
        'icon_url': 'body_soap.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Hand Soap',
        'icon_url': 'hand_soap.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Bed Linens',
        'icon_url': 'bed_linens.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Fireplace',
        'icon_url': 'free_parking.png'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Private Entrance',
        'icon_url': 'free_parking.png'
      },
      {
        'uid': uuid(),
        'type': 'safety',
        'name': 'Smoke Alarm',
        'description': 'Check your local lows which may require a working smoke detector in every room',
        'icon_url': 'smoke_alarm.png'
      },
      {
        'uid': uuid(),
        'type': 'safety',
        'name': 'Carbon monoxide Alarm',
        'description': 'Check your local lows which may require a working carbon monoxide detector in every room',
        'icon_url': 'carbon_monoxide_alarm.png'
      },
      {
        'uid': uuid(),
        'type': 'safety',
        'name': 'Lock on Bedroom door',
        'description': 'Private room can be locked for safety and privacy',
        'icon_url': 'lock_bedroom_door.png'
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Kitchen',
        'description': 'Space where guests can cook their own meal',
        'icon_url': 'kitchen.png'
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Free Parking on premises',
        'icon_url': 'free_parking.png'
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Washer',
        'icon_url': 'washer.png'
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Hot Tub',
        'icon_url': 'hot_tub.png'
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Pool',
        'icon_url': 'pool.png'
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Paid Parking off premies',
        'icon_url': 'paid_parking.png'
      },
      
    ]);

    // const amenities_arr = amenities.map(item => {
    //   item.icon_url = `${Env.get('ASSET_URL_S3')}/amenities/${item.icon_url}`;
    //   return item;
    // })

    // await Amenity.createMany(amenities);
  }
}
