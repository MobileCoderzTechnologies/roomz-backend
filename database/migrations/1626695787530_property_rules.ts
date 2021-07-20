import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyRules extends BaseSchema {
  protected tableName = 'property_rules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.uuid('property_uid').notNullable();
      table.uuid('rule_uid').nullable();
      table.boolean('is_cancelled').nullable();
      table.string('cancel_reason').nullable();
      table.boolean('is_additional').nullable();
      table.string('description').nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
