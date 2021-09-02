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
        'description': 'Describe if the property is susceptible to noise?'
      },
      {
        'uid': uuid(),
        'name': 'Pet(s) live on property',
        'description': 'Describe what kinds of pets live on the property?'
      },
      {
        'uid': uuid(),
        'name': 'No parking on property',
        'description': 'Explain where can a guest can park their vehicles( any places near by)'
      },
      {
        'uid': uuid(),
        'name': 'Some space are shared',
        'description': 'Explain if any part of the space is shared with someone else?'
      },
      {
        'uid': uuid(),
        'name': 'Amenity limitations',
        'description': 'Are there any limitations of the amenitites, please explain?'
      },
      {
        'uid': uuid(),
        'name': 'Surveillance or recording devices on property',
        'description': 'Explain if there are any of such devices on the property?'
      },
      {
        'uid': uuid(),
        'name': 'Weapons on Property',
        'description': 'Describe if any object that can be considered as a weapon is on the property?'
      },
      {
        'uid': uuid(),
        'name': 'Dangerous animals on property',
        'description': 'Describe if there any dangerous animals kept on the property(Eg. Lion)'
      }
    ]);
  }
}
