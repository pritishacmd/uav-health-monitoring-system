import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function HealthPage() {
    const [healthRecords, setHealthRecords] = useState([]);
    const [message, setMessage] = useState('');

    const loadHealthData = async () => {
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

    return (
        <div>
            <header style={styles.header}>
                <div>
                    <h1>Health Monitoring</h1>
                    <p>UAV health status and health assessment records</p>
                </div>

                <button
                    onClick={loadHealthData}
                    style={styles.loadButton}
                >
                    Load Health Data
                </button>
            </header>

            {message && (
                <div style={styles.message}>
                    {message}
                </div>
            )}

            <section style={styles.panel}>
                <div style={styles.panelHeader}>
                    <div>
                        <h2>UAV Health Records</h2>
                        <p>
                            Overall and component-level health information
                        </p>
                    </div>
                </div>

                {healthRecords.length === 0 ? (
                    <div style={styles.empty}>
                        Click "Load Health Data" to view UAV health records.
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Health ID</th>
                                    <th style={styles.th}>UAV ID</th>
                                    <th style={styles.th}>Telemetry ID</th>
                                    <th style={styles.th}>Overall Score</th>
                                    <th style={styles.th}>Battery</th>
                                    <th style={styles.th}>Motor</th>
                                    <th style={styles.th}>Sensor</th>
                                    <th style={styles.th}>Communication</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Evaluated At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {healthRecords.map((record) => (
                                    <tr key={record.health_record_id}>
                                        <td style={styles.td}>
                                            {record.health_record_id}
                                        </td>

                                        <td style={styles.td}>
                                            {record.uav_id}
                                        </td>

                                        <td style={styles.td}>
                                            {record.telemetry_id || '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {record.overall_health_score}
                                        </td>

                                        <td style={styles.td}>
                                            {record.battery_health_score}
                                        </td>

                                        <td style={styles.td}>
                                            {record.motor_health_score}
                                        </td>

                                        <td style={styles.td}>
                                            {record.sensor_health_score}
                                        </td>

                                        <td style={styles.td}>
                                            {record.communication_health_score}
                                        </td>

                                        <td style={styles.td}>
                                            <strong>
                                                {record.health_status}
                                            </strong>
                                        </td>

                                        <td style={styles.td}>
                                            {record.evaluated_at
                                                ? new Date(
                                                      record.evaluated_at
                                                  ).toLocaleString()
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

    loadButton: {
        padding: '10px 15px',
        cursor: 'pointer'
    },

    message: {
        backgroundColor: 'white',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        color: '#555'
    },

    panel: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },

    panelHeader: {
        marginBottom: '20px'
    },

    empty: {
        padding: '30px',
        textAlign: 'center',
        color: '#777'
    },

    tableContainer: {
        overflowX: 'auto'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
    },

    th: {
        textAlign: 'left',
        padding: '12px',
        borderBottom: '2px solid #e4e7ec',
        backgroundColor: '#f8f9fb',
        whiteSpace: 'nowrap'
    },

    td: {
        padding: '12px',
        borderBottom: '1px solid #e4e7ec',
        whiteSpace: 'nowrap'
    }
};

export default HealthPage;