-- ============================================================
-- AI-Assisted UAV Flight Operations and Health Monitoring System
-- Seed Data
-- PostgreSQL 17+
-- ============================================================

-- ============================================================
-- 1. USERS
-- ============================================================

INSERT INTO users
(user_id, full_name, email, password_hash, role, phone, is_active)
VALUES
(1, 'System Administrator', 'admin@uavsystem.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ADMIN', '+91-9876543210', TRUE),

(2, 'Arjun Sharma', 'arjun.operator@uavsystem.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'OPERATOR', '+91-9876543211', TRUE),

(3, 'Priya Nair', 'priya.operator@uavsystem.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'OPERATOR', '+91-9876543212', TRUE),

(4, 'Rahul Kumar', 'rahul.maintenance@uavsystem.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'MAINTENANCE', '+91-9876543213', TRUE);

-- ============================================================
-- 2. UAVS
-- ============================================================

INSERT INTO uavs
(uav_id, uav_name, model, serial_number, manufacturer, status,
 battery_capacity, purchase_date, last_maintenance_date)
VALUES
(1, 'UAV-Alpha', 'Falcon X1', 'FX1-2026-001',
 'AeroTech Robotics', 'AVAILABLE',
 5200.00, '2025-02-15', '2026-07-10'),

(2, 'UAV-Bravo', 'Falcon X2', 'FX2-2026-002',
 'AeroTech Robotics', 'IN_MISSION',
 6000.00, '2025-05-20', '2026-07-25'),

(3, 'UAV-Charlie', 'SkyScout Pro', 'SSP-2026-003',
 'SkyWorks Systems', 'MAINTENANCE',
 4800.00, '2024-11-10', '2026-08-15'),

(4, 'UAV-Delta', 'Guardian G1', 'GG1-2026-004',
 'Guardian Aerospace', 'AVAILABLE',
 5500.00, '2026-01-12', '2026-08-01');

-- ============================================================
-- 3. MISSIONS
-- ============================================================

INSERT INTO missions
(mission_id, uav_id, created_by, mission_name, description,
 start_time, end_time,
 start_latitude, start_longitude,
 destination_latitude, destination_longitude,
 status)
VALUES
(1, 1, 2,
 'Perimeter Survey Alpha',
 'Routine perimeter surveillance and aerial mapping mission.',
 '2026-08-20 08:00:00',
 '2026-08-20 09:15:00',
 12.9716000, 80.0415000,
 12.9850000, 80.0550000,
 'COMPLETED'),

(2, 2, 2,
 'Infrastructure Inspection Bravo',
 'Inspection of critical infrastructure using onboard sensors.',
 '2026-08-26 16:00:00',
 NULL,
 12.9800000, 80.0500000,
 13.0100000, 80.0700000,
 'ACTIVE'),

(3, 3, 3,
 'Thermal Survey Charlie',
 'Thermal imaging survey for equipment anomaly detection.',
 '2026-08-24 10:00:00',
 '2026-08-24 11:10:00',
 12.9600000, 80.0300000,
 12.9750000, 80.0600000,
 'COMPLETED'),

(4, 4, 3,
 'Emergency Recon Delta',
 'Emergency reconnaissance mission for rapid area assessment.',
 NULL,
 NULL,
 12.9650000, 80.0350000,
 12.9950000, 80.0650000,
 'PLANNED');

-- ============================================================
-- 4. TELEMETRY
-- ============================================================

INSERT INTO telemetry
(telemetry_id, uav_id, mission_id, recorded_at,
 latitude, longitude, altitude, speed,
 battery_percentage, battery_voltage, battery_current,
 temperature, pressure, humidity, vibration,
 motor_1_rpm, motor_2_rpm, motor_3_rpm, motor_4_rpm,
 gps_signal, communication_signal, flight_mode)
VALUES

(1, 1, 1, '2026-08-20 08:15:00',
 12.9745000, 80.0455000, 120.00, 38.50,
 92.00, 16.40, 12.30,
 38.50, 1012.40, 62.00, 0.0180,
 4210.00, 4198.00, 4205.00, 4215.00,
 95, 92, 'AUTO'),

(2, 1, 1, '2026-08-20 08:45:00',
 12.9800000, 80.0500000, 145.00, 41.20,
 74.00, 16.10, 13.10,
 39.20, 1010.80, 64.00, 0.0210,
 4280.00, 4275.00, 4290.00, 4282.00,
 94, 90, 'AUTO'),

(3, 2, 2, '2026-08-26 16:15:00',
 12.9850000, 80.0550000, 100.00, 35.80,
 88.00, 16.30, 11.80,
 40.10, 1011.50, 60.00, 0.0250,
 4150.00, 4160.00, 4145.00, 4155.00,
 97, 96, 'AUTO'),

(4, 2, 2, '2026-08-26 16:30:00',
 12.9920000, 80.0610000, 135.00, 43.70,
 76.00, 16.00, 14.20,
 42.80, 1009.90, 66.00, 0.0390,
 4380.00, 4375.00, 4395.00, 4388.00,
 96, 91, 'AUTO'),

(5, 3, 3, '2026-08-24 10:20:00',
 12.9640000, 80.0380000, 110.00, 32.50,
 85.00, 16.20, 11.40,
 37.80, 1013.20, 58.00, 0.0220,
 4090.00, 4085.00, 4100.00, 4095.00,
 93, 94, 'AUTO'),

(6, 3, 3, '2026-08-24 10:50:00',
 12.9720000, 80.0520000, 125.00, 34.10,
 67.00, 15.80, 13.80,
 45.60, 1008.60, 71.00, 0.0670,
 4250.00, 4240.00, 4265.00, 4255.00,
 91, 85, 'AUTO'),

(7, 4, NULL, '2026-08-26 14:00:00',
 12.9700000, 80.0400000, 0.00, 0.00,
 98.00, 16.60, 0.00,
 31.50, 1014.20, 55.00, 0.0080,
 0.00, 0.00, 0.00, 0.00,
 99, 98, 'STANDBY'),

(8, 2, 2, '2026-08-26 16:45:00',
 12.9980000, 80.0650000, 142.00, 44.20,
 64.00, 15.70, 15.10,
 44.20, 1008.20, 69.00, 0.0520,
 4410.00, 4400.00, 4420.00, 4415.00,
 94, 83, 'AUTO');

-- ============================================================
-- 5. HEALTH RECORDS
-- ============================================================

INSERT INTO health_records
(health_record_id, uav_id, telemetry_id,
 overall_health_score,
 battery_health_score,
 motor_health_score,
 sensor_health_score,
 communication_health_score,
 health_status)
VALUES

(1, 1, 2,
 94.50, 93.00, 96.00, 95.00, 94.00,
 'HEALTHY'),

(2, 2, 4,
 82.50, 79.00, 84.00, 86.00, 81.00,
 'WARNING'),

(3, 3, 6,
 61.00, 64.00, 58.00, 67.00, 55.00,
 'CRITICAL'),

(4, 4, 7,
 98.00, 99.00, 98.00, 97.00, 98.00,
 'HEALTHY');

-- ============================================================
-- 6. AI PREDICTIONS
-- ============================================================

INSERT INTO ai_predictions
(prediction_id, uav_id, health_record_id,
 model_name, prediction, risk_score,
 confidence_score, recommended_action)
VALUES

(1, 1, 1,
 'UAV-Health-Risk-v1',
 'NORMAL_OPERATION',
 8.50,
 96.00,
 'Continue normal operation. Schedule routine inspection according to maintenance cycle.'),

(2, 2, 2,
 'UAV-Health-Risk-v1',
 'BATTERY_DEGRADATION',
 47.50,
 89.00,
 'Monitor battery voltage and current. Schedule battery inspection after mission completion.'),

(3, 3, 3,
 'UAV-Health-Risk-v1',
 'MOTOR_ANOMALY',
 82.00,
 94.00,
 'Ground UAV immediately and perform detailed motor and vibration inspection.'),

(4, 4, 4,
 'UAV-Health-Risk-v1',
 'NORMAL_OPERATION',
 4.00,
 98.00,
 'No immediate action required. UAV is ready for mission deployment.');

-- ============================================================
-- 7. ALERTS
-- ============================================================

INSERT INTO alerts
(alert_id, uav_id, prediction_id,
 alert_type, severity, message, status, resolved_at)
VALUES

(1, 1, 1,
 'HEALTH_STATUS',
 'LOW',
 'UAV health is within normal operating range.',
 'RESOLVED',
 '2026-08-20 09:20:00'),

(2, 2, 2,
 'BATTERY',
 'MEDIUM',
 'Battery degradation detected. Battery voltage is below the expected operating trend.',
 'ACKNOWLEDGED',
 NULL),

(3, 3, 3,
 'MOTOR',
 'CRITICAL',
 'Abnormal motor vibration detected. Immediate maintenance inspection is required.',
 'ACTIVE',
 NULL),

(4, 4, 4,
 'SYSTEM_STATUS',
 'LOW',
 'UAV is healthy and available for mission deployment.',
 'RESOLVED',
 '2026-08-26 14:10:00');

-- ============================================================
-- 8. MAINTENANCE
-- ============================================================

INSERT INTO maintenance
(maintenance_id, uav_id, maintenance_type,
 description, scheduled_date, completed_date,
 performed_by, status, notes)
VALUES

(1, 1,
 'Routine Inspection',
 'Standard airframe, battery and sensor inspection.',
 '2026-09-10',
 NULL,
 4,
 'SCHEDULED',
 'Routine inspection scheduled according to maintenance cycle.'),

(2, 2,
 'Battery Inspection',
 'Inspect battery health and charging performance.',
 '2026-08-27',
 NULL,
 4,
 'SCHEDULED',
 'Inspect battery after completion of current mission.'),

(3, 3,
 'Motor and Vibration Inspection',
 'Detailed inspection of motors, propellers and vibration levels.',
 '2026-08-26',
 NULL,
 4,
 'IN_PROGRESS',
 'Critical vibration alert triggered automated maintenance workflow.'),

(4, 4,
 'Preventive Maintenance',
 'General preventive maintenance and sensor verification.',
 '2026-08-01',
 '2026-08-01',
 4,
 'COMPLETED',
 'All preventive maintenance checks completed successfully.');

-- ============================================================
-- 9. FLIGHT HISTORY
-- ============================================================

INSERT INTO flight_history
(flight_id, uav_id, mission_id,
 start_time, end_time,
 duration_minutes, distance_km,
 maximum_altitude, maximum_speed,
 final_battery_percentage, flight_status)
VALUES

(1, 1, 1,
 '2026-08-20 08:00:00',
 '2026-08-20 09:15:00',
 75.00, 18.40,
 152.00, 48.50,
 68.00, 'COMPLETED'),

(2, 3, 3,
 '2026-08-24 10:00:00',
 '2026-08-24 11:10:00',
 70.00, 15.80,
 132.00, 39.20,
 61.00, 'COMPLETED'),

(3, 2, NULL,
 '2026-08-18 14:30:00',
 '2026-08-18 14:52:00',
 22.00, 5.60,
 98.00, 35.00,
 82.00, 'ABORTED'),

(4, 4, NULL,
 '2026-08-10 09:00:00',
 '2026-08-10 10:05:00',
 65.00, 14.20,
 140.00, 46.00,
 71.00, 'COMPLETED');

-- ============================================================
-- 10. SYSTEM LOGS
-- ============================================================

INSERT INTO system_logs
(log_id, user_id, action, description, ip_address)
VALUES

(1, 1,
 'USER_LOGIN',
 'Administrator logged into the UAV monitoring system.',
 '192.168.1.10'),

(2, 2,
 'MISSION_CREATED',
 'Created Infrastructure Inspection Bravo mission for UAV-Bravo.',
 '192.168.1.11'),

(3, 2,
 'MISSION_STARTED',
 'Started Infrastructure Inspection Bravo mission.',
 '192.168.1.11'),

(4, 3,
 'HEALTH_CHECK',
 'Reviewed UAV-Charlie health status after anomaly detection.',
 '192.168.1.12'),

(5, 4,
 'MAINTENANCE_STARTED',
 'Started motor and vibration inspection for UAV-Charlie.',
 '192.168.1.20'),

(6, 1,
 'SYSTEM_CONFIGURATION',
 'Updated UAV monitoring system configuration.',
 '192.168.1.10');

-- ============================================================
-- RESET SEQUENCES
-- ============================================================

SELECT setval('users_user_id_seq',
              (SELECT MAX(user_id) FROM users));

SELECT setval('uavs_uav_id_seq',
              (SELECT MAX(uav_id) FROM uavs));

SELECT setval('missions_mission_id_seq',
              (SELECT MAX(mission_id) FROM missions));

SELECT setval('telemetry_telemetry_id_seq',
              (SELECT MAX(telemetry_id) FROM telemetry));

SELECT setval('health_records_health_record_id_seq',
              (SELECT MAX(health_record_id) FROM health_records));

SELECT setval('ai_predictions_prediction_id_seq',
              (SELECT MAX(prediction_id) FROM ai_predictions));

SELECT setval('alerts_alert_id_seq',
              (SELECT MAX(alert_id) FROM alerts));

SELECT setval('maintenance_maintenance_id_seq',
              (SELECT MAX(maintenance_id) FROM maintenance));

SELECT setval('flight_history_flight_id_seq',
              (SELECT MAX(flight_id) FROM flight_history));

SELECT setval('system_logs_log_id_seq',
              (SELECT MAX(log_id) FROM system_logs));

-- ============================================================
-- SEED DATA COMPLETED
-- ============================================================