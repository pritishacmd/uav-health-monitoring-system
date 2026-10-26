import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function HealthMonitoringPage() {
    const [healthRecords, setHealthRecords] = useState([]);
    const [message, setMessage] = useState('');

    const loadHealthRecords = async () => {
        try {
            setMessage('Loading health records...');

            const response = await axios.get(
                `${API}/api/health`,
                {
                    withCredentials: true
                }
            );

            setHealthRecords(response.data.data);
            setMessage('');
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load health records'
            );
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'HEALTHY') {
            return {
                backgroundColor: '#e8f5e9',
                color: '#2e7d32'
            };
        }

        if (status === 'WARNING') {
            return {
                backgroundColor: '#fff8e1',
                color: '#f57c00'
            };
        }

        if (status === 'CRITICAL') {
            return {
                backgroundColor: '#ffebee',
                color: '#c62828'
            };
        }

        return {
            backgroundColor: '#f4f6f8',
            color: '#555'
        };
    };

    const getScoreStyle = (score) => {
        if (score >= 80) {
            return {
                color: '#2e7d32'
            };
        }

        if (score >= 60) {
            return {
                color: '#f57c00'
            };
        }

        return {
            color: '#c62828'
        };
    };

    return (
        <div>
            <header style={styles.header}>
                <div>
                    <h1>Health Monitoring</h1>
                    <p>
                        UAV health condition and component health overview
                    </p>
                </div>
            </header>

            <section style={styles.panel}>
                <div style={styles.panelHeader}>
                    <div>
                        <h2>UAV Health Records</h2>
                        <p>
                            Overall and component-level health evaluation
                        </p>
                    </div>

                    <button
                        onClick={loadHealthRecords}
                        style={styles.loadButton}
                    >
                        Load Health Data
                    </button>
                </div>

                {message && (
                    <div style={styles.message}>
                        {message}
                    </div>
                )}

                {healthRecords.length === 0 && !message ? (
                    <div style={styles.empty}>
                        Click "Load Health Data" to view UAV health records.
                    </div>
                ) : (
                    <div style={styles.recordGrid}>
                        {healthRecords.map((record) => (
                            <div
                                key={record.health_record_id}
                                style={styles.healthCard}
                            >
                                <div style={styles.cardHeader}>
                                    <div>
                                        <h3>
                                            UAV {record.uav_id}
                                        </h3>

                                        <p>
                                            Health Record ID:{' '}
                                            {record.health_record_id}
                                        </p>

                                        {record.telemetry_id && (
                                            <p>
                                                Telemetry ID:{' '}
                                                {record.telemetry_id}
                                            </p>
                                        )}
                                    </div>

                                    <span
                                        style={{
                                            ...styles.status,
                                            ...getStatusStyle(
                                                record.health_status
                                            )
                                        }}
                                    >
                                        {record.health_status}
                                    </span>
                                </div>

                                <div style={styles.overall}>
                                    <span>Overall Health Score</span>

                                    <strong
                                        style={getScoreStyle(
                                            Number(
                                                record.overall_health_score
                                            )
                                        )}
                                    >
                                        {record.overall_health_score}
                                    </strong>
                                </div>

                                <div style={styles.componentGrid}>
                                    <div style={styles.component}>
                                        <span>Battery</span>
                                        <strong
                                            style={getScoreStyle(
                                                Number(
                                                    record.battery_health_score
                                                )
                                            )}
                                        >
                                            {record.battery_health_score}
                                        </strong>
                                    </div>

                                    <div style={styles.component}>
                                        <span>Motor</span>
                                        <strong
                                            style={getScoreStyle(
                                                Number(
                                                    record.motor_health_score
                                                )
                                            )}
                                        >
                                            {record.motor_health_score}
                                        </strong>
                                    </div>

                                    <div style={styles.component}>
                                        <span>Sensor</span>
                                        <strong
                                            style={getScoreStyle(
                                                Number(
                                                    record.sensor_health_score
                                                )
                                            )}
                                        >
                                            {record.sensor_health_score}
                                        </strong>
                                    </div>

                                    <div style={styles.component}>
                                        <span>Communication</span>
                                        <strong
                                            style={getScoreStyle(
                                                Number(
                                                    record.communication_health_score
                                                )
                                            )}
                                        >
                                            {record.communication_health_score}
                                        </strong>
                                    </div>
                                </div>

                                <div style={styles.evaluated}>
                                    Evaluated:{' '}
                                    {record.evaluated_at
                                        ? new Date(
                                            record.evaluated_at
                                        ).toLocaleString()
                                        : 'Not available'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
    },

    panel: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },

    panelHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },

    loadButton: {
        padding: '10px 15px',
        cursor: 'pointer'
    },

    message: {
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#f4f6f8',
        borderRadius: '6px'
    },

    empty: {
        padding: '40px',
        textAlign: 'center',
        color: '#777'
    },

    recordGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px'
    },

    healthCard: {
        padding: '20px',
        border: '1px solid #e4e7ec',
        borderRadius: '8px',
        backgroundColor: '#fff'
    },

    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
    },

    status: {
        padding: '6px 10px',
        borderRadius: '15px',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    overall: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    },

    componentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
    },

    component: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px',
        border: '1px solid #e4e7ec',
        borderRadius: '6px'
    },

    evaluated: {
        marginTop: '15px',
        fontSize: '13px',
        color: '#777'
    }
};

export default HealthMonitoringPage;