import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PropertyAmenities extends BaseSchema {
  protected tableName = 'property_amenities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('property_id').unsigned().nullable();
      table.integer('amenity_id').unsigned().nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
