const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const templateRoutes = require('./routes/templateRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
require('dotenv').config();

const { initScheduler } = require('./scheduler/cronJob');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/reports', reportRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

initScheduler();  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});