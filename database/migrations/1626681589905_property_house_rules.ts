import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyHouseRules extends BaseSchema {
  protected tableName = 'property_house_rules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.integer('home_rule_id').notNullable();
      table.string('property_uid', 255).notNullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
