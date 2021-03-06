import { DateTime } from 'luxon'
import { afterFetch, BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

export default class HomeDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @afterFetch()
  public static async translate(query){
    query = query.map(item => {
      item.name = t(item.name);
      if(item.description) item.description = t(item.description);
      return item;
    });
  };

}
