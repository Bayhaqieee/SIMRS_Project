const { createPasien } = require('../models/pasienModel');

const addPasien = (req, res) => {
  const data = req.body;

  createPasien(data, (err, result) => {
    if (err) {
      console.error('Failed to add pasien:', err);
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: 'Pasien added', id: result.insertId });
  });
};

module.exports = { addPasien };