const Pool = require('pg').Pool

const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'myFirstDb',
    password:'ksTepace21',
    port:5432
});

module.exports = pool;