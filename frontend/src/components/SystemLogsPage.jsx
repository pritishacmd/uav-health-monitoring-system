import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function SystemLogsPage() {
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const loadLogs = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.get(
                `${API}/api/system-logs`,
                {
                    withCredentials: true
                }
            );

            setLogs(response.data.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load system logs'
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteLog = async (id) => {
        if (!window.confirm('Are you sure you want to delete this system log?')) {
            return;
        }

        try {
            await axios.delete(
                `${API}/api/system-logs/${id}`,
                {
                    withCredentials: true
                }
            );

            setMessage('System log deleted successfully');

            loadLogs();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to delete system log'
            );
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <div>
                    <h1>System Logs</h1>
                    <p>System activity and audit records</p>
                </div>

                <button
                    onClick={loadLogs}
                    style={styles.loadButton}
                >
                    {loading ? 'Loading...' : 'Load System Logs'}
                </button>
            </div>

            {message && (
                <div style={styles.message}>
                    {message}
                </div>
            )}

            {logs.length === 0 ? (
                <div style={styles.empty}>
                    Click "Load System Logs" to view system activity.
                </div>
            ) : (
                <div style={styles.panel}>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Log ID</th>
                                    <th style={styles.th}>User ID</th>
                                    <th style={styles.th}>Action</th>
                                    <th style={styles.th}>Description</th>
                                    <th style={styles.th}>IP Address</th>
                                    <th style={styles.th}>Created At</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.log_id}>
                                        <td style={styles.td}>
                                            {log.log_id}
                                        </td>

                                        <td style={styles.td}>
                                            {log.user_id}
                                        </td>

                                        <td style={styles.td}>
                                            <strong>
                                                {log.action}
                                            </strong>
                                        </td>

                                        <td style={styles.td}>
                                            {log.description}
                                        </td>

                                        <td style={styles.td}>
                                            {log.ip_address || 'N/A'}
                                        </td>

                                        <td style={styles.td}>
                                            {log.created_at
                                                ? new Date(
                                                      log.created_at
                                                  ).toLocaleString()
                                                : 'N/A'}
                                        </td>

                                        <td style={styles.td}>
                                            <button
                                                onClick={() =>
                                                    deleteLog(log.log_id)
                                                }
                                                style={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

    loadButton: {
        padding: '10px 18px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#172033',
        color: 'white',
        fontWeight: 'bold'
    },

    message: {
        padding: '12px',
        marginBottom: '20px',
        backgroundColor: '#e8f0fe',
        borderRadius: '6px',
        color: '#172033'
    },

    empty: {
        backgroundColor: 'white',
        padding: '40px',
        textAlign: 'center',
        borderRadius: '8px',
        color: '#777',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },

    panel: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflowX: 'auto'
    },

    tableWrapper: {
        width: '100%',
        overflowX: 'auto'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '900px'
    },

    th: {
        textAlign: 'left',
        padding: '12px',
        borderBottom: '2px solid #e4e7ec',
        backgroundColor: '#f8f9fb'
    },

    td: {
        padding: '12px',
        borderBottom: '1px solid #e4e7ec',
        verticalAlign: 'top'
    },

    deleteButton: {
        padding: '7px 12px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#dc3545',
        color: 'white'
    }
};

export default SystemLogsPage;