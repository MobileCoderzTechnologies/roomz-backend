import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.boolean('is_active').after('device_type').defaultTo(true);
      table.boolean('is_verified').after('is_active').defaultTo(false);
      table.boolean('is_id_verified').after('is_verified').defaultTo(false);
      table.boolean('is_deleted').after('is_id_verified').defaultTo(false);
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('is_active')
      table.dropColumn('is_verified')
      table.dropColumn('is_id_verified')
      table.dropColumn('is_deleted')
    });
  }
}
