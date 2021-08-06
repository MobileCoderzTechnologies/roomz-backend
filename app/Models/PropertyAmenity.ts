import { DateTime } from 'luxon';
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Amenity from './Amenity';

export default class PropertyAmenity extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column()
  public property_id: number;

  @column()
  public amenity_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;


  @hasOne(() => Amenity, {
    localKey: 'amenity_id',
    foreignKey: 'id'
  })
  public amenity_name: HasOne<typeof Amenity>;


}
