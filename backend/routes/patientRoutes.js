const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { no_rm, nama_pasien, no_telp } = req.body;
  const sql = 'INSERT INTO pasien (no_rm, nama_pasien, no_telp) VALUES (?, ?, ?)';
  db.query(sql, [no_rm, nama_pasien, no_telp], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Pasien ditambahkan', id: result.insertId });
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM pasien', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;