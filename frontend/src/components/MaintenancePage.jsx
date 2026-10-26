import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function MaintenancePage() {
    const [maintenance, setMaintenance] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        uav_id: '',
        maintenance_type: '',
        description: '',
        scheduled_date: '',
        completed_date: '',
        performed_by: '',
        status: 'SCHEDULED',
        notes: ''
    });

    const [editingId, setEditingId] = useState(null);

    const loadMaintenance = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.get(
                `${API}/api/maintenance`,
                {
                    withCredentials: true
                }
            );

            setMaintenance(response.data.data || []);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load maintenance records'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMaintenance();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            uav_id: '',
            maintenance_type: '',
            description: '',
            scheduled_date: '',
            completed_date: '',
            performed_by: '',
            status: 'SCHEDULED',
            notes: ''
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            if (editingId) {
                await axios.put(
                    `${API}/api/maintenance/${editingId}`,
                    form,
                    {
                        withCredentials: true
                    }
                );

                setMessage('Maintenance record updated successfully');
            } else {
                await axios.post(
                    `${API}/api/maintenance`,
                    form,
                    {
                        withCredentials: true
                    }
                );

                setMessage('Maintenance record created successfully');
            }

            resetForm();
            loadMaintenance();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to save maintenance record'
            );
        }
    };

    const handleEdit = (record) => {
        setEditingId(record.maintenance_id);

        setForm({
            uav_id: record.uav_id || '',
            maintenance_type: record.maintenance_type || '',
            description: record.description || '',
            scheduled_date: record.scheduled_date
                ? record.scheduled_date.substring(0, 10)
                : '',
            completed_date: record.completed_date
                ? record.completed_date.substring(0, 10)
                : '',
            performed_by: record.performed_by || '',
            status: record.status || 'SCHEDULED',
            notes: record.notes || ''
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this maintenance record?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `${API}/api/maintenance/${id}`,
                {
                    withCredentials: true
                }
            );

            setMessage('Maintenance record deleted successfully');
            loadMaintenance();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to delete maintenance record'
            );
        }
    };

    return (
        <div>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Maintenance</h1>
                    <p style={styles.subtitle}>
                        UAV maintenance scheduling and service records
                    </p>
                </div>

                <button
                    onClick={loadMaintenance}
                    style={styles.refreshButton}
                >
                    Refresh
                </button>
            </header>

            {message && (
                <div style={styles.message}>
                    {message}
                </div>
            )}

            <section style={styles.formPanel}>
                <h2>
                    {editingId
                        ? 'Edit Maintenance Record'
                        : 'Add Maintenance Record'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>
                        <div style={styles.field}>
                            <label>UAV ID</label>
                            <input
                                type="number"
                                name="uav_id"
                                value={form.uav_id}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Maintenance Type</label>
                            <input
                                type="text"
                                name="maintenance_type"
                                placeholder="Battery Inspection"
                                value={form.maintenance_type}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Scheduled Date</label>
                            <input
                                type="date"
                                name="scheduled_date"
                                value={form.scheduled_date}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Completed Date</label>
                            <input
                                type="date"
                                name="completed_date"
                                value={form.completed_date}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Performed By</label>
                            <input
                                type="text"
                                name="performed_by"
                                placeholder="Technician name"
                                value={form.performed_by}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                <option value="SCHEDULED">
                                    SCHEDULED
                                </option>
                                <option value="IN_PROGRESS">
                                    IN_PROGRESS
                                </option>
                                <option value="COMPLETED">
                                    COMPLETED
                                </option>
                                <option value="CANCELLED">
                                    CANCELLED
                                </option>
                            </select>
                        </div>

                        <div style={styles.fieldFull}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                placeholder="Maintenance description"
                                value={form.description}
                                onChange={handleChange}
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.fieldFull}>
                            <label>Notes</label>
                            <textarea
                                name="notes"
                                placeholder="Additional maintenance notes"
                                value={form.notes}
                                onChange={handleChange}
                                style={styles.textarea}
                            />
                        </div>
                    </div>

                    <div style={styles.formButtons}>
                        <button
                            type="submit"
                            style={styles.saveButton}
                        >
                            {editingId
                                ? 'Update Maintenance'
                                : 'Add Maintenance'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section style={styles.panel}>
                <div style={styles.panelHeader}>
                    <div>
                        <h2>Maintenance Records</h2>
                        <p>
                            Total records: {maintenance.length}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div style={styles.empty}>
                        Loading maintenance records...
                    </div>
                ) : maintenance.length === 0 ? (
                    <div style={styles.empty}>
                        No maintenance records found.
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>UAV ID</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Description</th>
                                    <th style={styles.th}>Scheduled</th>
                                    <th style={styles.th}>Completed</th>
                                    <th style={styles.th}>Performed By</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {maintenance.map((record) => (
                                    <tr key={record.maintenance_id}>
                                        <td style={styles.td}>
                                            {record.maintenance_id}
                                        </td>

                                        <td style={styles.td}>
                                            {record.uav_id}
                                        </td>

                                        <td style={styles.td}>
                                            {record.maintenance_type}
                                        </td>

                                        <td style={styles.td}>
                                            {record.description || '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {record.scheduled_date
                                                ? new Date(
                                                    record.scheduled_date
                                                ).toLocaleDateString()
                                                : '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {record.completed_date
                                                ? new Date(
                                                    record.completed_date
                                                ).toLocaleDateString()
                                                : '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {record.performed_by || '-'}
                                        </td>

                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.status,
                                                    ...(record.status ===
                                                    'COMPLETED'
                                                        ? styles.completed
                                                        : record.status ===
                                                          'IN_PROGRESS'
                                                        ? styles.inProgress
                                                        : record.status ===
                                                          'CANCELLED'
                                                        ? styles.cancelled
                                                        : styles.scheduled)
                                                }}
                                            >
                                                {record.status}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            <button
                                                onClick={() =>
                                                    handleEdit(record)
                                                }
                                                style={styles.editButton}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        record.maintenance_id
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
        fontSize: '30px'
    },

    subtitle: {
        color: '#666',
        marginTop: '6px'
    },

    refreshButton: {
        padding: '10px 18px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: '#172033',
        color: 'white'
    },

    message: {
        padding: '12px',
        marginBottom: '20px',
        backgroundColor: '#eef2f7',
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
        gap: '18px'
    },

    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
    },

    fieldFull: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        gridColumn: '1 / -1'
    },

    input: {
        padding: '10px',
        border: '1px solid #d5d9df',
        borderRadius: '5px',
        boxSizing: 'border-box'
    },

    textarea: {
        padding: '10px',
        border: '1px solid #d5d9df',
        borderRadius: '5px',
        minHeight: '80px',
        resize: 'vertical',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
    },

    formButtons: {
        marginTop: '20px',
        display: 'flex',
        gap: '10px'
    },

    saveButton: {
        padding: '11px 18px',
        backgroundColor: '#172033',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },

    cancelButton: {
        padding: '11px 18px',
        backgroundColor: '#e5e7eb',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },

    panel: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },

    panelHeader: {
        marginBottom: '20px'
    },

    tableContainer: {
        overflowX: 'auto'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1000px'
    },

    th: {
        textAlign: 'left',
        padding: '12px',
        backgroundColor: '#f4f6f8',
        borderBottom: '1px solid #ddd',
        whiteSpace: 'nowrap'
    },

    td: {
        padding: '12px',
        borderBottom: '1px solid #eee',
        verticalAlign: 'top'
    },

    status: {
        display: 'inline-block',
        padding: '5px 9px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    completed: {
        backgroundColor: '#d1fae5',
        color: '#065f46'
    },

    inProgress: {
        backgroundColor: '#dbeafe',
        color: '#1e40af'
    },

    scheduled: {
        backgroundColor: '#fef3c7',
        color: '#92400e'
    },

    cancelled: {
        backgroundColor: '#fee2e2',
        color: '#991b1b'
    },

    editButton: {
        padding: '6px 10px',
        marginRight: '6px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#e5e7eb'
    },

    deleteButton: {
        padding: '6px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#fee2e2',
        color: '#991b1b'
    },

    empty: {
        padding: '30px',
        textAlign: 'center',
        color: '#777'
    }
};

export default MaintenancePage;