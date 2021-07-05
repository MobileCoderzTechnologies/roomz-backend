import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { v4 as uuid } from "uuid";
import BedType from "App/Models/BedType";

export default class BedTypeSeeder extends BaseSeeder {
  public async run () {
    await BedType.createMany([
      {
        'bed_type': 'double',
        'uid': uuid()
      },
      {
        'bed_type': 'queen',
        'uid': uuid()
      },
      {
        'bed_type': 'single',
        'uid': uuid()
      },
      {
        'bed_type': 'sofa bed',
        'uid': uuid()
      },
    ])
  }
}
