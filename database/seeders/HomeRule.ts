import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { v4 as uuid } from "uuid";
import HomeRule from "App/Models/HomeRule";

export default class HomeRuleSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await HomeRule.createMany([
      {
        'uid': uuid(),
        'rule': 'Must Climb Stairs',
        'description': 'Describe the stairs(for example, how many flights)'
      },
      {
        'uid': uuid(),
        'rule': 'Potential for noise',
      },
      {
        'uid': uuid(),
        'rule': 'Pet(s) live on property',
      },
      {
        'uid': uuid(),
        'rule': 'No parking on property',
      },
      {
        'uid': uuid(),
        'rule': 'Some space are shared',
      },
      {
        'uid': uuid(),
        'rule': 'Amenity limitations',
      },
      {
        'uid': uuid(),
        'rule': 'Surveillance or recording devices on property',
      },
      {
        'uid': uuid(),
        'rule': 'Weapons on Property',
      },
      {
        'uid': uuid(),
        'rule': 'Dangerous animals on property',
      }
    ]);
  }
}
