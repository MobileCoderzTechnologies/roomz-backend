import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyHouseRules extends BaseSchema {
  protected tableName = 'property_house_rules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
