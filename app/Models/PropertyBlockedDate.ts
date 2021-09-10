import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PropertyBlockedDate extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public property_id: number;

  @column()
  public blocked_date: Date;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
