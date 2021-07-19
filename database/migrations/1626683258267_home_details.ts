import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class HomeDetails extends BaseSchema {
  protected tableName = 'home_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.string('name', 255).notNullable();
      table.string('description', 255).nullable();
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
