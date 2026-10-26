import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function MissionPage() {
    const [missions, setMissions] = useState([]);
    const [message, setMessage] = useState('Loading missions...');
    const [editingMission, setEditingMission] = useState(null);
    const [saving, setSaving] = useState(false);

    const loadMissions = async () => {
        try {
            setMessage('Loading missions...');

            const response = await axios.get(
                `${API}/api/missions`,
                {
                    withCredentials: true
                }
            );

            setMissions(response.data.data || []);
            setMessage('');
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load missions'
            );
        }
    };

    useEffect(() => {
        loadMissions();
    }, []);

    const startEditing = (mission) => {
        setEditingMission({
            mission_id: mission.mission_id,
            uav_id: mission.uav_id || '',
            created_by: mission.created_by || '',
            mission_name: mission.mission_name || '',
            description: mission.description || '',
            start_time: mission.start_time
                ? mission.start_time.slice(0, 16)
                : '',
            end_time: mission.end_time
                ? mission.end_time.slice(0, 16)
                : '',
            start_latitude: mission.start_latitude || '',
            start_longitude: mission.start_longitude || '',
            destination_latitude:
                mission.destination_latitude || '',
            destination_longitude:
                mission.destination_longitude || '',
            status: mission.status || 'PLANNED'
        });
    };

    const cancelEditing = () => {
        setEditingMission(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditingMission((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const saveMission = async (e) => {
        e.preventDefault();

        if (!editingMission) {
            return;
        }

        try {
            setSaving(true);
            setMessage('');

            const response = await axios.put(
                `${API}/api/missions/${editingMission.mission_id}`,
                {
                    uav_id: Number(editingMission.uav_id),
                    mission_name: editingMission.mission_name,
                    description: editingMission.description,
                    start_time:
                        editingMission.start_time || null,
                    end_time:
                        editingMission.end_time || null,
                    start_latitude:
                        editingMission.start_latitude === ''
                            ? null
                            : Number(editingMission.start_latitude),
                    start_longitude:
                        editingMission.start_longitude === ''
                            ? null
                            : Number(editingMission.start_longitude),
                    destination_latitude:
                        editingMission.destination_latitude === ''
                            ? null
                            : Number(
                                editingMission.destination_latitude
                            ),
                    destination_longitude:
                        editingMission.destination_longitude === ''
                            ? null
                            : Number(
                                editingMission.destination_longitude
                            ),
                    status: editingMission.status
                },
                {
                    withCredentials: true
                }
            );

            setMessage(
                response.data.message ||
                'Mission updated successfully'
            );

            setEditingMission(null);

            await loadMissions();
        } catch (error) {
            console.error('Error updating mission:', error);

            setMessage(
                error.response?.data?.message ||
                'Failed to update mission'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Missions</h1>

                    <p style={styles.subtitle}>
                        Mission planning and flight operations
                    </p>
                </div>

                <button
                    onClick={loadMissions}
                    style={styles.refreshButton}
                >
                    Refresh Missions
                </button>
            </div>

            {message && (
                <div style={styles.message}>
                    {message}
                </div>
            )}

            {editingMission && (
                <div style={styles.editPanel}>
                    <div style={styles.editHeader}>
                        <div>
                            <h2 style={styles.editTitle}>
                                Edit Mission
                            </h2>

                            <p style={styles.editSubtitle}>
                                Mission ID: {editingMission.mission_id}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={cancelEditing}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={saveMission}>
                        <div style={styles.formGrid}>
                            <div style={styles.field}>
                                <label>Mission Name</label>

                                <input
                                    name="mission_name"
                                    value={
                                        editingMission.mission_name
                                    }
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label>UAV ID</label>

                                <input
                                    type="number"
                                    name="uav_id"
                                    value={editingMission.uav_id}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label>Status</label>

                                <select
                                    name="status"
                                    value={editingMission.status}
                                    onChange={handleChange}
                                    style={styles.input}
                                >
                                    <option value="PLANNED">
                                        PLANNED
                                    </option>

                                    <option value="ACTIVE">
                                        ACTIVE
                                    </option>

                                    <option value="COMPLETED">
                                        COMPLETED
                                    </option>

                                    <option value="CANCELLED">
                                        CANCELLED
                                    </option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label>Start Time</label>

                                <input
                                    type="datetime-local"
                                    name="start_time"
                                    value={
                                        editingMission.start_time
                                    }
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label>End Time</label>

                                <input
                                    type="datetime-local"
                                    name="end_time"
                                    value={
                                        editingMission.end_time
                                    }
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label>Start Latitude</label>

                                <input
                                    type="number"
                                    step="any"
                                    name="start_latitude"
                                    value={
                                        editingMission.start_latitude
                                    }
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label>Start Longitude</label>

                                <input
                                    type="number"
                                    step="any"
                                    name="start_longitude"
                                    value={
                                        editingMission.start_longitude
                                    }
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label>Destination Latitude</label>

                                <input
                                    type="number"
                                    step="any"
                                    name="destination_latitude"
                                    value={
                                        editingMission.destination_latitude
                                    }
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label>Destination Longitude</label>

                                <input
                                    type="number"
                                    step="any"
                                    name="destination_longitude"
                                    value={
                                        editingMission.destination_longitude
                                    }
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.field}>
                            <label>Description</label>

                            <textarea
                                name="description"
                                value={
                                    editingMission.description
                                }
                                onChange={handleChange}
                                rows="4"
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.saveRow}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={styles.saveButton}
                            >
                                {saving
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </button>

                            <button
                                type="button"
                                onClick={cancelEditing}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {missions.length > 0 && (
                <div style={styles.grid}>
                    {missions.map((mission) => (
                        <div
                            key={mission.mission_id}
                            style={styles.card}
                        >
                            <div style={styles.cardHeader}>
                                <h2 style={styles.missionName}>
                                    {mission.mission_name}
                                </h2>

                                <span style={styles.status}>
                                    {mission.status}
                                </span>
                            </div>

                            <p style={styles.description}>
                                {mission.description ||
                                    'No description available'}
                            </p>

                            <div style={styles.details}>
                                <p>
                                    <strong>Mission ID:</strong>{' '}
                                    {mission.mission_id}
                                </p>

                                <p>
                                    <strong>UAV ID:</strong>{' '}
                                    {mission.uav_id}
                                </p>

                                <p>
                                    <strong>Created By:</strong>{' '}
                                    {mission.created_by}
                                </p>

                                <p>
                                    <strong>Start Time:</strong>{' '}
                                    {mission.start_time ||
                                        'Not specified'}
                                </p>

                                <p>
                                    <strong>End Time:</strong>{' '}
                                    {mission.end_time ||
                                        'Not specified'}
                                </p>
                            </div>

                            <div style={styles.location}>
                                <div>
                                    <strong>Start Location</strong>

                                    <p>
                                        {mission.start_latitude},{' '}
                                        {mission.start_longitude}
                                    </p>
                                </div>

                                <div>
                                    <strong>Destination</strong>

                                    <p>
                                        {mission.destination_latitude},{' '}
                                        {mission.destination_longitude}
                                    </p>
                                </div>
                            </div>

                            <div style={styles.cardActions}>
                                <button
                                    onClick={() =>
                                        startEditing(mission)
                                    }
                                    style={styles.editButton}
                                >
                                    Edit Mission
                                </button>
                            </div>
                        </div>
                    ))}
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
        backgroundColor: '#172033',
        color: 'white',
        cursor: 'pointer'
    },

    message: {
        padding: '15px 20px',
        marginBottom: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        color: '#667085'
    },

    editPanel: {
        padding: '25px',
        marginBottom: '25px',
        backgroundColor: 'white',
        border: '1px solid #e4e7ec',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
    },

    editHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },

    editTitle: {
        margin: 0,
        fontSize: '22px'
    },

    editSubtitle: {
        marginTop: '5px',
        color: '#667085'
    },

    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px'
    },

    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        marginBottom: '15px'
    },

    input: {
        padding: '10px',
        border: '1px solid #d0d5dd',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box'
    },

    textarea: {
        padding: '10px',
        border: '1px solid #d0d5dd',
        borderRadius: '6px',
        fontSize: '14px',
        resize: 'vertical',
        fontFamily: 'Arial, sans-serif'
    },

    saveRow: {
        display: 'flex',
        gap: '10px',
        marginTop: '10px'
    },

    saveButton: {
        padding: '10px 18px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2563eb',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    cancelButton: {
        padding: '10px 18px',
        border: '1px solid #d0d5dd',
        borderRadius: '6px',
        backgroundColor: 'white',
        color: '#344054',
        cursor: 'pointer'
    },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '18px'
    },

    card: {
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #e4e7ec',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
    },

    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },

    missionName: {
        margin: 0,
        fontSize: '20px'
    },

    status: {
        padding: '5px 10px',
        borderRadius: '15px',
        backgroundColor: '#eef2ff',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    description: {
        color: '#667085',
        marginBottom: '18px'
    },

    details: {
        borderTop: '1px solid #e4e7ec',
        borderBottom: '1px solid #e4e7ec',
        padding: '10px 0',
        marginBottom: '15px'
    },

    location: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
    },

    cardActions: {
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '1px solid #e4e7ec'
    },

    editButton: {
        padding: '9px 16px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2563eb',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default MissionPage;