import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';
import { afterFetch, BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm';
import i18n from 'App/Helpers/i18n';
const t = i18n.__;

export default class Amenity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column()
  public uid: string;

  @column()
  public type: 'space' | 'safety' | 'normal';

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public icon_url: string;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @afterFetch()
  public static async translate(query) {
    query = query.map(item => {
      item.name = t(item.name);
      if (item.description) item.description = t(item.description);
      return item;
    });
  }

  @beforeCreate()
  public static async iconUrls(amenity: Amenity) {
    amenity.icon_url = `${Env.get('ASSET_URL_S3')}amenities/${amenity.icon_url}`;
  }

}
