import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { v4 as uuid } from "uuid";
import PropertyType from "App/Models/PropertyType";

export default class PropertyTypeSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await PropertyType.createMany([
      {
        'uid': uuid(),
        'property_type': 'Villa'
      },
      {
        'uid': uuid(),
        'property_type': 'Apartment',
      },
      {
        'uid': uuid(),
        'property_type': 'Farm House'
      },
      {
        'uid': uuid(),
        'property_type': 'Istiraha'
      },
      {
        'uid': uuid(),
        'property_type': 'Camp'
      },
      {
        'uid': uuid(),
        'property_type': 'Heritage House'
      }
    ])
  }
}
