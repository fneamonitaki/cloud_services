const {Pool} = require("pg");
const pool = new Pool({
    user: "postgres",
    password: "20022002",
    database: "orders_database",
    host: "localhost",
    port: 5432
});

module.exports = pool;