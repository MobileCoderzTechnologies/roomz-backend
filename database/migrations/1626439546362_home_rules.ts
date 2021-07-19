import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class HomeRules extends BaseSchema {
  protected tableName = 'home_rules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id'),
      table.uuid('uid'),
      table.string('rule', 255),
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
