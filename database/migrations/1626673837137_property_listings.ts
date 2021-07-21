import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyListings extends BaseSchema {
  protected tableName = 'property_listings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.integer('property_type').unsigned().nullable();
      table.boolean('is_beach_house').nullable();
      table.boolean('is_dedicated_guest_space').notNullable().defaultTo(false);
      table.boolean('is_business_hosting').notNullable().defaultTo(false);

      table.integer('no_of_guests').notNullable().defaultTo(0);
      table.integer('no_of_bedrooms').notNullable().defaultTo(0);
      table.integer('no_of_bathrooms').notNullable().defaultTo(0);

      // address 
      table.string('country',255).nullable();
      table.string('address_optional', 255).nullable();
      table.string('street', 255).nullable();
      table.string('city', 255).nullable();
      table.string('state', 255).nullable();
      table.string('zip_code', 255).nullable();
      table.decimal('latitude', 10,6).nullable();
      table.decimal('longitude', 10,6).nullable();
      table.text('location').nullable();
      
      // Review Roomz's guest requirements 

      table.boolean('is_email_confirmed').notNullable().defaultTo(true);
      table.boolean('is_phone_confirmed').notNullable().defaultTo(true);
      table.boolean('is_payment_information').notNullable().defaultTo(true);
      table.boolean('is_agree_hr').notNullable().defaultTo(true);
      table.boolean('is_trip_purpose').notNullable().defaultTo(true);
      table.boolean('is_id_submitted').notNullable().defaultTo(false);
      table.boolean('is_no_negative_reviews').notNullable().defaultTo(false);

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
      table.string('advance_notice', 255).nullable();
      table.string('cut_off_time', 255).nullable();
      table.string('guests_book', 255).nullable();
      table.string('check_in_aa', 255).nullable();
      table.string('check_in_ab', 255).nullable();
      table.string('check_in_lb', 255).nullable();
      table.integer('min_stay').nullable();
      table.integer('max_stay').nullable();
      table.integer('base_price').nullable();
      table.boolean('is_discount_20').defaultTo(true);

      table.boolean('is_local_laws').notNullable().defaultTo(true);
      table.boolean('is_updated_calender').nullable();
      table.integer('rented_before').nullable();
      table.integer('have_guests').nullable();
      table.integer('notice_guest_ba').nullable();
      table.string('guest_ci_from', 255).nullable();
      table.string('guest_ci_to', 255).nullable();
      table.integer('weekly_discount').nullable();
      table.integer('monthly_discount').nullable();


      table.boolean('is_draft').defaultTo(true);
      table.boolean('is_completed').defaultTo(false);
      table.boolean('is_deleted').defaultTo(false);

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
