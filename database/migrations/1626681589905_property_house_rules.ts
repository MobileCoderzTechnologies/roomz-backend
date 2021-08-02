import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyHouseRules extends BaseSchema {
  protected tableName = 'property_house_rules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid');
      table.integer('home_rule_id').unsigned().nullable();
      table.integer('property_id').unsigned().nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
