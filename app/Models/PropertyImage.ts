import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PropertyImage extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public property_id: number;

  @column()
  public image_key: string;

  @column()
  public image_url: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
