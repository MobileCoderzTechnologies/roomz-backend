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
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'TV',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Hot Water',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Air Conditioning',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Shampoo',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Hair Dryer',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Dedicated Workspace',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Cooking basics',
        'description': 'Pots and pans, oil salt and pepper'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Bathroom essentials',
        'description': 'Towels, shop, shampoo and toilet paper'
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Bath Towel',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Toile Paper',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Body Soap',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Hand Soap',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Bed Linens',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Fireplace',
      },
      {
        'uid': uuid(),
        'type': 'normal',
        'name': 'Private Entrance',
      },
      {
        'uid': uuid(),
        'type': 'safety',
        'name': 'Smoke Alarm',
        'description': 'Check your local lows which may require a working smoke detector in every room'
      },
      {
        'uid': uuid(),
        'type': 'safety',
        'name': 'Carbon monoxide Alarm',
        'description': 'Check your local lows which may require a working carbon monoxide detector in every room'
      },
      {
        'uid': uuid(),
        'type': 'safety',
        'name': 'Lock on Bedroom door',
        'description': 'Private room can be locked for safety and privacy'
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Kitchen',
        'description': 'Space where guests can cook their own meal'
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Free Parking on premises',
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Washer',
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Hot Tub',
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Pool',
      },
      {
        'uid': uuid(),
        'type': 'space',
        'name': 'Paid Parking off premies',
      },
      
    ]);
  }
}
