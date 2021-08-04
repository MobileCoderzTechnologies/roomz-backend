import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import HomeRule from './HomeRule';

export default class PropertyRule extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column()
  public property_id: number;

  @column()
  public rule_id: number;

  @column()
  public is_cancelled: boolean;

  @column()
  public cancel_reason: string;

  @column()
  public is_additional: boolean;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;


  @hasOne(() => HomeRule, {
    localKey: 'rule_id',
    foreignKey: 'id'
  })
  public rule: HasOne<typeof HomeRule>;
}
