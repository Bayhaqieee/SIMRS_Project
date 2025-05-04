const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const pasienRoutes = require('./routes/pasienRoutes');
const visitRoutes = require('./routes/visitRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


const app = express();
app.use(cors());
app.use(express.json());

// Import routes
app.use('/api/pasien', pasienRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));