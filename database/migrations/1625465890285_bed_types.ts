import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BedTypes extends BaseSchema {
  protected tableName = 'bed_types'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.string('bed_type', 255).notNullable();
      table.text('icon').notNullable();
      table.timestamps(true, true);
    })
  } 

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
