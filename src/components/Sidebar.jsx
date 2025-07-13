import React, { useState, useEffect } from 'react';
import { X, Home, BookOpen, FileText, BarChart3, Users, Settings, ChevronRight, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    
  const { user } = useSelector((state) => state.auth);

    const [activeItem, setActiveItem] = useState('dashboard');
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mounted, setMounted] = useState(false);
    

    const {role ,id }= useParams();

    useEffect(() => {
        setMounted(true);
    }, []);

    const sidebarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: isOpen ? '280px' : '0',
        height: '100vh',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)',
        color: 'white',
        overflowX: 'hidden',
        overflowY: 'auto',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        padding: isOpen ? '0' : '0',
        boxShadow: isOpen ? '8px 0 24px rgba(0,0,0,0.3)' : 'none',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        borderRight: isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    };

    const headerStyle = {
        padding: '24px 24px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(10px)',
    };

    const logoStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #60a5fa, #34d399)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.025em',
    };

    const closeButtonStyle = {
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const navStyle = {
        padding: '24px 0',
    };

    const sectionTitleStyle = {
        fontSize: '0.75rem',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.6)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        padding: '0 24px',
        marginBottom: '12px',
    };

    const getItemStyle = (isActive, isHovered) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        margin: '2px 12px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        textDecoration: 'none',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        background: isActive 
            ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(52, 211, 153, 0.2))'
            : isHovered 
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        boxShadow: isActive ? '0 4px 12px rgba(96, 165, 250, 0.3)' : 'none',
        border: isActive ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent',
    });

    const iconStyle = {
        marginRight: '16px',
        fontSize: '20px',
        transition: 'transform 0.2s ease',
    };

    const labelStyle = {
        fontSize: '0.95rem',
        fontWeight: '500',
        flex: 1,
        letterSpacing: '-0.025em',
    };

    const chevronStyle = (isHovered) => ({
        transition: 'transform 0.2s ease',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        opacity: isHovered ? 1 : 0,
    });

    const userInfoStyle = {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    };

    const userAvatarStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #60a5fa, #34d399)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        fontSize: '1.2rem',
        fontWeight: '600',
    };

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            route: '/',
            section: 'main'
        },
        {
            id: 'exam',
            label: 'Exam Panel',
            icon: BookOpen,
            route: `/${role}/${id}/exam`,
            section: 'academic'
        },
        {
            id: 'results',
            label: 'Exam Results',
            icon: BarChart3,
            route: '/jobs',
            section: 'academic'
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: FileText,
            route: `/${role}/${id}/report`,
            section: 'management'
        },
        {
            id: 'users',
            label: 'Users',
            icon: Users,
            route: `/${role}/${id}/AllUsers`,
            section: 'management'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            route: '/login',
            section: 'system'
        }
    ];

    const handleItemClick = (item) => {
        setActiveItem(item.id);
        
        // In a real app, you would use navigate(item.route) here
        console.log(`Navigating to: ${item.route}`);
        
        // For demo purposes, show an alert
        setTimeout(() => {
            alert(`Would navigate to: ${item.route}`);
        }, 200);
    };

    const groupedItems = menuItems.reduce((acc, item) => {
        if (!acc[item.section]) {
            acc[item.section] = [];
        }
        acc[item.section].push(item);
        return acc;
    }, {});

    const sectionNames = {
        main: 'Overview',
        academic: 'Academic',
        management: 'Management',
        system: 'System'
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        opacity: mounted ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    onClick={toggleSidebar}
                />
            )}
            
            <div style={sidebarStyle}>
                {isOpen && (
                    <>
                        {/* Header */}
                        <div style={headerStyle}>
                            <div style={logoStyle}>Dashboard</div>
                            <button
                                onClick={toggleSidebar}
                                style={closeButtonStyle}
                                aria-label="Close sidebar"
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav style={navStyle}>
                            {Object.entries(groupedItems).map(([section, items]) => (
                                <div key={section} style={{ marginBottom: '24px' }}>
                                    <div style={sectionTitleStyle}>
                                        {sectionNames[section]}
                                    </div>
                                    {items.map((item) => {
                                        const IconComponent = item.icon;
                                        const isActive = activeItem === item.id;
                                        const isHovered = hoveredItem === item.id;
                                        
                                        return (
                                            <div
                                                key={item.id}
                                                style={getItemStyle(isActive, isHovered)}
                                                onClick={() => handleItemClick(item)}
                                                onMouseEnter={() => setHoveredItem(item.id)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                            >
                                                {/* Background glow effect */}
                                                {isActive && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(52, 211, 153, 0.1))',
                                                            borderRadius: '12px',
                                                            zIndex: -1,
                                                        }}
                                                    />
                                                )}
                                                
                                                <IconComponent 
                                                    size={20} 
                                                    style={{
                                                        ...iconStyle,
                                                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                                    }}
                                                />
                                                <span style={labelStyle}>{item.label}</span>
                                                <ChevronRight 
                                                    size={16} 
                                                    style={chevronStyle(isHovered)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </nav>

                        {/* User Info */}
                        <div style={userInfoStyle}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={userAvatarStyle}>
                                    {role?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                        {role?.charAt(0).toUpperCase() + role?.slice(1) || 'User'}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                        ID: {id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default React.memo(Sidebar);