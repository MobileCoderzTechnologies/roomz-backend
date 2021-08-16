import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyImages extends BaseSchema {
  protected tableName = 'property_images'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('property_id').unsigned().nullable();
      table.text('image_key').notNullable();
      table.text('image_url').nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
