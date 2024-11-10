const {Pool} = require("pg");
const pool = new Pool({
    user: "postgres",
    password: "20022002",
    database: "products_database",
    host: "localhost",
    port: 5432
});

/*
const ordersPool = new Pool({
    user: "postgres",
    password: "20022002",
    database: "orders_database", // The new orders database
    host: "localhost",
    port: 5432,
});
*/

module.exports = pool;