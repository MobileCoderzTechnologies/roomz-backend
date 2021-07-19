import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { v4 as uuid } from "uuid";
import HomeDetail from "App/Models/HomeDetail";

export default class HomeDetailSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await HomeDetail.createMany([
      {
        'uid': uuid(),
        'name': 'Must Climb Stairs',
        'description': 'Describe the stairs(for example, how many flights)'
      },
      {
        'uid': uuid(),
        'name': 'Potential for noise',
      },
      {
        'uid': uuid(),
        'name': 'Pet(s) live on property',
      },
      {
        'uid': uuid(),
        'name': 'No parking on property',
      },
      {
        'uid': uuid(),
        'name': 'Some space are shared',
      },
      {
        'uid': uuid(),
        'name': 'Amenity limitations',
      },
      {
        'uid': uuid(),
        'name': 'Surveillance or recording devices on property',
      },
      {
        'uid': uuid(),
        'name': 'Weapons on Property',
      },
      {
        'uid': uuid(),
        'name': 'Dangerous animals on property',
      }
    ]);
  }
}
