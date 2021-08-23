import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';
import { afterFetch, afterFind, BaseModel, beforeSave, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import PropertyBed from './PropertyBed';
import PropertyType from './PropertyType';
import PropertyAmenity from './PropertyAmenity';
import PropertyRule from './PropertyRule';
import PropertyImage from './PropertyImage';
import PropertyDetail from './PropertyDetail';
import { S3_DIRECTORIES } from 'App/Constants/s3DirectoryConstants';
import User from './User';

export default class PropertyListing extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column()
  public user_id: number;

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
  public no_of_beds: number;

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
  public is_recommended_from_oh: boolean; // reviews and recommended by other hosts

  @column()
  public cover_photo: string;
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
  public cut_off_time: number;

  @column()
  public guests_book_time: number;

  @column()
  public ci_arrive_after: number; // ci +> check in

  @column()
  public ci_arrive_before: number;

  @column()
  public ci_leave_before: number;

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
  public guest_ci_from: number; // ci => check in

  @column()
  public guest_ci_to: number; // ci => check in

  @column()
  public weekly_discount: number; // discount in percentage

  @column()
  public monthly_discount: number;

  @column()
  public status: number;


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @afterFind()
  public static async coverImage(property: PropertyListing) {
    if (property.cover_photo) {
      property.cover_photo = `${Env.get('ASSET_URL_S3')}${S3_DIRECTORIES.propertyFiles}${property.cover_photo}`;
    }
  }

  @beforeSave()
  public static async coverPhoto(property: PropertyListing) {
    if (property.cover_photo) {
      property.cover_photo = property.cover_photo.split(S3_DIRECTORIES.propertyFiles)[1];
    }
  }

  @afterFetch()
  public static async coverImages(properties: PropertyListing[]) {
    properties = properties.map(property => {
      if (property.cover_photo) {
        property.cover_photo = `${Env.get('ASSET_URL_S3')}${S3_DIRECTORIES.propertyFiles}${property.cover_photo}`;
      }
      return property;
    })
  }

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

  @hasOne(() => User, {
    localKey: 'user_id',
    foreignKey: 'id',
  })
  public user: HasOne<typeof User>;

  @hasMany(() => PropertyRule, {
    localKey: 'id',
    foreignKey: 'property_id'
  })
  public rules: HasMany<typeof PropertyRule>

  @hasMany(() => PropertyImage, {
    localKey: 'id',
    foreignKey: 'property_id'
  })
  public images: HasMany<typeof PropertyImage>

  @hasMany(() => PropertyDetail, {
    localKey: 'id',
    foreignKey: 'property_id'
  })
  public details: HasMany<typeof PropertyDetail>
}

