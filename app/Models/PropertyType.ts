import { DateTime } from 'luxon'
import { BaseModel, column, afterFetch } from '@ioc:Adonis/Lucid/Orm';
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

export default class PropertyType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public property_type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @afterFetch()
  public static async translate(query){
    query = query.map(item => {
      item.property_type = t(item.property_type);
      return item;
    });
  }
}
