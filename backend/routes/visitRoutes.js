const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { id_pasien, id_dokter, status, resep, anamnesa, diagnosa, pemeriksaan } = req.body;
  db.query(
    'INSERT INTO kunjungan (id_pasien, id_dokter, status, resep, anamnesa, diagnosa, pemeriksaan) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id_pasien, id_dokter, status, resep, anamnesa, diagnosa, pemeriksaan],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Kunjungan ditambahkan', id: result.insertId });
    }
  );
});

module.exports = router;