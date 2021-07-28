import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import PropertyBed from './PropertyBed';
import PropertyType from './PropertyType';
import PropertyAmenity from './PropertyAmenity';

export default class PropertyListing extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column()
  public property_type: number;

  @column()
  public is_beach_house: boolean;

  @column()
  public is_dedicated_guest_space: boolean;

  @column()
  public is_business_hosting: boolean;

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

  // property description 
  @column()
  public description: string;

  @column()
  public desc_your_space: string;

  @column()
  public desc_interaction_guests: string;

  @column()
  public desc_neighbourhood: string;

  @column()
  public desc_getting_around: string;

  @column()
  public name: string;

  @column()
  public country_code: string;

  @column()
  public sec_phone_number: string;

  @column()
  public advance_notice: number;

  @column()
  public cut_off_time: string;

  @column()
  public guests_book_time: string;

  @column()
  public ci_arrive_after: string; // ci +> check in

  @column()
  public ci_arrive_before: string; 

  @column()
  public ci_leave_before: string;

  @column()
  public min_stay: number; //in nights

  @column()
  public max_stay: number // in nights

  @column()
  public base_price: number // in dolor ($)

  @column()
  public is_discount_20: boolean // 20 % discount

  @column()
  public is_local_laws: boolean // agree for country laws

  @column()
  public is_updated_calender: boolean;

  @column()
  public rented_before: number;

  @column()
  public have_guests: number;

  @column()
  public notice_guest_ba: number; // ba => before arrive

  @column()
  public guest_ci_from: string; // ci => check in

  @column()
  public guest_ci_to: string; // ci => check in

  @column()
  public weekly_discount: number; // discount in percentage

  @column()
  public monthly_discount: number;

  @column()
  public is_draft: boolean;

  @column()
  public is_completed: boolean;

  @column()
  public is_deleted: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;


  @hasMany(() => PropertyBed, {
    localKey: 'id',
    foreignKey: 'property_id'
  })
  public beds: HasMany<typeof PropertyBed>;

  @hasMany(() => PropertyAmenity, {
    localKey: 'id',
    foreignKey: 'property_id'
  })
  public amenities: HasMany<typeof PropertyAmenity>;

  @hasOne(() => PropertyType, {
    localKey: 'property_type',
    foreignKey: 'id',
  })
  public type: HasOne<typeof PropertyType>;

}

