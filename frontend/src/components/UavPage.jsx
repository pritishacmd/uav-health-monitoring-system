import React, { useEffect, useState } from 'react';
import {
    getAllUavs,
    createUav,
    updateUav,
    deleteUav
} from '../api/uavApi';

function UavPage() {
    const [uavs, setUavs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUav, setEditingUav] = useState(null);

    const [form, setForm] = useState({
        uav_name: '',
        model: '',
        serial_number: '',
        manufacturer: '',
        status: 'AVAILABLE',
        battery_capacity: '',
        purchase_date: '',
        last_maintenance_date: ''
    });

    const loadUavs = async () => {
        try {
            setLoading(true);
            const response = await getAllUavs();
            setUavs(response.data || []);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load UAVs'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUavs();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            uav_name: '',
            model: '',
            serial_number: '',
            manufacturer: '',
            status: 'AVAILABLE',
            battery_capacity: '',
            purchase_date: '',
            last_maintenance_date: ''
        });

        setEditingUav(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingUav) {
                await updateUav(editingUav.uav_id, form);
                setMessage('UAV updated successfully');
            } else {
                await createUav(form);
                setMessage('UAV created successfully');
            }

            resetForm();
            await loadUavs();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to save UAV'
            );
        }
    };

    const handleEdit = (uav) => {
        setEditingUav(uav);

        setForm({
            uav_name: uav.uav_name || '',
            model: uav.model || '',
            serial_number: uav.serial_number || '',
            manufacturer: uav.manufacturer || '',
            status: uav.status || 'AVAILABLE',
            battery_capacity: uav.battery_capacity || '',
            purchase_date: uav.purchase_date
                ? uav.purchase_date.substring(0, 10)
                : '',
            last_maintenance_date: uav.last_maintenance_date
                ? uav.last_maintenance_date.substring(0, 10)
                : ''
        });

        setShowForm(true);
        setMessage('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this UAV?')) {
            return;
        }

        try {
            await deleteUav(id);
            setMessage('UAV deleted successfully');
            await loadUavs();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to delete UAV'
            );
        }
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
            }}>
                <div>
                    <h2 style={{ marginBottom: '5px' }}>
                        UAV Management
                    </h2>

                    <p style={{ marginTop: 0 }}>
                        Manage registered unmanned aerial vehicles
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    style={{
                        padding: '10px 18px',
                        cursor: 'pointer'
                    }}
                >
                    + Add UAV
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '12px',
                    marginBottom: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                }}>
                    {message}
                </div>
            )}

            {showForm && (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '25px',
                    marginBottom: '25px'
                }}>
                    <h3>
                        {editingUav ? 'Edit UAV' : 'Register New UAV'}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px'
                        }}>
                            <input
                                name="uav_name"
                                placeholder="UAV Name"
                                value={form.uav_name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="model"
                                placeholder="Model"
                                value={form.model}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="serial_number"
                                placeholder="Serial Number"
                                value={form.serial_number}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="manufacturer"
                                placeholder="Manufacturer"
                                value={form.manufacturer}
                                onChange={handleChange}
                            />

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="AVAILABLE">
                                    AVAILABLE
                                </option>
                                <option value="IN_MISSION">
                                    IN_MISSION
                                </option>
                                <option value="MAINTENANCE">
                                    MAINTENANCE
                                </option>
                                <option value="OFFLINE">
                                    OFFLINE
                                </option>
                            </select>

                            <input
                                name="battery_capacity"
                                type="number"
                                placeholder="Battery Capacity"
                                value={form.battery_capacity}
                                onChange={handleChange}
                            />

                            <input
                                name="purchase_date"
                                type="date"
                                value={form.purchase_date}
                                onChange={handleChange}
                            />

                            <input
                                name="last_maintenance_date"
                                type="date"
                                value={form.last_maintenance_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '10px 18px',
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                }}
                            >
                                {editingUav ? 'Update UAV' : 'Create UAV'}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    padding: '10px 18px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading UAVs...</p>
            ) : uavs.length === 0 ? (
                <p>No UAVs registered.</p>
            ) : (
                <div>
                    <h3>Registered UAVs</h3>

                    {uavs.map((uav) => (
                        <div
                            key={uav.uav_id}
                            style={{
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '15px'
                            }}
                        >
                            <h3 style={{ marginTop: 0 }}>
                                {uav.uav_name}
                            </h3>

                            <p>
                                <strong>UAV ID:</strong>{' '}
                                {uav.uav_id}
                            </p>

                            <p>
                                <strong>Model:</strong>{' '}
                                {uav.model}
                            </p>

                            <p>
                                <strong>Serial Number:</strong>{' '}
                                {uav.serial_number}
                            </p>

                            <p>
                                <strong>Manufacturer:</strong>{' '}
                                {uav.manufacturer || 'N/A'}
                            </p>

                            <p>
                                <strong>Status:</strong>{' '}
                                {uav.status}
                            </p>

                            <p>
                                <strong>Battery Capacity:</strong>{' '}
                                {uav.battery_capacity ?? 'N/A'}
                            </p>

                            <div style={{ marginTop: '15px' }}>
                                <button
                                    onClick={() => handleEdit(uav)}
                                    style={{
                                        padding: '8px 15px',
                                        marginRight: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(uav.uav_id)
                                    }
                                    style={{
                                        padding: '8px 15px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UavPage;