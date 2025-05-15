/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('daily_goals', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE');
      table.string('title', 255).notNullable();
      table.string('description', 500).notNullable();
      table.boolean('completed').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('daily_goals');
  };
