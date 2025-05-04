const express = require('express');
const router = express.Router();
const { addPasien } = require('../controllers/pasienController');

router.post('/', addPasien);

module.exports = router;