import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Amenity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // @column.dateTime({ autoCreate: true })
  // public createdAt: DateTime;

  @column()
  public uid: string;

  @column()
  public type: 'space'|'safety'|'normal';

  @column()
  public name: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
