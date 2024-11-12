const {Pool} = require("pg");
const pool = new Pool({
    user: "postgres",
    password: "20022002",
    database: "products_database",
    host: "localhost",
    port: 5002
});

module.exports = pool;
