import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public email: string

  @column()
  public dob: Date

  @column()
  public avatar: string | null

  @column()
  public country_code: string | null

  @column()
  public phone_number: string | null

  @column()
  public username: string | null

  @column()
  public google_id: string | null

  @column()
  public facebook_id: string | null

  @column()
  public apple_id: string | null

  @column()
  public login_type: 'FACEBOOK' | 'GOOGLE' | 'APPLE' | 'EMAIL' | 'PHONE'

  @column({ serializeAs: null })
  public password: string

  @column()
  public device_type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
