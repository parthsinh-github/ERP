import React from 'react';
import Sidebar from '../Sidebar';
import Navbar from './Navbar';
import { Menu } from 'lucide-react';

const Layout = ({ isOpen, toggleSidebar, children }) => {
  const containerStyle = {
    display: 'flex',
    transition: 'margin-left 0.3s ease-in-out',
    marginLeft: isOpen ? '200px' : '0',
  };

  const contentStyle = {
    flex: 1,
    padding: '20px',
  };

  const buttonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div style={contentStyle}>
        <button onClick={toggleSidebar} style={buttonStyle}>
          <Menu size={28} />
        </button>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
