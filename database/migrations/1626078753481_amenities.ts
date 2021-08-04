import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Amenities extends BaseSchema {
  protected tableName = 'amenities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.enu('type',['space', 'safety', 'normal']).nullable();
      table.string('name', 255).notNullable();
      table.string('description',255).nullable();
      table.string('icon_url', 255).nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
