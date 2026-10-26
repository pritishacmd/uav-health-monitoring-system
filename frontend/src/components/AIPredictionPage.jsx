import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function AIPredictionPage() {
    const [predictions, setPredictions] = useState([]);
    const [uavs, setUavs] = useState([]);

    const [loading, setLoading] = useState(false);
    const [predicting, setPredicting] = useState(false);

    const [message, setMessage] = useState('');
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        uav_id: '',
        battery_percentage: 20,
        temperature: 90,
        vibration: 8,
        altitude: 300,
        speed: 80
    });

    const loadPredictions = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.get(
                `${API}/api/ai-predictions`,
                {
                    withCredentials: true
                }
            );

            setPredictions(response.data.data || []);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load AI predictions'
            );
        } finally {
            setLoading(false);
        }
    };

    const loadUavs = async () => {
        try {
            const response = await axios.get(
                `${API}/api/uavs`,
                {
                    withCredentials: true
                }
            );

            const data = response.data.data || [];

            setUavs(data);

            if (data.length > 0) {
                setFormData((previous) => ({
                    ...previous,
                    uav_id: previous.uav_id || data[0].uav_id
                }));
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load UAVs'
            );
        }
    };

    useEffect(() => {
        loadPredictions();
        loadUavs();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const runPrediction = async (e) => {
        e.preventDefault();

        if (!formData.uav_id) {
            setMessage('Please select a UAV before running the prediction.');
            return;
        }

        setPredicting(true);
        setMessage('');
        setResult(null);

        try {
            const predictionResponse = await axios.post(
                `${API}/api/ai-predictions/predict`,
                {
                    battery_percentage: Number(
                        formData.battery_percentage
                    ),
                    temperature: Number(
                        formData.temperature
                    ),
                    vibration: Number(
                        formData.vibration
                    ),
                    altitude: Number(
                        formData.altitude
                    ),
                    speed: Number(
                        formData.speed
                    )
                },
                {
                    withCredentials: true
                }
            );

            const predictionData =
                predictionResponse.data.data;

            setResult(predictionData);

            await axios.post(
                `${API}/api/ai-predictions`,
                {
                    uav_id: Number(formData.uav_id),
                    health_record_id: null,
                    model_name: 'UAV-Health-Risk-v1',
                    prediction: predictionData.prediction,
                    risk_score: Number(
                        predictionData.risk_score
                    ),
                    confidence_score: Number(
                        predictionData.confidence_score
                    ),
                    recommended_action:
                        predictionData.recommended_action,
                    predicted_at: new Date().toISOString()
                },
                {
                    withCredentials: true
                }
            );

            await loadPredictions();

            setMessage(
                Number(predictionData.risk_score) >= 70
                    ? 'High-risk prediction generated and saved successfully.'
                    : 'AI prediction generated and saved successfully.'
            );

        } catch (error) {
            console.error('Prediction error:', error);

            setMessage(
                error.response?.data?.message ||
                'Unable to generate and save AI prediction'
            );
        } finally {
            setPredicting(false);
        }
    };

    const getRiskStyle = (riskScore) => {
        const score = Number(riskScore);

        if (score >= 70) {
            return {
                backgroundColor: '#fee2e2',
                color: '#b91c1c'
            };
        }

        if (score >= 40) {
            return {
                backgroundColor: '#fef3c7',
                color: '#b45309'
            };
        }

        return {
            backgroundColor: '#dcfce7',
            color: '#15803d'
        };
    };

    const getPredictionStyle = (prediction) => {
        const value = String(
            prediction || ''
        ).toLowerCase();

        if (
            value.includes('critical') ||
            value.includes('failure') ||
            value.includes('danger') ||
            value.includes('high risk') ||
            value.includes('anomaly')
        ) {
            return {
                backgroundColor: '#fee2e2',
                color: '#b91c1c'
            };
        }

        if (
            value.includes('warning') ||
            value.includes('risk') ||
            value.includes('medium') ||
            value.includes('degradation')
        ) {
            return {
                backgroundColor: '#fef3c7',
                color: '#b45309'
            };
        }

        return {
            backgroundColor: '#dcfce7',
            color: '#15803d'
        };
    };

    return (
        <div>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        AI Predictions
                    </h1>

                    <p style={styles.subtitle}>
                        AI-assisted UAV health and risk predictions
                    </p>
                </div>

                <button
                    onClick={loadPredictions}
                    style={styles.refreshButton}
                >
                    {loading
                        ? 'Loading...'
                        : 'Refresh Predictions'}
                </button>
            </header>

            {message && (
                <div
                    style={
                        message.toLowerCase().includes('high-risk')
                            ? styles.successWarning
                            : styles.message
                    }
                >
                    {message}
                </div>
            )}

            <section style={styles.predictionPanel}>
                <h2 style={styles.panelTitle}>
                    Run AI Health Prediction
                </h2>

                <p style={styles.panelSubtitle}>
                    Select a UAV and enter its current telemetry values
                    to generate a health risk prediction.
                </p>

                <form onSubmit={runPrediction}>
                    <div style={styles.formGrid}>
                        <div style={styles.field}>
                            <label>UAV</label>

                            <select
                                name="uav_id"
                                value={formData.uav_id}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            >
                                <option value="">
                                    Select UAV
                                </option>

                                {uavs.map((uav) => (
                                    <option
                                        key={uav.uav_id}
                                        value={uav.uav_id}
                                    >
                                        UAV-{uav.uav_id}
                                        {uav.uav_name
                                            ? ` - ${uav.uav_name}`
                                            : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.field}>
                            <label>
                                Battery Percentage
                            </label>

                            <input
                                type="number"
                                name="battery_percentage"
                                value={
                                    formData.battery_percentage
                                }
                                onChange={handleChange}
                                min="0"
                                max="100"
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Temperature</label>

                            <input
                                type="number"
                                name="temperature"
                                value={
                                    formData.temperature
                                }
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Vibration</label>

                            <input
                                type="number"
                                name="vibration"
                                value={
                                    formData.vibration
                                }
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Altitude</label>

                            <input
                                type="number"
                                name="altitude"
                                value={
                                    formData.altitude
                                }
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Speed</label>

                            <input
                                type="number"
                                name="speed"
                                value={
                                    formData.speed
                                }
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={predicting}
                        style={
                            predicting
                                ? styles.predictButtonDisabled
                                : styles.predictButton
                        }
                    >
                        {predicting
                            ? 'Generating Prediction...'
                            : 'Run AI Prediction'}
                    </button>
                </form>
            </section>

            {result && (
                <section style={styles.resultPanel}>
                    <h2 style={styles.panelTitle}>
                        Latest AI Prediction
                    </h2>

                    <div style={styles.resultGrid}>
                        <div style={styles.resultCard}>
                            <span>UAV</span>

                            <strong style={styles.resultNumber}>
                                UAV-{formData.uav_id}
                            </strong>
                        </div>

                        <div style={styles.resultCard}>
                            <span>Prediction</span>

                            <strong
                                style={{
                                    ...styles.resultValue,
                                    ...getPredictionStyle(
                                        result.prediction
                                    )
                                }}
                            >
                                {result.prediction}
                            </strong>
                        </div>

                        <div style={styles.resultCard}>
                            <span>Risk Score</span>

                            <strong
                                style={{
                                    ...styles.resultValue,
                                    ...getRiskStyle(
                                        result.risk_score
                                    )
                                }}
                            >
                                {result.risk_score}%
                            </strong>
                        </div>

                        <div style={styles.resultCard}>
                            <span>Confidence</span>

                            <strong style={styles.resultNumber}>
                                {result.confidence_score}%
                            </strong>
                        </div>
                    </div>

                    <div style={styles.actionBox}>
                        <strong>
                            Recommended Action
                        </strong>

                        <p>
                            {result.recommended_action}
                        </p>
                    </div>

                    {Number(result.risk_score) >= 70 && (
                        <div style={styles.highRiskBox}>
                            <strong>
                                🚨 HIGH RISK DETECTED
                            </strong>

                            <p>
                                This UAV has a risk score of{' '}
                                {result.risk_score}%.
                                The Dashboard will display a
                                high-risk notification.
                            </p>
                        </div>
                    )}
                </section>
            )}

            <section style={styles.panel}>
                <div style={styles.panelHeader}>
                    <div>
                        <h2 style={styles.panelTitle}>
                            Prediction Records
                        </h2>

                        <p style={styles.panelSubtitle}>
                            AI-generated predictions for registered UAVs
                        </p>
                    </div>
                </div>

                {loading && predictions.length === 0 ? (
                    <div style={styles.empty}>
                        Loading AI predictions...
                    </div>
                ) : predictions.length === 0 ? (
                    <div style={styles.empty}>
                        No AI prediction records found.
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>UAV ID</th>
                                    <th style={styles.th}>
                                        Health Record
                                    </th>
                                    <th style={styles.th}>Model</th>
                                    <th style={styles.th}>
                                        Prediction
                                    </th>
                                    <th style={styles.th}>
                                        Risk Score
                                    </th>
                                    <th style={styles.th}>
                                        Confidence
                                    </th>
                                    <th style={styles.th}>
                                        Recommended Action
                                    </th>
                                    <th style={styles.th}>
                                        Predicted At
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {predictions.map((item) => (
                                    <tr
                                        key={
                                            item.prediction_id
                                        }
                                    >
                                        <td style={styles.td}>
                                            {
                                                item.prediction_id
                                            }
                                        </td>

                                        <td style={styles.td}>
                                            UAV-{item.uav_id}
                                        </td>

                                        <td style={styles.td}>
                                            {item.health_record_id ||
                                                'N/A'}
                                        </td>

                                        <td style={styles.td}>
                                            <strong>
                                                {item.model_name ||
                                                    'N/A'}
                                            </strong>
                                        </td>

                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    ...getPredictionStyle(
                                                        item.prediction
                                                    )
                                                }}
                                            >
                                                {item.prediction ||
                                                    'N/A'}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    ...getRiskStyle(
                                                        item.risk_score
                                                    )
                                                }}
                                            >
                                                {item.risk_score !==
                                                    null &&
                                                item.risk_score !==
                                                    undefined
                                                    ? `${item.risk_score}%`
                                                    : 'N/A'}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            {item.confidence_score !==
                                                null &&
                                            item.confidence_score !==
                                                undefined
                                                ? `${item.confidence_score}%`
                                                : 'N/A'}
                                        </td>

                                        <td style={styles.td}>
                                            {item.recommended_action ||
                                                'N/A'}
                                        </td>

                                        <td style={styles.td}>
                                            {item.predicted_at
                                                ? new Date(
                                                      item.predicted_at
                                                  ).toLocaleString()
                                                : 'N/A'}
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

    refreshButton: {
        padding: '10px 16px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#172033',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    message: {
        backgroundColor: '#dcfce7',
        color: '#15803d',
        padding: '12px 15px',
        borderRadius: '6px',
        marginBottom: '20px'
    },

    successWarning: {
        backgroundColor: '#fff4e5',
        color: '#b45309',
        padding: '12px 15px',
        borderRadius: '6px',
        marginBottom: '20px'
    },

    predictionPanel: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '25px'
    },

    resultPanel: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '25px'
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

    panelTitle: {
        margin: 0,
        marginBottom: '5px'
    },

    panelSubtitle: {
        margin: 0,
        color: '#777'
    },

    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginTop: '20px',
        marginBottom: '20px'
    },

    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
    },

    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box'
    },

    predictButton: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2563eb',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    predictButtonDisabled: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#94a3b8',
        color: 'white',
        cursor: 'not-allowed',
        fontWeight: 'bold'
    },

    resultGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginTop: '20px'
    },

    resultCard: {
        padding: '18px',
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },

    resultValue: {
        display: 'inline-block',
        width: 'fit-content',
        padding: '6px 10px',
        borderRadius: '20px',
        fontSize: '14px'
    },

    resultNumber: {
        fontSize: '20px'
    },

    actionBox: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
    },

    highRiskBox: {
        marginTop: '15px',
        padding: '15px',
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
        borderRadius: '8px'
    },

    tableContainer: {
        width: '100%',
        overflowX: 'auto'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1100px'
    },

    th: {
        textAlign: 'left',
        padding: '12px',
        backgroundColor: '#f4f6f8',
        borderBottom: '1px solid #ddd',
        fontSize: '13px'
    },

    td: {
        padding: '14px 12px',
        borderBottom: '1px solid #eee',
        fontSize: '14px',
        verticalAlign: 'middle'
    },

    badge: {
        display: 'inline-block',
        padding: '5px 9px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    empty: {
        padding: '40px',
        textAlign: 'center',
        color: '#777'
    }
};

export default AIPredictionPage;