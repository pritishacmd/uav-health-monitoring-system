import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UavPage from './components/UavPage';
import MissionPage from './components/MissionPage';
import TelemetryPage from './components/TelemetryPage';
import HealthPage from './components/HealthPage';
import AlertPage from './components/AlertPage';
import MaintenancePage from './components/MaintenancePage';
import FlightHistoryPage from './components/FlightHistoryPage';
import AIPredictionPage from './components/AIPredictionPage';
import SystemLogsPage from './components/SystemLogsPage';
import PaymentPage from './components/PaymentPage';

const API = 'http://localhost:5000';

const drones = [
    {
        id: 1,
        name: 'DJI Mavic 3 Pro',
        category: 'Professional Camera Drone',
        description:
            'A high-performance drone designed for professional aerial photography and surveillance.',
        price: 185000,
        range: '15 km',
        flightTime: '43 minutes',
        camera: '4K Hasselblad Camera',
        image:
            'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=85'
    },
    {
        id: 2,
        name: 'Autel EVO Nano+',
        category: 'Compact Camera Drone',
        description:
            'A lightweight and portable drone suitable for travel, inspection, and photography.',
        price: 95000,
        range: '10 km',
        flightTime: '28 minutes',
        camera: '50MP Camera',
        image:
            'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=900&q=85'
    },
    {
        id: 3,
        name: 'DJI Matrice 350 RTK',
        category: 'Industrial Enterprise Drone',
        description:
            'An enterprise-grade UAV designed for industrial inspection, mapping, and monitoring.',
        price: 625000,
        range: '20 km',
        flightTime: '55 minutes',
        camera: 'Interchangeable Payload',
        image:
            'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=900&q=85'
    },
    {
        id: 4,
        name: 'Parrot Anafi AI',
        category: 'Smart Inspection Drone',
        description:
            'A smart drone with advanced imaging and connectivity features for inspection tasks.',
        price: 245000,
        range: '9 km',
        flightTime: '32 minutes',
        camera: '48MP 4K HDR Camera',
        image:
            'https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&w=900&q=85'
    },
    {
        id: 5,
        name: 'DJI Mini 4 Pro',
        category: 'Beginner-Friendly Drone',
        description:
            'A compact and easy-to-use drone suitable for beginners and recreational users.',
        price: 78000,
        range: '12 km',
        flightTime: '34 minutes',
        camera: '4K HDR Camera',
        image:
            'https://images.unsplash.com/photo-1579820010410-c10411aaaa88?auto=format&fit=crop&w=900&q=85'
    },
    {
        id: 6,
        name: 'Skydio X10',
        category: 'Autonomous Security Drone',
        description:
            'An autonomous drone designed for security, emergency response, and infrastructure monitoring.',
        price: 475000,
        range: '12 km',
        flightTime: '40 minutes',
        camera: 'Thermal and 4K Camera',
        image:
            'https://images.unsplash.com/photo-1579820010410-c10411aaaa88?auto=format&fit=crop&w=900&q=85'
    }
];

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    const [uavs, setUavs] = useState([]);

    const [dashboardStats, setDashboardStats] = useState({
        totalUavs: 0,
        activeMissions: 0,
        activeAlerts: 0,
        maintenanceDue: 0
    });

    const [highRiskPredictions, setHighRiskPredictions] = useState([]);
    const [currentPage, setCurrentPage] = useState('dashboard');

    const [purchases, setPurchases] = useState([]);
    const [userPage, setUserPage] = useState('home');

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get(
                    `${API}/api/auth/me`,
                    {
                        withCredentials: true
                    }
                );

                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            }
        };

        checkLogin();
    }, []);

    useEffect(() => {
        if (
            user &&
            String(user.role || '').toUpperCase() === 'ADMIN' &&
            currentPage === 'dashboard'
        ) {
            loadDashboardStats();
            loadHighRiskPredictions();
        }
    }, [user, currentPage]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');

        try {
            const response = await axios.post(
                `${API}/api/auth/login`,
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            const loggedInUser = response.data.user;

            setUser(loggedInUser);
            setCurrentPage('dashboard');
            setUserPage('home');
            setMessage('');
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Login failed'
            );
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                `${API}/api/auth/logout`,
                {},
                {
                    withCredentials: true
                }
            );
        } catch (error) {
            console.error('Logout error:', error);
        }

        setUser(null);
        setEmail('');
        setPassword('');
        setMessage('');
        setCurrentPage('dashboard');
        setUserPage('home');
        setPurchases([]);

        localStorage.removeItem('selectedDrone');
        localStorage.removeItem('paymentStatus');
        localStorage.removeItem('orderId');
    };

    const loadUavs = async () => {
        try {
            const response = await axios.get(
                `${API}/api/uavs`,
                {
                    withCredentials: true
                }
            );

            setUavs(response.data.data || []);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to load UAV data'
            );
        }
    };

    const loadHighRiskPredictions = async () => {
        try {
            const response = await axios.get(
                `${API}/api/ai-predictions`,
                {
                    withCredentials: true
                }
            );

            const predictions = response.data.data || [];

            const highRisk = predictions.filter(
                (prediction) =>
                    Number(prediction.risk_score || 0) >= 70
            );

            setHighRiskPredictions(highRisk);
        } catch (error) {
            console.error(
                'Error loading AI predictions:',
                error
            );

            setHighRiskPredictions([]);
        }
    };

    const loadDashboardStats = async () => {
        try {
            const [
                uavResponse,
                missionResponse,
                alertResponse,
                maintenanceResponse
            ] = await Promise.all([
                axios.get(`${API}/api/uavs`, {
                    withCredentials: true
                }),

                axios.get(`${API}/api/missions`, {
                    withCredentials: true
                }),

                axios.get(`${API}/api/alerts`, {
                    withCredentials: true
                }),

                axios.get(`${API}/api/maintenance`, {
                    withCredentials: true
                })
            ]);

            const uavData = uavResponse.data.data || [];
            const missionData = missionResponse.data.data || [];
            const alertData = alertResponse.data.data || [];
            const maintenanceData =
                maintenanceResponse.data.data || [];

            const activeMissions = missionData.filter(
                (mission) =>
                    String(mission.status || '').toUpperCase() ===
                    'ACTIVE'
            ).length;

            const activeAlerts = alertData.filter(
                (alert) =>
                    String(alert.status || '').toUpperCase() ===
                    'ACTIVE'
            ).length;

            const maintenanceDue = maintenanceData.filter(
                (maintenance) => {
                    const status = String(
                        maintenance.status || ''
                    ).toUpperCase();

                    return (
                        status === 'PENDING' ||
                        status === 'SCHEDULED' ||
                        status === 'DUE'
                    );
                }
            ).length;

            setDashboardStats({
                totalUavs: uavData.length,
                activeMissions,
                activeAlerts,
                maintenanceDue
            });
        } catch (error) {
            console.error(
                'Error loading dashboard statistics:',
                error
            );

            setMessage(
                error.response?.data?.message ||
                'Unable to load dashboard statistics'
            );
        }
    };

    const handlePurchase = (drone) => {
        const alreadyPurchased = purchases.some(
            (purchase) => purchase.id === drone.id
        );

        if (alreadyPurchased) {
            setMessage('You have already purchased this drone.');
            return;
        }

        const newPurchase = {
            ...drone,
            purchaseDate: new Date().toLocaleDateString(),
            orderId: `UAV-${Date.now()}`
        };

        setPurchases((previousPurchases) => [
            ...previousPurchases,
            newPurchase
        ]);

        localStorage.setItem(
            'selectedDrone',
            JSON.stringify(drone)
        );

        localStorage.removeItem('paymentStatus');
        localStorage.removeItem('orderId');

        setMessage(
            `${drone.name} has been added to your purchases.`
        );

        setUserPage('payments');
    };

    const isAdmin =
        user &&
        String(user.role || '').toUpperCase() === 'ADMIN';

    if (!user) {
        return (
            <div style={styles.loginPage}>
                <form
                    onSubmit={handleLogin}
                    style={styles.loginBox}
                >
                    <div style={styles.loginIcon}>✈</div>

                    <h1 style={styles.title}>
                        UAV Health Monitoring System
                    </h1>

                    <p style={styles.subtitle}>
                        Secure Flight Operations & Health Monitoring
                    </p>

                    <div style={styles.loginTag}>
                        Secure Portal Login
                    </div>

                    <h2 style={styles.loginHeading}>
                        Welcome Back
                    </h2>

                    <p style={styles.loginDescription}>
                        Sign in to access your UAV management portal.
                    </p>

                    <label style={styles.label}>
                        Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        style={styles.loginButton}
                    >
                        Sign In
                    </button>

                    {message && (
                        <p style={styles.errorMessage}>
                            {message}
                        </p>
                    )}

                    <p style={styles.loginFooter}>
                        Authorized users only
                    </p>
                </form>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div style={styles.userPortal}>
                <header style={styles.userHeader}>
                    <div>
                        <h1 style={styles.userPortalTitle}>
                            UAV User Portal
                        </h1>

                        <p style={styles.userPortalSubtitle}>
                            Welcome to the UAV services platform
                        </p>
                    </div>

                    <div style={styles.userHeaderRight}>
                        <div style={styles.userIdentity}>
                            <strong>
                                {user.full_name || user.email}
                            </strong>

                            <span>
                                {user.email}
                            </span>

                            <small>
                                {user.role || 'USER'}
                            </small>
                        </div>

                        <button
                            onClick={handleLogout}
                            style={styles.logoutButton}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main style={styles.userMain}>
                    <section style={styles.welcomeCard}>
                        <div style={styles.welcomeIcon}>
                            🚁
                        </div>

                        <div>
                            <h2>
                                Welcome, {user.full_name || 'User'}!
                            </h2>

                            <p>
                                Welcome to your UAV purchasing and
                                services portal.
                            </p>

                            <p style={styles.comingSoonText}>
                                Explore available drones, view their
                                specifications, and manage your purchases.
                            </p>
                        </div>
                    </section>

                    <nav style={styles.userNavigation}>
                        <button
                            onClick={() => {
                                setUserPage('home');
                                setMessage('');
                            }}
                            style={
                                userPage === 'home'
                                    ? styles.userNavActive
                                    : styles.userNavButton
                            }
                        >
                            Home
                        </button>

                        <button
                            onClick={() => {
                                setUserPage('drones');
                                setMessage('');
                            }}
                            style={
                                userPage === 'drones'
                                    ? styles.userNavActive
                                    : styles.userNavButton
                            }
                        >
                            Browse Drones
                        </button>

                        <button
                            onClick={() => {
                                setUserPage('purchases');
                                setMessage('');
                            }}
                            style={
                                userPage === 'purchases'
                                    ? styles.userNavActive
                                    : styles.userNavButton
                            }
                        >
                            My Purchases
                        </button>

                        <button
                            onClick={() => {
                                setUserPage('payments');
                                setMessage('');
                            }}
                            style={
                                userPage === 'payments'
                                    ? styles.userNavActive
                                    : styles.userNavButton
                            }
                        >
                            Payments
                        </button>
                    </nav>

                    {message && (
                        <div style={styles.successMessage}>
                            {message}
                        </div>
                    )}

                    {userPage === 'home' && (
                        <>
                            <section style={styles.userCards}>
                                <div
                                    style={styles.userCard}
                                    onClick={() => setUserPage('drones')}
                                >
                                    <div style={styles.userCardIcon}>
                                        🚁
                                    </div>

                                    <h3>
                                        Browse Drones
                                    </h3>

                                    <p>
                                        Explore available drones and
                                        their specifications.
                                    </p>

                                    <button
                                        style={styles.primaryButton}
                                        onClick={() =>
                                            setUserPage('drones')
                                        }
                                    >
                                        View Drones
                                    </button>
                                </div>

                                <div
                                    style={styles.userCard}
                                    onClick={() => setUserPage('purchases')}
                                >
                                    <div style={styles.userCardIcon}>
                                        🛒
                                    </div>

                                    <h3>
                                        My Purchases
                                    </h3>

                                    <p>
                                        View your purchased drones and
                                        order details.
                                    </p>

                                    <button
                                        style={styles.primaryButton}
                                        onClick={() =>
                                            setUserPage('purchases')
                                        }
                                    >
                                        View Purchases
                                    </button>
                                </div>

                                <div
                                    style={styles.userCard}
                                    onClick={() => setUserPage('payments')}
                                >
                                    <div style={styles.userCardIcon}>
                                        💳
                                    </div>

                                    <h3>
                                        Payments
                                    </h3>

                                    <p>
                                        Complete payments and upload
                                        payment screenshots.
                                    </p>

                                    <button
                                        style={styles.primaryButton}
                                        onClick={() =>
                                            setUserPage('payments')
                                        }
                                    >
                                        Open Payments
                                    </button>
                                </div>
                            </section>

                            <section style={styles.sectionPanel}>
                                <div style={styles.sectionHeader}>
                                    <div>
                                        <h2>
                                            Featured Drones
                                        </h2>

                                        <p>
                                            Explore our most popular UAVs.
                                        </p>
                                    </div>

                                    <button
                                        style={styles.outlineButton}
                                        onClick={() =>
                                            setUserPage('drones')
                                        }
                                    >
                                        View All
                                    </button>
                                </div>

                                <div style={styles.droneGrid}>
                                    {drones.slice(0, 3).map((drone) => (
                                        <DroneCard
                                            key={drone.id}
                                            drone={drone}
                                            onPurchase={handlePurchase}
                                            purchased={purchases.some(
                                                (purchase) =>
                                                    purchase.id === drone.id
                                            )}
                                        />
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {userPage === 'drones' && (
                        <section style={styles.sectionPanel}>
                            <div style={styles.sectionHeader}>
                                <div>
                                    <h2>
                                        Available Drones
                                    </h2>

                                    <p>
                                        Choose a drone according to your
                                        requirements.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.droneGrid}>
                                {drones.map((drone) => (
                                    <DroneCard
                                        key={drone.id}
                                        drone={drone}
                                        onPurchase={handlePurchase}
                                        purchased={purchases.some(
                                            (purchase) =>
                                                purchase.id === drone.id
                                        )}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {userPage === 'purchases' && (
                        <section style={styles.sectionPanel}>
                            <div style={styles.sectionHeader}>
                                <div>
                                    <h2>
                                        My Purchases
                                    </h2>

                                    <p>
                                        Your purchased drones and order
                                        details.
                                    </p>
                                </div>
                            </div>

                            {purchases.length === 0 ? (
                                <div style={styles.emptyPurchase}>
                                    <div style={styles.emptyIcon}>
                                        🛒
                                    </div>

                                    <h3>
                                        No purchases yet
                                    </h3>

                                    <p>
                                        You have not purchased any drones.
                                    </p>

                                    <button
                                        style={styles.primaryButton}
                                        onClick={() =>
                                            setUserPage('drones')
                                        }
                                    >
                                        Browse Drones
                                    </button>
                                </div>
                            ) : (
                                <div style={styles.purchaseGrid}>
                                    {purchases.map((purchase) => (
                                        <div
                                            key={purchase.orderId}
                                            style={styles.purchaseCard}
                                        >
                                            <img
                                                src={purchase.image}
                                                alt={purchase.name}
                                                style={styles.purchaseImage}
                                            />

                                            <div style={styles.purchaseDetails}>
                                                <h3>
                                                    {purchase.name}
                                                </h3>

                                                <p>
                                                    {purchase.category}
                                                </p>

                                                <p>
                                                    Order ID:{' '}
                                                    {purchase.orderId}
                                                </p>

                                                <p>
                                                    Purchase Date:{' '}
                                                    {purchase.purchaseDate}
                                                </p>

                                                <strong style={styles.price}>
                                                    ₹
                                                    {purchase.price.toLocaleString(
                                                        'en-IN'
                                                    )}
                                                </strong>

                                                <span
                                                    style={
                                                        styles.purchaseStatus
                                                    }
                                                >
                                                    Purchase Confirmed
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {userPage === 'payments' && (
                        <PaymentPage />
                    )}
                </main>
            </div>
        );
    }

    return (
        <div style={styles.app}>
            <aside style={styles.sidebar}>
                <h2 style={styles.logo}>
                    UAV SYSTEM
                </h2>

                <div style={styles.adminBadge}>
                    ADMIN PORTAL
                </div>

                <div style={styles.userBox}>
                    <strong>
                        {user.full_name || user.email}
                    </strong>

                    <span>
                        {user.email}
                    </span>

                    <small>
                        {user.role}
                    </small>
                </div>

                <nav>
                    <div
                        style={
                            currentPage === 'dashboard'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() => setCurrentPage('dashboard')}
                    >
                        Dashboard
                    </div>

                    <div
                        style={
                            currentPage === 'uavs'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() => setCurrentPage('uavs')}
                    >
                        UAVs
                    </div>

                    <div
                        style={
                            currentPage === 'missions'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() => setCurrentPage('missions')}
                    >
                        Missions
                    </div>

                    <div
                        style={
                            currentPage === 'telemetry'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() => setCurrentPage('telemetry')}
                    >
                        Telemetry
                    </div>

                    <div
                        style={
                            currentPage === 'health'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() => setCurrentPage('health')}
                    >
                        Health Monitoring
                    </div>

                    <div
                        style={
                            currentPage === 'alerts'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() => setCurrentPage('alerts')}
                    >
                        Alerts
                    </div>

                    <div
                        style={
                            currentPage === 'maintenance'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() => setCurrentPage('maintenance')}
                    >
                        Maintenance
                    </div>

                    <div
                        style={
                            currentPage === 'flight-history'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() =>
                            setCurrentPage('flight-history')
                        }
                    >
                        Flight History
                    </div>

                    <div
                        style={
                            currentPage === 'ai-predictions'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() =>
                            setCurrentPage('ai-predictions')
                        }
                    >
                        AI Predictions
                    </div>

                    <div
                        style={
                            currentPage === 'system-logs'
                                ? styles.activeMenu
                                : styles.menu
                        }
                        onClick={() =>
                            setCurrentPage('system-logs')
                        }
                    >
                        System Logs
                    </div>
                </nav>

                <button
                    onClick={handleLogout}
                    style={styles.sidebarLogout}
                >
                    Logout
                </button>
            </aside>

            <main style={styles.main}>
                {currentPage === 'uavs' ? (
                    <UavPage />
                ) : currentPage === 'missions' ? (
                    <MissionPage />
                ) : currentPage === 'telemetry' ? (
                    <TelemetryPage />
                ) : currentPage === 'health' ? (
                    <HealthPage />
                ) : currentPage === 'alerts' ? (
                    <AlertPage />
                ) : currentPage === 'maintenance' ? (
                    <MaintenancePage />
                ) : currentPage === 'flight-history' ? (
                    <FlightHistoryPage />
                ) : currentPage === 'ai-predictions' ? (
                    <AIPredictionPage />
                ) : currentPage === 'system-logs' ? (
                    <SystemLogsPage />
                ) : (
                    <>
                        <header style={styles.header}>
                            <div>
                                <h1>
                                    Admin Dashboard
                                </h1>

                                <p>
                                    UAV Flight Operations Overview
                                </p>
                            </div>

                            <div style={styles.headerUser}>
                                {user.full_name || user.email}
                            </div>
                        </header>

                        <section style={styles.cards}>
                            <div style={styles.card}>
                                <span>
                                    Total UAVs
                                </span>

                                <strong>
                                    {dashboardStats.totalUavs}
                                </strong>
                            </div>

                            <div style={styles.card}>
                                <span>
                                    Active Missions
                                </span>

                                <strong>
                                    {dashboardStats.activeMissions}
                                </strong>
                            </div>

                            <div style={styles.card}>
                                <span>
                                    Active Alerts
                                </span>

                                <strong>
                                    {dashboardStats.activeAlerts}
                                </strong>
                            </div>

                            <div style={styles.card}>
                                <span>
                                    Maintenance Due
                                </span>

                                <strong>
                                    {dashboardStats.maintenanceDue}
                                </strong>
                            </div>
                        </section>

                        {highRiskPredictions.length > 0 && (
                            <section style={styles.notificationPanel}>
                                <div style={styles.notificationHeader}>
                                    <div>
                                        <h2 style={styles.notificationTitle}>
                                            ⚠️ High-Risk AI Prediction
                                        </h2>

                                        <p style={styles.notificationSubtitle}>
                                            Immediate attention is recommended
                                            for the following UAVs.
                                        </p>
                                    </div>

                                    <span style={styles.riskBadge}>
                                        {highRiskPredictions.length} HIGH RISK
                                    </span>
                                </div>

                                <div>
                                    {highRiskPredictions.map((prediction) => (
                                        <div
                                            key={prediction.prediction_id}
                                            style={styles.riskItem}
                                        >
                                            <div>
                                                <strong>
                                                    UAV ID:{' '}
                                                    {prediction.uav_id}
                                                </strong>

                                                <p style={styles.riskPrediction}>
                                                    Prediction:{' '}
                                                    {prediction.prediction}
                                                </p>

                                                <p style={styles.riskAction}>
                                                    Recommended Action:{' '}
                                                    {prediction.recommended_action ||
                                                        'Immediate inspection recommended'}
                                                </p>
                                            </div>

                                            <div style={styles.riskScore}>
                                                <span>
                                                    Risk Score
                                                </span>

                                                <strong>
                                                    {prediction.risk_score}%
                                                </strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section style={styles.panel}>
                            <div style={styles.panelHeader}>
                                <div>
                                    <h2>
                                        Registered UAVs
                                    </h2>

                                    <p>
                                        Current UAV fleet status
                                    </p>
                                </div>

                                <button
                                    onClick={loadUavs}
                                    style={styles.loadButton}
                                >
                                    Load UAV Data
                                </button>
                            </div>

                            {uavs.length === 0 ? (
                                <div style={styles.empty}>
                                    Click "Load UAV Data" to view
                                    registered UAVs.
                                </div>
                            ) : (
                                <div style={styles.uavGrid}>
                                    {uavs.map((uav) => (
                                        <div
                                            key={uav.uav_id}
                                            style={styles.uavCard}
                                        >
                                            <h3>
                                                {uav.uav_name}
                                            </h3>

                                            <p>
                                                UAV ID: {uav.uav_id}
                                            </p>

                                            <p>
                                                Status:{' '}
                                                <strong>
                                                    {uav.status}
                                                </strong>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

function DroneCard({ drone, onPurchase, purchased }) {
    return (
        <div style={styles.droneCard}>
            <img
                src={drone.image}
                alt={drone.name}
                style={styles.droneImage}
            />

            <div style={styles.droneContent}>
                <span style={styles.droneCategory}>
                    {drone.category}
                </span>

                <h3 style={styles.droneName}>
                    {drone.name}
                </h3>

                <p style={styles.droneDescription}>
                    {drone.description}
                </p>

                <div style={styles.specifications}>
                    <div style={styles.specificationItem}>
                        <span>Flight Time</span>
                        <strong>{drone.flightTime}</strong>
                    </div>

                    <div style={styles.specificationItem}>
                        <span>Range</span>
                        <strong>{drone.range}</strong>
                    </div>

                    <div style={styles.specificationItem}>
                        <span>Camera</span>
                        <strong>{drone.camera}</strong>
                    </div>
                </div>

                <div style={styles.droneFooter}>
                    <div>
                        <span style={styles.priceLabel}>
                            Price
                        </span>

                        <strong style={styles.dronePrice}>
                            ₹{drone.price.toLocaleString('en-IN')}
                        </strong>
                    </div>

                    <button
                        style={
                            purchased
                                ? styles.purchasedButton
                                : styles.buyButton
                        }
                        onClick={() => onPurchase(drone)}
                        disabled={purchased}
                    >
                        {purchased ? 'Purchased' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    app: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f6f8'
    },

    loginPage: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '25px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #172033, #314b70)'
    },

    loginBox: {
        width: '390px',
        padding: '35px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
        boxSizing: 'border-box'
    },

    loginIcon: {
        width: '55px',
        height: '55px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '14px',
        backgroundColor: '#172033',
        color: 'white',
        fontSize: '27px',
        marginBottom: '18px'
    },

    title: {
        margin: '0 0 8px 0',
        color: '#172033',
        fontSize: '25px',
        lineHeight: '1.3'
    },

    subtitle: {
        color: '#667085',
        margin: '0 0 22px 0',
        fontSize: '14px',
        lineHeight: '1.5'
    },

    loginTag: {
        display: 'inline-block',
        padding: '7px 12px',
        backgroundColor: '#eef4ff',
        color: '#315b9b',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '20px'
    },

    loginHeading: {
        margin: '0 0 8px 0',
        color: '#172033',
        fontSize: '22px'
    },

    loginDescription: {
        color: '#667085',
        fontSize: '14px',
        marginBottom: '24px'
    },

    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#344054',
        marginBottom: '7px'
    },

    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '18px',
        boxSizing: 'border-box',
        border: '1px solid #d0d5dd',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none'
    },

    loginButton: {
        width: '100%',
        padding: '13px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#172033',
        color: 'white',
        fontSize: '15px',
        fontWeight: 'bold'
    },

    errorMessage: {
        color: '#d92d20',
        backgroundColor: '#fff1f0',
        padding: '10px',
        borderRadius: '6px',
        fontSize: '13px',
        marginTop: '15px'
    },

    loginFooter: {
        textAlign: 'center',
        color: '#98a2b3',
        fontSize: '12px',
        marginTop: '25px',
        marginBottom: 0
    },

    sidebar: {
        width: '240px',
        backgroundColor: '#172033',
        color: 'white',
        padding: '25px 15px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },

    logo: {
        margin: '0 0 12px 0'
    },

    adminBadge: {
        display: 'inline-block',
        width: 'fit-content',
        padding: '5px 9px',
        backgroundColor: '#314b70',
        borderRadius: '5px',
        fontSize: '10px',
        fontWeight: 'bold',
        marginBottom: '20px',
        letterSpacing: '0.5px'
    },

    userBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '12px',
        marginBottom: '20px',
        backgroundColor: '#202b40',
        borderRadius: '8px',
        overflowWrap: 'anywhere'
    },

    menu: {
        padding: '12px 15px',
        marginBottom: '5px',
        borderRadius: '6px',
        cursor: 'pointer'
    },

    activeMenu: {
        padding: '12px 15px',
        marginBottom: '5px',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: '#2f405d'
    },

    sidebarLogout: {
        marginTop: 'auto',
        padding: '11px',
        border: '1px solid #52627d',
        borderRadius: '7px',
        backgroundColor: 'transparent',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    main: {
        flex: 1,
        padding: '30px'
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
    },

    headerUser: {
        fontWeight: 'bold'
    },

    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '25px'
    },

    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },

    notificationPanel: {
        backgroundColor: '#fff5f5',
        border: '1px solid #ffcccc',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },

    notificationHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },

    notificationTitle: {
        margin: '0 0 5px 0',
        color: '#b42318'
    },

    notificationSubtitle: {
        margin: 0,
        color: '#666'
    },

    riskBadge: {
        backgroundColor: '#d92d20',
        color: 'white',
        padding: '7px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    riskItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        marginTop: '10px',
        backgroundColor: 'white',
        border: '1px solid #f0d0d0',
        borderRadius: '7px'
    },

    riskPrediction: {
        margin: '7px 0',
        color: '#444'
    },

    riskAction: {
        margin: 0,
        color: '#666'
    },

    riskScore: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: '20px',
        minWidth: '90px'
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

    empty: {
        padding: '30px',
        textAlign: 'center',
        color: '#777'
    },

    uavGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px'
    },

    uavCard: {
        padding: '18px',
        border: '1px solid #e4e7ec',
        borderRadius: '8px'
    },

    userPortal: {
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        fontFamily: 'Arial, sans-serif'
    },

    userHeader: {
        backgroundColor: '#172033',
        color: 'white',
        padding: '22px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
    },

    userPortalTitle: {
        margin: 0,
        fontSize: '25px'
    },

    userPortalSubtitle: {
        margin: '7px 0 0 0',
        color: '#c8d2e3',
        fontSize: '14px'
    },

    userHeaderRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '25px'
    },

    userIdentity: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        textAlign: 'right'
    },

    logoutButton: {
        padding: '10px 17px',
        border: '1px solid #71809a',
        borderRadius: '7px',
        backgroundColor: 'transparent',
        color: 'white',
        cursor: 'pointer'
    },

    userMain: {
        padding: '35px 40px'
    },

    welcomeCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '14px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
        marginBottom: '25px'
    },

    welcomeIcon: {
        width: '70px',
        height: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '15px',
        backgroundColor: '#eaf1ff',
        fontSize: '35px'
    },

    comingSoonText: {
        color: '#667085',
        lineHeight: '1.6'
    },

    userNavigation: {
        display: 'flex',
        gap: '12px',
        marginBottom: '25px',
        flexWrap: 'wrap'
    },

    userNavButton: {
        padding: '12px 20px',
        border: '1px solid #d0d5dd',
        borderRadius: '8px',
        backgroundColor: 'white',
        color: '#344054',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    userNavActive: {
        padding: '12px 20px',
        border: '1px solid #172033',
        borderRadius: '8px',
        backgroundColor: '#172033',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    userCards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '22px',
        marginBottom: '30px'
    },

    userCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.05)'
    },

    userCardIcon: {
        fontSize: '30px',
        marginBottom: '12px'
    },

    primaryButton: {
        padding: '11px 18px',
        border: 'none',
        borderRadius: '7px',
        backgroundColor: '#172033',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    outlineButton: {
        padding: '10px 18px',
        border: '1px solid #172033',
        borderRadius: '7px',
        backgroundColor: 'white',
        color: '#172033',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    successMessage: {
        backgroundColor: '#ecfdf3',
        border: '1px solid #abefc6',
        color: '#067647',
        padding: '13px 17px',
        borderRadius: '8px',
        marginBottom: '25px',
        fontWeight: 'bold'
    },

    sectionPanel: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '14px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.05)',
        marginBottom: '30px'
    },

    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        gap: '15px'
    },

    droneGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '22px'
    },

    droneCard: {
        border: '1px solid #e4e7ec',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 3px 10px rgba(0,0,0,0.04)'
    },

    droneImage: {
        width: '100%',
        height: '210px',
        objectFit: 'cover',
        display: 'block'
    },

    droneContent: {
        padding: '18px'
    },

    droneCategory: {
        display: 'inline-block',
        color: '#315b9b',
        backgroundColor: '#eef4ff',
        padding: '5px 9px',
        borderRadius: '15px',
        fontSize: '11px',
        fontWeight: 'bold',
        marginBottom: '10px'
    },

    droneName: {
        margin: '0 0 10px 0',
        color: '#172033',
        fontSize: '20px'
    },

    droneDescription: {
        color: '#667085',
        fontSize: '13px',
        lineHeight: '1.5',
        minHeight: '58px'
    },

    specifications: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        margin: '18px 0',
        padding: '14px 0',
        borderTop: '1px solid #eaecf0',
        borderBottom: '1px solid #eaecf0'
    },

    specificationItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },

    droneFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px'
    },

    priceLabel: {
        display: 'block',
        color: '#667085',
        fontSize: '12px',
        marginBottom: '4px'
    },

    dronePrice: {
        display: 'block',
        color: '#172033',
        fontSize: '19px'
    },

    buyButton: {
        padding: '11px 15px',
        border: 'none',
        borderRadius: '7px',
        backgroundColor: '#172033',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    purchasedButton: {
        padding: '11px 15px',
        border: 'none',
        borderRadius: '7px',
        backgroundColor: '#12b76a',
        color: 'white',
        cursor: 'not-allowed',
        fontWeight: 'bold'
    },

    purchaseGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '22px'
    },

    purchaseCard: {
        display: 'flex',
        gap: '20px',
        border: '1px solid #e4e7ec',
        borderRadius: '12px',
        padding: '15px',
        backgroundColor: '#fcfcfd'
    },

    purchaseImage: {
        width: '180px',
        height: '140px',
        objectFit: 'cover',
        borderRadius: '8px'
    },

    purchaseDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
    },

    purchaseStatus: {
        display: 'inline-block',
        width: 'fit-content',
        padding: '5px 9px',
        backgroundColor: '#ecfdf3',
        color: '#067647',
        borderRadius: '15px',
        fontSize: '11px',
        fontWeight: 'bold'
    },

    price: {
        color: '#172033',
        fontSize: '18px'
    },

    emptyPurchase: {
        textAlign: 'center',
        padding: '50px 20px',
        color: '#667085'
    },

    emptyIcon: {
        fontSize: '50px',
        marginBottom: '15px'
    }
};

export default App;