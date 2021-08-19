import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { v4 as uuid } from "uuid";
import BedType from "App/Models/BedType";

export default class BedTypeSeeder extends BaseSeeder {
  public async run () {
    await BedType.createMany([
      {
        'bed_type': 'double',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/double_bed.png'
      },
      {
        'bed_type': 'queen',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/queen_bed.png'
      },
      {
        'bed_type': 'single',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/single_bed.png'
      },
      {
        'bed_type': 'sofa bed',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/sofa_bed.png'
      },
      {
        'bed_type': 'king',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/king_bed.png'
      },
      {
        'bed_type': 'small double',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/small_double_bed.png'
      },
      {
        'bed_type': 'couch',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/sofa_bed.png'
      },
      {
        'bed_type': 'bunk bed',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/queen_bed.png'
      },
      {
        'bed_type': 'floor matters',
        'uid': uuid(),
        'icon': 'https://roomz-files.s3.me-south-1.amazonaws.com/beds/floor_mattress.png'
      },
    ])
  }
}
