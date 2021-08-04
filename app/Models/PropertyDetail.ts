import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import HomeDetail from './HomeDetail';

export default class PropertyDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column()
  public property_id: number;

  @column()
  public detail_id: number;

  @column()
  public explanation: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasOne(() => HomeDetail, {
    localKey: 'detail_id',
    foreignKey: 'id'
  })
  public detail: HasOne<typeof HomeDetail>;
}
