import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Analytics.css";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Analytics = () => {
    const [totalItems, setTotalItems] = useState(0);
    const [expiringSoonCount, setExpiringSoonCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);
    const [compartmentChartData, setCompartmentChartData] = useState({});
    const [mostUsed, setMostUsed] = useState([]);
    const [leastUsed, setLeastUsed] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/analytics");
                const data = await res.json();
                setTotalItems(data.totalItems);
                setExpiringSoonCount(data.expiringSoon);
                setExpiredCount(data.expired);

                const labels = Object.keys(data.byCompartment).map((label) =>
                    label.replace(/([A-Z])/g, " $1").trim()
                );
                const values = Object.values(data.byCompartment);

                setCompartmentChartData({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
                        },
                    ],
                });
            } catch (err) {
                console.warn("⚠️ Analytics API not reachable — fallback to empty data.");
                setTotalItems(0);
                setExpiringSoonCount(0);
                setExpiredCount(0);
                setCompartmentChartData({
                    labels: [],
                    datasets: [{ data: [] }]
                });
            }
        };

        const fetchItems = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/items");
                const data = await res.json();
                const items = Array.isArray(data.data) ? data.data : [];

                const sorted = [...items].sort((a, b) => {
                    const expiryA = new Date(a.expirationDate);
                    const expiryB = new Date(b.expirationDate);
                    return expiryA - expiryB || parseInt(a.quantity) - parseInt(b.quantity);
                });

                setMostUsed(sorted.slice(0, 4));
                setLeastUsed(sorted.slice(-4));
            } catch (err) {
                console.warn("⚠️ Items API not reachable — fallback to empty list.");
                setMostUsed([]);
                setLeastUsed([]);
            }
        };

        fetchAnalytics();
        fetchItems();
    }, []);

    const getDaysUntilExpiration = (expirationDate) => {
        if (!expirationDate) return null;
        const today = new Date();
        const expiry = new Date(expirationDate);
        return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="container">
            <h2>Analytics Dashboard</h2>

            {/* Summary Box */}
            <div className="summary-box">
                <p><strong>Total Items:</strong> {totalItems}</p>
                <p><strong>Expiring Soon (≤3 days):</strong> {expiringSoonCount}</p>
                <p><strong>Expired Items:</strong> {expiredCount}</p>
            </div>

            {/* Items by Compartment (Pie Chart) */}
            <section>
                <h3>Items by Compartment</h3>
                {totalItems > 0 ? (
                    <Pie data={compartmentChartData} />
                ) : (
                    <p className="center-text">No items in compartments.</p>
                )}
            </section>

            {/* Most Used Items */}
            <section>
                <h3>Most Used Items:</h3>
                <div className="item-grid">
                    {mostUsed.map((item) => (
                        <div className="item-card" key={item.id}>
                            <div className="item-thumbnail">
                                <img src={item.imageUrl} alt={item.name} />
                            </div>
                            <p><strong>{item.name}</strong></p>
                            <p>Expires in: {getDaysUntilExpiration(item.expirationDate) < 0 ? "Expired" : `${getDaysUntilExpiration(item.expirationDate)} days`}</p>
                            <p>Qty: {item.quantity}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Least Used Items */}
            <section>
                <h3>Least Used Items:</h3>
                <div className="item-grid">
                    {leastUsed.map((item) => (
                        <div className="item-card" key={item.id}>
                            <div className="item-thumbnail">
                                <img src={item.imageUrl} alt={item.name} />
                            </div>
                            <p><strong>{item.name}</strong></p>
                            <p>Expires in: {getDaysUntilExpiration(item.expirationDate) < 0 ? "Expired" : `${getDaysUntilExpiration(item.expirationDate)} days`}</p>
                            <p>Qty: {item.quantity}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Navigation Links */}
            <div className="analytics-links">
                <Link to="/waste-pattern" className="analytics-btn">View Waste Pattern</Link>
                <Link to="/shopping-recommendation" className="analytics-btn">View Shopping Recommendations</Link>
            </div>
        </div>
    );
};

export default Analytics;