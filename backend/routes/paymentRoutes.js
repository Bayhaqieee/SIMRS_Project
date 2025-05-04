const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { id_kunjungan, administrasi, jasa_dokter, tindakan, obat } = req.body;
  const total = administrasi + jasa_dokter + tindakan + obat;
  db.query(
    'INSERT INTO bayar (id_kunjungan, administrasi, jasa_dokter, tindakan, obat, total) VALUES (?, ?, ?, ?, ?, ?)',
    [id_kunjungan, administrasi, jasa_dokter, tindakan, obat, total],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Pembayaran berhasil ditambahkan', total });
    }
  );
});

module.exports = router;