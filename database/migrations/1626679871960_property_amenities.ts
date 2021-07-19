import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PropertyAmenities extends BaseSchema {
  protected tableName = 'property_amenities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.uuid('property_uid').notNullable();
      table.uuid('amenity_uid').notNullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
