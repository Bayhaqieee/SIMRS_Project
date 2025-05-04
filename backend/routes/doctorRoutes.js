const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT id_dokter, nama_dokter FROM dokter', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.post('/login', (req, res) => {
  const { nama_dokter, pass } = req.body;
  db.query(
    'SELECT * FROM dokter WHERE nama_dokter = ? AND pass = ?',
    [nama_dokter, pass],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(401).json({ message: 'Login gagal' });
      res.json({ message: 'Login berhasil', dokter: results[0] });
    }
  );
});

module.exports = router;