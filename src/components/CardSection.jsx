import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const CardsSection = () => {
    const { role, id } = useParams();   
    

    const navigate = useNavigate();

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        marginTop: "40px",
        flexWrap: "wrap",
        padding: "20px",
    };

    const baseCardStyle = {
        width: "300px",
        height: "180px",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#1a1a1a",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        padding: "20px",
        textAlign: "center",
    };

    const cards = [
        {
            label: "ID Card",
            route: "/id-card",
            style: {
                background: "linear-gradient(135deg, #bbdefb, #e3f2fd)",
                borderLeft: "6px solid #1976d2",
                color: "#0d47a1",
                fontFamily: "monospace",
            },
            icon: "🪪",
        },
        {
            label: "Leave Request",
         route: `/${role}/${id}/leaverequest`,  // but role is undefined
            style: {
                background: "linear-gradient(135deg, #ffcdd2, #ffebee)",
                borderLeft: "6px solid #d32f2f",
                color: "#b71c1c",
                fontFamily: "'Segoe UI', sans-serif",
            },
            icon: "📝",
        },
        {
            label: "Documents Request",
         route: `/${role}/${id}/Document`,  // but role is undefined
            style: {
                background: "linear-gradient(135deg, #ffcdd2, #ffebee)",
                borderLeft: "6px solid #d32f2f",
                color: "#b71c1c",
                fontFamily: "'Segoe UI', sans-serif",
            },
            icon: "📝",
        },
        {
            label: "Form",
            route: "/form",
            style: {
                background: "linear-gradient(135deg, #c8e6c9, #e8f5e9)",
                borderLeft: "6px solid #388e3c",
                color: "#1b5e20",
                fontFamily: "'Segoe UI', sans-serif",
            },
            icon: "📋",
        },
    ];

    return (
        <div style={containerStyle}>
            {cards.map((card) => (
                <div
                    key={card.label}
                    style={{ ...baseCardStyle, ...card.style }}
                    onClick={() => navigate(card.route)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.1)";
                    }}
                >
                    <div style={{ fontSize: "42px", marginBottom: "10px" }}>{card.icon}</div>
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>{card.label}</div>
                </div>
            ))}
        </div>
    );
};

export default CardsSection;
