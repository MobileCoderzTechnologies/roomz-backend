import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyTypes extends BaseSchema {
  protected tableName = 'property_types'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.string('property_type', 255).notNullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
