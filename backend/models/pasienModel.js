const db = require('../db');

const createPasien = (data, callback) => {
  const sql = 'INSERT INTO pasien SET ?';
  db.query(sql, data, callback);
};

module.exports = { createPasien };