const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

module.exports = {
  development: {
    username: "root",
    password: "bismillah",
    database: "turnstile",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST || "127.0.0.1",
    port: DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  },
};
