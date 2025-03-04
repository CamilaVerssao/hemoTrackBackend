/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("hospital", function (table) {
      table.increments("id").primary()
      table.string("name").notNullable()
      table.string("street").notNullable()
      table.string("cep", 10) .nullable()
      table.string("city").nullable()
      table.string("state").nullable()
  
      table.timestamps(true, true)
      table.datetime("deleted_at").defaultTo(null)
    });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("hospital")
  }
  