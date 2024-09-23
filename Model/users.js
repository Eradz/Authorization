const { pgTable, serial, text } = require('drizzle-orm/pg-core')
const users = pgTable('Users', {
  email: text('email').notNull(),
  password: text("password"),
});

module.exports = users