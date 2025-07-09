import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';

const sidebarStyle = (isOpen) => (
    
    {
    position: 'fixed',
    top: 0,
    left: 0,
    width: isOpen ? '170px' : '0',
    height: '100vh',
    background: '#333',
    color: 'white',
    overflowX: 'hidden',
    transition: 'width 0.3s ease-in-out',
    padding: isOpen ? '20px' : '0',
    boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.5)' : 'none',
    zIndex: 1000,
});
  
const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    marginBottom: '20px',
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',

};


const Sidebar = ({ isOpen, toggleSidebar }) => {
    
    const { role, id } = useParams(); // get dynamic params

    const navigate = useNavigate();
    
 const handleClickExam = () => {
    if (role && id) {
      navigate(`/${role}/${id}/exam`);
    } else {
      console.warn("Missing role or id in URL params.");
    }
  };

 const handleClickReport = () => {
    if (role && id) {
      navigate(`/${role}/${id}/report`);
    } else {
      console.warn("Missing role or id in URL params.");
    }
  };
 const handleClickUser = () => {
    if (role && id) {
      navigate(`/${role}/${id}/AllUsers`);
    } else {
      console.warn("Missing role or id in URL params.");
    }
  };

    return (
        <div style={sidebarStyle(isOpen)}>
            {isOpen && (
                <>
                    <button
                        onClick={toggleSidebar}
                        style={closeButtonStyle}
                        aria-label="Close sidebar"
                    >
                        <X size={28} />
                    </button>
                    <h2 style={{ marginBottom: '20px' }}>Menu</h2>
                    <nav role="navigation">
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                              
                            <li onClick={handleClickExam} style={{ marginBottom: '15px' ,  cursor: 'pointer'}}>
                                <Link to="/Exam" style={linkStyle}>Exam Panel</Link>
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <Link to="/jobs" style={linkStyle}>Exam Result</Link>
                            </li>
                            <li onClick={handleClickReport} style={{ marginBottom: '15px' ,  cursor: 'pointer'}}>
                                <Link to="/Report" style={linkStyle}>Reports</Link>
                            </li>
                            <li onClick={handleClickUser} style={{ marginBottom: '15px' }}>
                                <Link to="/AllUsers" style={linkStyle}>Users</Link>
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <Link to="/login" style={linkStyle}>Miscellaneous</Link>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default React.memo(Sidebar);
