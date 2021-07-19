import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PropertyListing extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column()
  public property_type: string;

  @column()
  public is_beach_house: boolean;

  @column()
  public is_dedicated_guest_space: boolean;

  @column()
  public is_host_describes: boolean;

  @column()
  public no_of_guests: number;

  @column()
  public no_of_bedrooms: number;

  @column()
  public no_of_bathrooms: number;

  @column()
  public country: string;

  @column()
  public address_optional: string;

  @column()
  public street: string;

  @column()
  public city: string;

  @column()
  public state: string;

  @column()
  public zip_code: string;


  @column()
  public latitude: number;

  @column()
  public longitude: number;

  @column()
  public location: string;

  @column()
  public is_email_confirmed: boolean;

  @column()
  public is_phone_confirmed: boolean;

  @column()
  public is_payment_information: boolean;

  @column()
  public is_agree_hr: boolean; //hr => home rules

  @column()
  public is_trip_purpose: boolean;

  @column()
  public is_id_submitted: boolean; // id issued by government

  @column()
  public is_no_negative_reviews: boolean; // reviews and recommended by other hosts

  @column()
  public 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
