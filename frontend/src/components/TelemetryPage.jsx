import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function TelemetryPage() {
    const [telemetry, setTelemetry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const loadTelemetry = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API}/api/telemetry`,
                {
                    withCredentials: true
                }
            );

            setTelemetry(response.data.data);
            setMessage('');
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load telemetry data'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTelemetry();
    }, []);

    return (
        <div>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Telemetry</h1>
                    <p style={styles.subtitle}>
                        UAV real-time and recorded flight telemetry
                    </p>
                </div>

                <button
                    onClick={loadTelemetry}
                    style={styles.refreshButton}
                >
                    Refresh
                </button>
            </div>

            {loading && (
                <div style={styles.message}>
                    Loading telemetry data...
                </div>
            )}

            {message && (
                <div style={styles.error}>
                    {message}
                </div>
            )}

            {!loading && !message && telemetry.length === 0 && (
                <div style={styles.empty}>
                    No telemetry records available.
                </div>
            )}

            {!loading && telemetry.length > 0 && (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>UAV</th>
                                <th style={styles.th}>Mission</th>
                                <th style={styles.th}>Recorded At</th>
                                <th style={styles.th}>Altitude</th>
                                <th style={styles.th}>Speed</th>
                                <th style={styles.th}>Battery</th>
                                <th style={styles.th}>Temperature</th>
                                <th style={styles.th}>GPS</th>
                                <th style={styles.th}>Communication</th>
                                <th style={styles.th}>Flight Mode</th>
                            </tr>
                        </thead>

                        <tbody>
                            {telemetry.map((item) => (
                                <tr key={item.telemetry_id}>
                                    <td style={styles.td}>
                                        {item.telemetry_id}
                                    </td>

                                    <td style={styles.td}>
                                        UAV {item.uav_id}
                                    </td>

                                    <td style={styles.td}>
                                        {item.mission_id || '-'}
                                    </td>

                                    <td style={styles.td}>
                                        {item.recorded_at
                                            ? new Date(
                                                item.recorded_at
                                            ).toLocaleString()
                                            : '-'}
                                    </td>

                                    <td style={styles.td}>
                                        {item.altitude ?? '-'}
                                    </td>

                                    <td style={styles.td}>
                                        {item.speed ?? '-'}
                                    </td>

                                    <td style={styles.td}>
                                        {item.battery_percentage != null
                                            ? `${item.battery_percentage}%`
                                            : '-'}
                                    </td>

                                    <td style={styles.td}>
                                        {item.temperature ?? '-'}
                                    </td>

                                    <td style={styles.td}>
                                        {item.gps_signal ?? '-'}
                                    </td>

                                    <td style={styles.td}>
                                        {item.communication_signal ?? '-'}
                                    </td>

                                    <td style={styles.td}>
                                        {item.flight_mode ?? '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
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

    title: {
        margin: 0,
        fontSize: '28px'
    },

    subtitle: {
        marginTop: '6px',
        color: '#667085'
    },

    refreshButton: {
        padding: '10px 18px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: '#172033',
        color: 'white'
    },

    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #e4e7ec',
        overflowX: 'auto'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1100px'
    },

    th: {
        textAlign: 'left',
        padding: '14px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e4e7ec',
        fontSize: '13px',
        whiteSpace: 'nowrap'
    },

    td: {
        padding: '14px',
        borderBottom: '1px solid #eef0f3',
        fontSize: '14px',
        whiteSpace: 'nowrap'
    },

    message: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #e4e7ec'
    },

    error: {
        backgroundColor: '#fff1f0',
        color: '#c62828',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px'
    },

    empty: {
        backgroundColor: 'white',
        padding: '40px',
        textAlign: 'center',
        borderRadius: '8px',
        border: '1px solid #e4e7ec',
        color: '#667085'
    }
};

export default TelemetryPage;