-- ============================================================
-- AI-Assisted UAV Flight Operations and Health Monitoring System
-- Database Schema
-- PostgreSQL 17+
-- ============================================================

-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'OPERATOR',
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('ADMIN', 'OPERATOR', 'MAINTENANCE'))
);


-- ============================================================
-- 2. UAVS
-- ============================================================

CREATE TABLE IF NOT EXISTS uavs (
    uav_id SERIAL PRIMARY KEY,
    uav_name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    manufacturer VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    battery_capacity DECIMAL(10,2),
    purchase_date DATE,
    last_maintenance_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uavs_status_check
        CHECK (
            status IN (
                'AVAILABLE',
                'IN_MISSION',
                'MAINTENANCE',
                'OFFLINE',
                'RETIRED'
            )
        )
);


-- ============================================================
-- 3. MISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS missions (
    mission_id SERIAL PRIMARY KEY,
    uav_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    mission_name VARCHAR(150) NOT NULL,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    start_latitude DECIMAL(10,7),
    start_longitude DECIMAL(10,7),
    destination_latitude DECIMAL(10,7),
    destination_longitude DECIMAL(10,7),
    status VARCHAR(30) NOT NULL DEFAULT 'PLANNED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT missions_uav_fk
        FOREIGN KEY (uav_id)
        REFERENCES uavs(uav_id)
        ON DELETE RESTRICT,

    CONSTRAINT missions_user_fk
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT missions_status_check
        CHECK (
            status IN (
                'PLANNED',
                'ACTIVE',
                'COMPLETED',
                'CANCELLED',
                'FAILED'
            )
        )
);


-- ============================================================
-- 4. TELEMETRY
-- ============================================================

CREATE TABLE IF NOT EXISTS telemetry (
    telemetry_id BIGSERIAL PRIMARY KEY,
    uav_id INTEGER NOT NULL,
    mission_id INTEGER,

    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    altitude DECIMAL(10,2),
    speed DECIMAL(10,2),

    battery_percentage DECIMAL(5,2),
    battery_voltage DECIMAL(10,2),
    battery_current DECIMAL(10,2),

    temperature DECIMAL(10,2),
    pressure DECIMAL(10,2),
    humidity DECIMAL(5,2),

    vibration DECIMAL(10,4),

    motor_1_rpm DECIMAL(10,2),
    motor_2_rpm DECIMAL(10,2),
    motor_3_rpm DECIMAL(10,2),
    motor_4_rpm DECIMAL(10,2),

    gps_signal INTEGER,
    communication_signal INTEGER,

    flight_mode VARCHAR(50),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT telemetry_uav_fk
        FOREIGN KEY (uav_id)
        REFERENCES uavs(uav_id)
        ON DELETE CASCADE,

    CONSTRAINT telemetry_mission_fk
        FOREIGN KEY (mission_id)
        REFERENCES missions(mission_id)
        ON DELETE SET NULL
);


-- ============================================================
-- 5. HEALTH RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS health_records (
    health_record_id BIGSERIAL PRIMARY KEY,
    uav_id INTEGER NOT NULL,
    telemetry_id BIGINT,

    overall_health_score DECIMAL(5,2),
    battery_health_score DECIMAL(5,2),
    motor_health_score DECIMAL(5,2),
    sensor_health_score DECIMAL(5,2),
    communication_health_score DECIMAL(5,2),

    health_status VARCHAR(30) NOT NULL DEFAULT 'HEALTHY',

    evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT health_uav_fk
        FOREIGN KEY (uav_id)
        REFERENCES uavs(uav_id)
        ON DELETE CASCADE,

    CONSTRAINT health_telemetry_fk
        FOREIGN KEY (telemetry_id)
        REFERENCES telemetry(telemetry_id)
        ON DELETE SET NULL,

    CONSTRAINT health_status_check
        CHECK (
            health_status IN (
                'HEALTHY',
                'WARNING',
                'CRITICAL'
            )
        )
);


-- ============================================================
-- 6. AI PREDICTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_predictions (
    prediction_id BIGSERIAL PRIMARY KEY,
    uav_id INTEGER NOT NULL,
    health_record_id BIGINT,

    model_name VARCHAR(100) NOT NULL,
    prediction VARCHAR(100) NOT NULL,
    risk_score DECIMAL(5,2),

    confidence_score DECIMAL(5,2),

    recommended_action TEXT,

    predicted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT prediction_uav_fk
        FOREIGN KEY (uav_id)
        REFERENCES uavs(uav_id)
        ON DELETE CASCADE,

    CONSTRAINT prediction_health_fk
        FOREIGN KEY (health_record_id)
        REFERENCES health_records(health_record_id)
        ON DELETE SET NULL
);


-- ============================================================
-- 7. ALERTS
-- ============================================================

CREATE TABLE IF NOT EXISTS alerts (
    alert_id BIGSERIAL PRIMARY KEY,
    uav_id INTEGER NOT NULL,
    prediction_id BIGINT,

    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,

    CONSTRAINT alerts_uav_fk
        FOREIGN KEY (uav_id)
        REFERENCES uavs(uav_id)
        ON DELETE CASCADE,

    CONSTRAINT alerts_prediction_fk
        FOREIGN KEY (prediction_id)
        REFERENCES ai_predictions(prediction_id)
        ON DELETE SET NULL,

    CONSTRAINT alerts_severity_check
        CHECK (
            severity IN (
                'LOW',
                'MEDIUM',
                'HIGH',
                'CRITICAL'
            )
        ),

    CONSTRAINT alerts_status_check
        CHECK (
            status IN (
                'ACTIVE',
                'ACKNOWLEDGED',
                'RESOLVED'
            )
        )
);


-- ============================================================
-- 8. MAINTENANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS maintenance (
    maintenance_id SERIAL PRIMARY KEY,
    uav_id INTEGER NOT NULL,

    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT,

    scheduled_date DATE,
    completed_date DATE,

    performed_by INTEGER,

    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT maintenance_uav_fk
        FOREIGN KEY (uav_id)
        REFERENCES uavs(uav_id)
        ON DELETE CASCADE,

    CONSTRAINT maintenance_user_fk
        FOREIGN KEY (performed_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT maintenance_status_check
        CHECK (
            status IN (
                'SCHEDULED',
                'IN_PROGRESS',
                'COMPLETED',
                'CANCELLED'
            )
        )
);


-- ============================================================
-- 9. FLIGHT HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS flight_history (
    flight_id BIGSERIAL PRIMARY KEY,
    uav_id INTEGER NOT NULL,
    mission_id INTEGER,

    start_time TIMESTAMP,
    end_time TIMESTAMP,

    duration_minutes DECIMAL(10,2),
    distance_km DECIMAL(10,2),

    maximum_altitude DECIMAL(10,2),
    maximum_speed DECIMAL(10,2),

    final_battery_percentage DECIMAL(5,2),

    flight_status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT flight_uav_fk
        FOREIGN KEY (uav_id)
        REFERENCES uavs(uav_id)
        ON DELETE CASCADE,

    CONSTRAINT flight_mission_fk
        FOREIGN KEY (mission_id)
        REFERENCES missions(mission_id)
        ON DELETE SET NULL,

    CONSTRAINT flight_status_check
        CHECK (
            flight_status IN (
                'COMPLETED',
                'ABORTED',
                'FAILED'
            )
        )
);


-- ============================================================
-- 10. SYSTEM LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS system_logs (
    log_id BIGSERIAL PRIMARY KEY,

    user_id INTEGER,

    action VARCHAR(100) NOT NULL,
    description TEXT,

    ip_address VARCHAR(45),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT logs_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_uavs_status
    ON uavs(status);

CREATE INDEX IF NOT EXISTS idx_missions_uav
    ON missions(uav_id);

CREATE INDEX IF NOT EXISTS idx_missions_status
    ON missions(status);

CREATE INDEX IF NOT EXISTS idx_telemetry_uav
    ON telemetry(uav_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_mission
    ON telemetry(mission_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_recorded_at
    ON telemetry(recorded_at);

CREATE INDEX IF NOT EXISTS idx_health_uav
    ON health_records(uav_id);

CREATE INDEX IF NOT EXISTS idx_predictions_uav
    ON ai_predictions(uav_id);

CREATE INDEX IF NOT EXISTS idx_alerts_uav
    ON alerts(uav_id);

CREATE INDEX IF NOT EXISTS idx_alerts_status
    ON alerts(status);

CREATE INDEX IF NOT EXISTS idx_maintenance_uav
    ON maintenance(uav_id);

CREATE INDEX IF NOT EXISTS idx_flight_history_uav
    ON flight_history(uav_id);

CREATE INDEX IF NOT EXISTS idx_system_logs_user
    ON system_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_system_logs_created_at
    ON system_logs(created_at);