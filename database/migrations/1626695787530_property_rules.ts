import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyRules extends BaseSchema {
  protected tableName = 'property_rules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.integer('property_id').unsigned().nullable();
      table.integer('rule_id').unsigned().nullable();
      table.boolean('is_cancelled').notNullable().defaultTo(false);
      table.string('cancel_reason').nullable();
      table.boolean('is_additional').notNullable().defaultTo(false);
      table.string('description').nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
