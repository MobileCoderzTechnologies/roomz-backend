import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('avatar').nullable().after('dob');
      table.string('google_id').nullable().after('username');
      table.string('google_token').nullable().after('google_id');
      table.string('facebook_id').nullable().after('google_token');
      table.string('facebook_token').nullable().after('facebook_id');
      table.string('apple_id').nullable().after('facebook_token');
      table.string('apple_token').nullable().after('apple_id');
      table.string('login_type').defaultTo('EMAIL').comment('FACEBOOK | GOOGLE | APPLE | PHONE | EMAIL').after('apple_token');
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('avatar')
      table.dropColumn('google_id')
      table.dropColumn('google_token')
      table.dropColumn('facebook_id')
      table.dropColumn('facebook_token')
      table.dropColumn('apple_id')
      table.dropColumn('apple_token')
      table.dropColumn('login_type')
    })
  }
}
