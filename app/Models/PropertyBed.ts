import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import BedType from './BedType';

export default class PropertyBed extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column()
  public bed_id: number;

  @column()
  public property_id: number;

  @column()
  public serial_number: number;

  @column()
  public count: number;

  @column()
  public bedroom_name: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasOne(() => BedType, {
    localKey: 'bed_id',
    foreignKey: 'id'
  })
  public bed_type: HasOne<typeof BedType>;
}
