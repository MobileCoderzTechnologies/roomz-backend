import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PropertyBlockedDates extends BaseSchema {
  protected tableName = 'property_blocked_dates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('property_id').nullable().unsigned();
      table.date('blocked_date').nullable();
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
