import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function FlightHistoryPage() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        uav_id: '',
        mission_id: '',
        start_time: '',
        end_time: '',
        duration_minutes: '',
        distance_km: '',
        maximum_altitude: '',
        maximum_speed: '',
        final_battery_percentage: '',
        flight_status: ''
    });

    const loadFlights = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.get(
                `${API}/api/flight-history`,
                {
                    withCredentials: true
                }
            );

            setFlights(response.data.data || []);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load flight history'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFlights();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post(
                `${API}/api/flight-history`,
                {
                    uav_id: formData.uav_id,
                    mission_id: formData.mission_id || null,
                    start_time: formData.start_time || null,
                    end_time: formData.end_time || null,
                    duration_minutes: formData.duration_minutes || null,
                    distance_km: formData.distance_km || null,
                    maximum_altitude: formData.maximum_altitude || null,
                    maximum_speed: formData.maximum_speed || null,
                    final_battery_percentage:
                        formData.final_battery_percentage || null,
                    flight_status: formData.flight_status || null
                },
                {
                    withCredentials: true
                }
            );

            setMessage('Flight history record created successfully.');

            setFormData({
                uav_id: '',
                mission_id: '',
                start_time: '',
                end_time: '',
                duration_minutes: '',
                distance_km: '',
                maximum_altitude: '',
                maximum_speed: '',
                final_battery_percentage: '',
                flight_status: ''
            });

            setShowForm(false);
            loadFlights();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to create flight history record'
            );
        }
    };

    const deleteFlight = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this flight history record?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `${API}/api/flight-history/${id}`,
                {
                    withCredentials: true
                }
            );

            setMessage('Flight history record deleted successfully.');
            loadFlights();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to delete flight history record'
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleString();
    };

    const getStatusStyle = (status) => {
        if (status === 'COMPLETED') {
            return {
                backgroundColor: '#d1fae5',
                color: '#065f46'
            };
        }

        if (status === 'FAILED') {
            return {
                backgroundColor: '#fee2e2',
                color: '#991b1b'
            };
        }

        return {
            backgroundColor: '#fef3c7',
            color: '#92400e'
        };
    };

    return (
        <div>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Flight History</h1>
                    <p style={styles.subtitle}>
                        Historical UAV flight records and performance data
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    style={styles.addButton}
                >
                    {showForm ? 'Close Form' : 'Add Flight Record'}
                </button>
            </header>

            {message && (
                <div style={styles.message}>
                    {message}
                </div>
            )}

            {showForm && (
                <section style={styles.formPanel}>
                    <h2 style={styles.panelTitle}>
                        Add Flight History Record
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGrid}>
                            <div>
                                <label style={styles.label}>
                                    UAV ID
                                </label>

                                <input
                                    type="number"
                                    name="uav_id"
                                    value={formData.uav_id}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Mission ID
                                </label>

                                <input
                                    type="number"
                                    name="mission_id"
                                    value={formData.mission_id}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Start Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    End Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Duration (minutes)
                                </label>

                                <input
                                    type="number"
                                    name="duration_minutes"
                                    value={formData.duration_minutes}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Distance (km)
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="distance_km"
                                    value={formData.distance_km}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Maximum Altitude
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="maximum_altitude"
                                    value={formData.maximum_altitude}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Maximum Speed
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="maximum_speed"
                                    value={formData.maximum_speed}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Final Battery (%)
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="final_battery_percentage"
                                    value={formData.final_battery_percentage}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Flight Status
                                </label>

                                <select
                                    name="flight_status"
                                    value={formData.flight_status}
                                    onChange={handleChange}
                                    style={styles.input}
                                >
                                    <option value="">
                                        Select status
                                    </option>

                                    <option value="COMPLETED">
                                        COMPLETED
                                    </option>

                                    <option value="ABORTED">
                                        ABORTED
                                    </option>

                                    <option value="FAILED">
                                        FAILED
                                    </option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={styles.saveButton}
                        >
                            Save Flight Record
                        </button>
                    </form>
                </section>
            )}

            <section style={styles.panel}>
                <div style={styles.panelHeader}>
                    <div>
                        <h2 style={styles.panelTitle}>
                            Flight Records
                        </h2>

                        <p style={styles.panelSubtitle}>
                            {flights.length} flight record(s) found
                        </p>
                    </div>

                    <button
                        onClick={loadFlights}
                        style={styles.refreshButton}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {loading && flights.length === 0 ? (
                    <div style={styles.empty}>
                        Loading flight history...
                    </div>
                ) : flights.length === 0 ? (
                    <div style={styles.empty}>
                        No flight history records found.
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Flight ID</th>
                                    <th style={styles.th}>UAV ID</th>
                                    <th style={styles.th}>Mission ID</th>
                                    <th style={styles.th}>Start Time</th>
                                    <th style={styles.th}>End Time</th>
                                    <th style={styles.th}>Duration</th>
                                    <th style={styles.th}>Distance</th>
                                    <th style={styles.th}>Max Altitude</th>
                                    <th style={styles.th}>Max Speed</th>
                                    <th style={styles.th}>Battery</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {flights.map((flight) => (
                                    <tr key={flight.flight_id}>
                                        <td style={styles.td}>
                                            {flight.flight_id}
                                        </td>

                                        <td style={styles.td}>
                                            UAV-{flight.uav_id}
                                        </td>

                                        <td style={styles.td}>
                                            {flight.mission_id || '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {formatDate(flight.start_time)}
                                        </td>

                                        <td style={styles.td}>
                                            {formatDate(flight.end_time)}
                                        </td>

                                        <td style={styles.td}>
                                            {flight.duration_minutes != null
                                                ? `${flight.duration_minutes} min`
                                                : '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {flight.distance_km != null
                                                ? `${flight.distance_km} km`
                                                : '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {flight.maximum_altitude != null
                                                ? flight.maximum_altitude
                                                : '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {flight.maximum_speed != null
                                                ? flight.maximum_speed
                                                : '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {flight.final_battery_percentage != null
                                                ? `${flight.final_battery_percentage}%`
                                                : '-'}
                                        </td>

                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.status,
                                                    ...getStatusStyle(
                                                        flight.flight_status
                                                    )
                                                }}
                                            >
                                                {flight.flight_status || '-'}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            <button
                                                onClick={() =>
                                                    deleteFlight(
                                                        flight.flight_id
                                                    )
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

    title: {
        margin: 0,
        marginBottom: '6px'
    },

    subtitle: {
        margin: 0,
        color: '#666'
    },

    addButton: {
        padding: '11px 18px',
        backgroundColor: '#172033',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    message: {
        padding: '12px 15px',
        marginBottom: '20px',
        backgroundColor: '#e8f1ff',
        color: '#1d4ed8',
        borderRadius: '6px'
    },

    formPanel: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '25px'
    },

    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '18px',
        marginTop: '20px'
    },

    label: {
        display: 'block',
        marginBottom: '7px',
        fontWeight: 'bold',
        fontSize: '14px'
    },

    input: {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        border: '1px solid #d1d5db',
        borderRadius: '5px'
    },

    saveButton: {
        marginTop: '20px',
        padding: '11px 18px',
        backgroundColor: '#172033',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
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

    panelTitle: {
        margin: 0,
        marginBottom: '5px'
    },

    panelSubtitle: {
        margin: 0,
        color: '#777'
    },

    refreshButton: {
        padding: '9px 15px',
        cursor: 'pointer',
        border: '1px solid #d1d5db',
        backgroundColor: 'white',
        borderRadius: '6px'
    },

    tableContainer: {
        width: '100%',
        overflowX: 'auto'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1200px',
        fontSize: '13px'
    },

    th: {
        textAlign: 'left',
        padding: '12px',
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #e5e7eb',
        whiteSpace: 'nowrap'
    },

    td: {
        padding: '12px',
        borderBottom: '1px solid #e5e7eb',
        whiteSpace: 'nowrap'
    },

    status: {
        display: 'inline-block',
        padding: '5px 9px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '11px'
    },

    deleteButton: {
        padding: '6px 10px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },

    empty: {
        padding: '40px',
        textAlign: 'center',
        color: '#777'
    }
};

export default FlightHistoryPage;   