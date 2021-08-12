import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PROPERTY_STATUS } from 'App/Constants/PropertyConstant';

export default class PropertyListings extends BaseSchema {
  protected tableName = 'property_listings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.integer('user_id').unsigned().nullable();
      table.integer('property_type').unsigned().nullable();
      table.boolean('is_beach_house').nullable();
      table.boolean('is_dedicated_guest_space').notNullable().defaultTo(false);
      table.boolean('is_business_hosting').notNullable().defaultTo(false);

      table.integer('no_of_guests').notNullable().defaultTo(0);
      table.integer('no_of_bedrooms').notNullable().defaultTo(0);
      table.integer('no_of_beds').notNullable().defaultTo(0);
      table.decimal('no_of_bathrooms', 10,1).notNullable().defaultTo(0);

      // address 
      table.string('country', 255).nullable();
      table.string('address_optional', 255).nullable();
      table.string('street', 255).nullable();
      table.string('city', 255).nullable();
      table.string('state', 255).nullable();
      table.string('zip_code', 255).nullable();
      
      table.decimal('latitude', 10, 6).nullable();
      table.decimal('longitude', 10, 6).nullable();
      table.text('location').nullable();

      // Review Roomz's guest requirements 

      table.boolean('is_email_confirmed').nullable();
      table.boolean('is_phone_confirmed').nullable();
      table.boolean('is_payment_information').nullable();
      table.boolean('is_agree_hr').nullable();
      table.boolean('is_trip_purpose').nullable();
      table.boolean('is_id_submitted').nullable();
      table.boolean('is_recommended_from_oh').nullable();

      // cover photo
      table.string('cover_photo').nullable();

      //description
      table.text('description').nullable();
      table.text('desc_your_space').nullable();
      table.text('desc_interaction_guests').nullable();
      table.text('desc_neighbourhood').nullable();
      table.text('desc_getting_around').nullable();

      //name
      table.string('name', 255).nullable();

      // alternate phone number

      table.string('country_code', 255).nullable();
      table.string('sec_phone_number', 255).nullable();
      //Availability
      table.integer('advance_notice', 255).nullable();
      table.decimal('cut_off_time', 10,2).nullable();
      table.decimal('guests_book_time', 10,2).nullable();
      table.decimal('ci_arrive_after', 10,2).nullable();
      table.decimal('ci_arrive_before', 10,2).nullable();
      table.decimal('ci_leave_before', 10,2).nullable();
      table.integer('min_stay').nullable();
      table.integer('max_stay').nullable();


      table.integer('base_price').nullable();
      table.boolean('is_discount_20').defaultTo(true);

      table.boolean('is_local_laws').notNullable().defaultTo(true);
      table.boolean('is_updated_calender').nullable();

      table.integer('rented_before').nullable();
      table.integer('have_guests').nullable();
      table.integer('notice_guest_ba').nullable();
      table.decimal('guest_ci_from', 10, 2).nullable();
      table.decimal('guest_ci_to', 10, 2).nullable();

      table.integer('weekly_discount').nullable();
      table.integer('monthly_discount').nullable();


      table.integer('status').notNullable().defaultTo(PROPERTY_STATUS.draft)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
