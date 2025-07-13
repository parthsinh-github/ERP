import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CardsSection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [clickedCard, setClickedCard] = useState(null);

        const navigate = useNavigate();

    // Mock params for demo - replace with actual useParams() in your app
 
    const {role,id} = useParams();

    useEffect(() => {
        setMounted(true);
    }, []);

    const containerStyle = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    };

    const titleStyle = {
        fontSize: "2.5rem",
        fontWeight: "700",
        color: "white",
        marginBottom: "1rem",
        textAlign: "center",
        background: "linear-gradient(135deg, #ffffff, #f8f9ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };

    const subtitleStyle = {
        fontSize: "1.1rem",
        color: "rgba(255, 255, 255, 0.8)",
        marginBottom: "3rem",
        textAlign: "center",
        maxWidth: "600px",
    };

    const cardsContainerStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2rem",
        maxWidth: "1200px",
        width: "100%",
    };

    const getCardStyle = (index, isHovered, isClicked) => ({
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "2rem",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: isClicked
            ? "translateY(-8px) scale(0.98)"
            : isHovered 
                ? "translateY(-12px) scale(1.02)" 
                : mounted ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
        opacity: mounted ? 1 : 0,
        boxShadow: isHovered
            ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 10px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transitionDelay: mounted ? `${index * 0.1}s` : "0s",
        position: "relative",
        overflow: "hidden",
    });

    const cardContentStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
    };

    const iconContainerStyle = (gradient) => ({
        width: "80px",
        height: "80px",
        borderRadius: "20px",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.5rem",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    });

    const iconStyle = {
        fontSize: "2.5rem",
        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
    };

    const labelStyle = {
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#2d3748",
        marginBottom: "0.5rem",
        letterSpacing: "-0.025em",
    };

    const descriptionStyle = {
        fontSize: "0.95rem",
        color: "#64748b",
        lineHeight: "1.6",
        marginBottom: "1.5rem",
    };

    const statusStyle = (gradient) => ({
        fontSize: "0.8rem",
        padding: "0.4rem 1rem",
        borderRadius: "20px",
        background: gradient,
        color: "white",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    });

    const shimmerStyle = (isHovered) => ({
        position: "absolute",
        top: 0,
        left: isHovered ? "100%" : "-100%",
        width: "100%",
        height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
        transition: "left 0.5s ease-in-out",
        zIndex: 1,
    });

    const cards = [
        {
            label: "ID Card",
            description: "View and manage your digital identification card",
            route: "/id-card",
            icon: "🪪",
            gradient: "linear-gradient(135deg, #667eea, #764ba2)",
            status: "Active",
            statusGradient: "linear-gradient(135deg, #10b981, #059669)",
        },
        {
            label: "Leave Request",
            description: "Submit and track your leave applications",
            route: `/${role}/${id}/leaverequest`,
            icon: "📅",
            gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
            status: "Available",
            statusGradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        },
        {
            label: "Documents Request",
            description: "Request and manage official documents",
            route: `/${role}/${id}/Document`,
            icon: "📄",
            gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
            status: "Ready",
            statusGradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
        },
        {
            label: "Form",
            description: "Access and fill out required forms",
            route: "/form",
            icon: "📋",
            gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
            status: "Updated",
            statusGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        },
    ];

   
    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Dashboard</h1>
            <p style={subtitleStyle}>
                Welcome back! Choose from the options below to manage your requests and documents.
            </p>
            
            <div style={cardsContainerStyle}>
                {cards.map((card, index) => (
                    <div
                        key={card.label}
                        style={getCardStyle(index, hoveredCard === index, clickedCard === index)}
                         onClick={() => navigate(card.route)}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div style={shimmerStyle(hoveredCard === index)} />
                        
                        <div style={cardContentStyle}>
                            <div style={iconContainerStyle(card.gradient)}>
                                <div style={iconStyle}>{card.icon}</div>
                            </div>
                            <h3 style={labelStyle}>{card.label}</h3>
                            <p style={descriptionStyle}>{card.description}</p>
                            <div style={statusStyle(card.statusGradient)}>{card.status}</div>
                        </div>
                        
                        {/* Decorative background gradient */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "4px",
                                background: card.gradient,
                                opacity: hoveredCard === index ? 1 : 0.7,
                                transition: "opacity 0.3s ease",
                            }}
                        />
                        
                        {/* Floating particles effect */}
                        {hoveredCard === index && (
                            <>
                                <div style={{
                                    position: "absolute",
                                    top: "20%",
                                    right: "10%",
                                    width: "4px",
                                    height: "4px",
                                    background: "rgba(255, 255, 255, 0.6)",
                                    borderRadius: "50%",
                                    animation: "float 3s ease-in-out infinite",
                                }} />
                                <div style={{
                                    position: "absolute",
                                    bottom: "30%",
                                    left: "15%",
                                    width: "3px",
                                    height: "3px",
                                    background: "rgba(255, 255, 255, 0.4)",
                                    borderRadius: "50%",
                                    animation: "float 2s ease-in-out infinite reverse",
                                }} />
                            </>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Add floating animation keyframes */}
            <style>
                {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                `}
            </style>
        </div>
    );
};

export default CardsSection;