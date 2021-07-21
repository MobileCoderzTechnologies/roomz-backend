import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyDetails extends BaseSchema {
  protected tableName = 'property_details'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.uuid('property_uid').notNullable();
      table.integer('detail_id').notNullable();
      table.string('explanation', 255).nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
