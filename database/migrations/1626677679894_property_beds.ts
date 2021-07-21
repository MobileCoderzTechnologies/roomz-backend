import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyBeds extends BaseSchema {
  protected tableName = 'property_beds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.integer('bed_id').unsigned().nullable();
      table.integer('property_id').unsigned().nullable();
      table.string('bedroom_name', 255).nullable();
      table.boolean('is_common_space').nullable().defaultTo(false);
      table.integer('count').notNullable().defaultTo(1);
      table.timestamps(true);
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
