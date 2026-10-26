require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const healthRoutes = require('./routes/health');
const uavRoutes = require('./routes/uav');
const missionRoutes = require('./routes/missions');
const telemetryRoutes = require('./routes/telemetry');
const alertRoutes = require('./routes/alerts');
const maintenanceRoutes = require('./routes/maintenance');
const flightHistoryRoutes = require('./routes/flightHistory');
const aiPredictionRoutes = require('./routes/aiPredictions');
const systemLogRoutes = require('./routes/systemLogs');
const authRoutes = require('./routes/auth');

app.use('/api/health', healthRoutes);
app.use('/api/uavs', uavRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/flight-history', flightHistoryRoutes);
app.use('/api/ai-predictions', aiPredictionRoutes);
app.use('/api/system-logs', systemLogRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('UAV Health Monitoring System — Backend API');
});

app.use((req, res) => {
    res.status(404).json({
        status: 'ERROR',
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        status: 'ERROR',
        message: 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

module.exports = app;