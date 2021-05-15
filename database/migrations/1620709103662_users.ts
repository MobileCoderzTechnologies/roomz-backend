import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uid')
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('dob').nullable()
      table.string('email').unique().notNullable()
      table.string('country_code')
      table.string('phone_number')
      table.string('username').nullable()
      table.string('password').notNullable()
      table.string('device_type').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
