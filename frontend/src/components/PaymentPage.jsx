import React, { useEffect, useState } from 'react';

function PaymentPage() {
    const [drone, setDrone] = useState(null);
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('PENDING');
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        const savedDrone = localStorage.getItem('selectedDrone');
        const savedPaymentStatus = localStorage.getItem('paymentStatus');
        const savedOrderId = localStorage.getItem('orderId');

        if (savedDrone) {
            setDrone(JSON.parse(savedDrone));
        }

        if (savedPaymentStatus) {
            setPaymentStatus(savedPaymentStatus);
        }

        if (savedOrderId) {
            setOrderId(savedOrderId);
        } else {
            const newOrderId =
                'UAV-' + Date.now().toString().slice(-8);

            localStorage.setItem('orderId', newOrderId);
            setOrderId(newOrderId);
        }
    }, []);

    const handleScreenshotChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setMessage('Please select a valid image file.');
            setPaymentScreenshot(null);
            return;
        }

        setPaymentScreenshot(file);
        setMessage('');
    };

    const handleSubmitPayment = (event) => {
        event.preventDefault();

        if (!paymentScreenshot) {
            setMessage('Please upload your payment screenshot first.');
            return;
        }

        localStorage.setItem('paymentStatus', 'SUBMITTED');

        setPaymentStatus('SUBMITTED');

        setMessage(
            'Payment screenshot submitted successfully. The administrator will verify your payment.'
        );
    };

    const handleCancelPurchase = () => {
        localStorage.removeItem('selectedDrone');
        localStorage.removeItem('paymentStatus');
        localStorage.removeItem('orderId');

        setDrone(null);
        setPaymentScreenshot(null);
        setPaymentStatus('PENDING');
        setOrderId('');
        setMessage('Purchase details cleared.');
    };

    if (!drone) {
        return (
            <div style={styles.page}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Payments</h1>

                    <p style={styles.subtitle}>
                        Complete payment for your selected drone
                    </p>
                </div>

                <div style={styles.emptyCard}>
                    <div style={styles.emptyIcon}>🛒</div>

                    <h2 style={styles.emptyTitle}>
                        No Purchase Found
                    </h2>

                    <p style={styles.emptyText}>
                        You have not selected a drone for purchase yet.
                        Please visit Browse Drones and click Buy Now.
                    </p>
                </div>
            </div>
        );
    }

    const dronePrice = Number(drone.price || 0);

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>Payments</h1>

                <p style={styles.subtitle}>
                    Complete your drone payment securely
                </p>
            </div>

            <div style={styles.content}>
                <section style={styles.orderCard}>
                    <h2 style={styles.sectionTitle}>
                        Order Summary
                    </h2>

                    <div style={styles.droneSection}>
                        <img
                            src={drone.image}
                            alt={drone.name || 'Selected drone'}
                            style={styles.droneImage}
                        />

                        <div style={styles.droneDetails}>
                            <h2 style={styles.droneName}>
                                {drone.name || 'Selected Drone'}
                            </h2>

                            <p style={styles.detailText}>
                                <strong>Order ID:</strong>{' '}
                                {orderId}
                            </p>

                            <p style={styles.detailText}>
                                <strong>Category:</strong>{' '}
                                {drone.category || 'Consumer Drone'}
                            </p>

                            {drone.specification && (
                                <p style={styles.detailText}>
                                    <strong>Specification:</strong>{' '}
                                    {drone.specification}
                                </p>
                            )}

                            <p style={styles.price}>
                                ₹{dronePrice.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>

                    <div style={styles.totalBox}>
                        <span>Total Amount</span>

                        <strong style={styles.totalAmount}>
                            ₹{dronePrice.toLocaleString('en-IN')}
                        </strong>
                    </div>

                    <button
                        type="button"
                        onClick={handleCancelPurchase}
                        style={styles.cancelButton}
                    >
                        Cancel Purchase
                    </button>
                </section>

                <section style={styles.paymentCard}>
                    <h2 style={styles.sectionTitle}>
                        Make Payment
                    </h2>

                    <p style={styles.instruction}>
                        Use the UPI ID below to complete the payment.
                        After making the payment, upload the payment
                        screenshot for verification.
                    </p>

                    <div style={styles.demoNotice}>
                        <strong>Demo Payment Mode</strong>
                        <p>
                            This is a project demonstration. No real
                            payment will be processed through this page.
                        </p>
                    </div>

                    <div style={styles.qrContainer}>
                        <div style={styles.qrCode}>
                            <div style={styles.qrInner}>
                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>

                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>

                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>

                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>

                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>

                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>

                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>

                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>

                                <div style={styles.qrSquare}>
                                    <span>■</span>
                                </div>
                            </div>
                        </div>

                        <p style={styles.qrNote}>
                            Demo QR Code
                        </p>
                    </div>

                    <div style={styles.upiBox}>
                        <div>
                            <span style={styles.smallLabel}>
                                UPI ID
                            </span>

                            <strong style={styles.upiText}>
                                uavsystem@upi
                            </strong>
                        </div>

                        <span style={styles.copyText}>
                            UPI
                        </span>
                    </div>

                    <div style={styles.paymentInfo}>
                        <span>Amount to Pay</span>

                        <strong>
                            ₹{dronePrice.toLocaleString('en-IN')}
                        </strong>
                    </div>

                    <form onSubmit={handleSubmitPayment}>
                        <label style={styles.uploadLabel}>
                            Upload Payment Screenshot
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            style={styles.fileInput}
                        />

                        {paymentScreenshot && (
                            <div style={styles.fileBox}>
                                <span>📎</span>

                                <span>
                                    {paymentScreenshot.name}
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            style={
                                paymentStatus === 'SUBMITTED'
                                    ? styles.submittedButton
                                    : styles.submitButton
                            }
                            disabled={paymentStatus === 'SUBMITTED'}
                        >
                            {paymentStatus === 'SUBMITTED'
                                ? 'Payment Submitted'
                                : 'Submit Payment Screenshot'}
                        </button>
                    </form>

                    {message && (
                        <div
                            style={
                                message.includes('successfully')
                                    ? styles.successMessage
                                    : styles.errorMessage
                            }
                        >
                            {message}
                        </div>
                    )}

                    <div style={styles.statusBox}>
                        <span>Payment Status</span>

                        <strong
                            style={
                                paymentStatus === 'SUBMITTED'
                                    ? styles.submittedStatus
                                    : styles.pendingStatus
                            }
                        >
                            {paymentStatus === 'SUBMITTED'
                                ? 'SCREENSHOT SUBMITTED'
                                : 'PAYMENT PENDING'}
                        </strong>
                    </div>
                </section>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        padding: '30px',
        backgroundColor: '#f4f6f8',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
    },

    header: {
        marginBottom: '25px'
    },

    title: {
        margin: 0,
        color: '#172033',
        fontSize: '30px'
    },

    subtitle: {
        marginTop: '8px',
        color: '#667085',
        fontSize: '15px'
    },

    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px',
        alignItems: 'start'
    },

    orderCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '14px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.06)'
    },

    paymentCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '14px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.06)'
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: '22px',
        color: '#172033',
        fontSize: '21px'
    },

    droneSection: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '25px',
        flexWrap: 'wrap'
    },

    droneImage: {
        width: '180px',
        height: '140px',
        objectFit: 'cover',
        borderRadius: '10px',
        border: '1px solid #e4e7ec'
    },

    droneDetails: {
        flex: 1,
        minWidth: '180px'
    },

    droneName: {
        margin: '0 0 12px 0',
        color: '#172033',
        fontSize: '20px'
    },

    detailText: {
        color: '#667085',
        fontSize: '14px',
        margin: '9px 0',
        lineHeight: '1.5'
    },

    price: {
        color: '#172033',
        fontWeight: 'bold',
        fontSize: '22px',
        marginTop: '15px',
        marginBottom: 0
    },

    totalBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px',
        backgroundColor: '#eef4ff',
        borderRadius: '10px',
        color: '#172033',
        fontSize: '16px'
    },

    totalAmount: {
        fontSize: '23px'
    },

    cancelButton: {
        width: '100%',
        marginTop: '15px',
        padding: '11px',
        border: '1px solid #d0d5dd',
        borderRadius: '8px',
        backgroundColor: 'white',
        color: '#667085',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    instruction: {
        color: '#667085',
        lineHeight: '1.6',
        fontSize: '14px'
    },

    demoNotice: {
        padding: '13px',
        backgroundColor: '#fff8e6',
        border: '1px solid #f5d98b',
        borderRadius: '8px',
        color: '#8a6116',
        fontSize: '13px',
        lineHeight: '1.5',
        marginTop: '18px',
        marginBottom: '20px'
    },

    demoNoticeParagraph: {
        marginBottom: 0
    },

    qrContainer: {
        textAlign: 'center',
        margin: '20px 0'
    },

    qrCode: {
        width: '170px',
        height: '170px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        border: '8px solid #172033',
        borderRadius: '8px',
        boxSizing: 'border-box'
    },

    qrInner: {
        width: '135px',
        height: '135px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        padding: '8px',
        backgroundColor: '#172033',
        boxSizing: 'border-box'
    },

    qrSquare: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        color: '#172033',
        fontSize: '25px'
    },

    qrNote: {
        color: '#98a2b3',
        fontSize: '12px',
        marginTop: '10px'
    },

    upiBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        border: '1px solid #d0d5dd',
        borderRadius: '8px',
        marginBottom: '15px',
        color: '#344054'
    },

    smallLabel: {
        display: 'block',
        color: '#667085',
        fontSize: '12px',
        marginBottom: '5px'
    },

    upiText: {
        color: '#172033',
        fontSize: '15px'
    },

    copyText: {
        padding: '6px 10px',
        backgroundColor: '#eef4ff',
        color: '#315b9b',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    paymentInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '25px',
        color: '#172033'
    },

    uploadLabel: {
        display: 'block',
        color: '#344054',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '10px'
    },

    fileInput: {
        width: '100%',
        padding: '12px',
        border: '1px solid #d0d5dd',
        borderRadius: '8px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        marginBottom: '10px',
        cursor: 'pointer'
    },

    fileBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px',
        backgroundColor: '#f2f4f7',
        borderRadius: '7px',
        color: '#475467',
        fontSize: '13px',
        overflowWrap: 'anywhere'
    },

    submitButton: {
        width: '100%',
        padding: '13px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#172033',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '15px'
    },

    submittedButton: {
        width: '100%',
        padding: '13px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#027a48',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        marginTop: '15px'
    },

    successMessage: {
        marginTop: '18px',
        padding: '12px',
        backgroundColor: '#ecfdf3',
        color: '#027a48',
        borderRadius: '8px',
        fontSize: '13px',
        lineHeight: '1.5'
    },

    errorMessage: {
        marginTop: '18px',
        padding: '12px',
        backgroundColor: '#fff1f0',
        color: '#d92d20',
        borderRadius: '8px',
        fontSize: '13px'
    },

    statusBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        marginTop: '22px',
        paddingTop: '18px',
        borderTop: '1px solid #e4e7ec',
        fontSize: '13px',
        flexWrap: 'wrap'
    },

    pendingStatus: {
        color: '#b54708'
    },

    submittedStatus: {
        color: '#027a48'
    },

    emptyCard: {
        backgroundColor: 'white',
        padding: '60px 30px',
        borderRadius: '14px',
        textAlign: 'center',
        boxShadow: '0 3px 12px rgba(0,0,0,0.06)'
    },

    emptyIcon: {
        fontSize: '50px',
        marginBottom: '15px'
    },

    emptyTitle: {
        color: '#172033',
        marginBottom: '10px'
    },

    emptyText: {
        color: '#667085',
        lineHeight: '1.6',
        maxWidth: '500px',
        margin: '0 auto'
    }
};

export default PaymentPage;