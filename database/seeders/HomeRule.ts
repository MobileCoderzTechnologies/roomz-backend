import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { v4 as uuid } from "uuid";
import HomeRule from "App/Models/HomeRule";

export default class HomeRuleSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await HomeRule.createMany([
      {
        'uid': uuid(),
        'rule': 'Suitable for children (2-12)'
      },
      {
        'uid': uuid(),
        'rule': 'Suitable for infants (under 2)'
      },
      {
        'uid': uuid(),
        'rule': 'Suitable for pets',
      },
      {
        'uid': uuid(),
        'rule': 'Smoking allowed'
      },
      {
        'uid': uuid(),
        'rule': 'Events allowed'
      }
    ]);
  }
}
