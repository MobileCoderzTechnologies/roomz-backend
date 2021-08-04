import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyImages extends BaseSchema {
  protected tableName = 'property_images'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('property_id').unsigned().nullable();
      table.string('image_key', 255).notNullable();
      table.string('image_url', 255).nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
