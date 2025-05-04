const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});