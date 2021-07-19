import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyListings extends BaseSchema {
  protected tableName = 'property_listings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.uuid('property_type').notNullable();
      table.boolean('is_beach_house').notNullable();
      table.boolean('is_dedicated_guest_space').notNullable();
      table.boolean('is_host_describes').notNullable();
      // address 
      table.string('country',255).notNullable();
      table.string('address_optional', 255).nullable();
      table.string('street', 255).nullable();
      table.string('city', 255).notNullable();
      table.string('state', 255).notNullable();
      table.string('zip_code', 255).notNullable();
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

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
