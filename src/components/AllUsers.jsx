import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useGetAllUsers from '../hooks/useGetAllUsers';
import { useNavigate, useParams } from 'react-router-dom';

const AllUsers = () => {
  useGetAllUsers();
  
  const navigate = useNavigate();     
  const { role, id } = useParams(); // get dynamic params

  const { all } = useSelector(state => state.user);
  const { user } = useSelector(state => state.auth);

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/users/all', {
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedUsers = {
    all: filteredUsers,
    admin: filteredUsers.filter(user => user.role === 'admin'),
    faculty: filteredUsers.filter(user => user.role === 'faculty'),
    student: filteredUsers.filter(user => user.role === 'student'),
  };

  const handleCardClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const getUsersToDisplay = () => {
    if (user?.role === 'student') {
      return groupedUsers.student;
    }
    return groupedUsers[activeTab] || groupedUsers.all;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👨‍💼';
      case 'faculty': return '👩‍🏫';
      case 'student': return '👨‍🎓';
      default: return '👤';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin-badge';
      case 'faculty': return 'role-badge faculty-badge';
      case 'student': return 'role-badge student-badge';
      default: return 'role-badge';
    }
  };

  const renderCards = () => {
    const usersToDisplay = getUsersToDisplay();
    
    return (
      <div className="users-grid">
        {usersToDisplay.map(userItem => (
          <div
            key={userItem._id}
            className={`user-card ${userItem.role}`}
            onClick={() => handleCardClick(userItem)}
          >
            <div className="user-avatar">
              <span className="avatar-icon">{getRoleIcon(userItem.role)}</span>
            </div>
            <div className="user-info">
              <h3 className="user-name">{userItem.name || userItem.fullName}</h3>
              <p className="user-email">{userItem.email}</p>
              <div className="user-meta">
                <span className={getRoleBadgeClass(userItem.role)}>
                  {userItem.role?.toUpperCase()}
                </span>
                {userItem.department && (
                  <span className="department-tag">{userItem.stream}</span>
                )}
              </div>
            </div>
            <div className="card-actions">
              <button className="view-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    const usersToDisplay = getUsersToDisplay();
    
    return (
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersToDisplay.map(userItem => (
              <tr key={userItem._id}>
                <td>
                  <div className="table-user-info">
                    <span className="table-avatar">{getRoleIcon(userItem.role)}</span>
                    <span>{userItem.name || userItem.fullName}</span>
                  </div>
                </td>
                <td>{userItem.email}</td>
                <td>
                  <span className={getRoleBadgeClass(userItem.role)}>
                    {userItem.role?.toUpperCase()}
                  </span>
                </td>
                <td>{userItem.stream || 'N/A'}</td>
                <td>{userItem.phoneNumber || 'N/A'}</td>
                <td>
                  <button 
                    className="table-action-btn"
                    onClick={() => handleCardClick(userItem)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
        }

        .erp-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          margin: 20px;
          min-height: calc(100vh - 40px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .header-section {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 30px 40px;
          position: relative;
          overflow: hidden;
        }

        .header-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }

        .header-content {
          position: relative;
          z-index: 1;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 15px 0;
          background: linear-gradient(45deg, #fff, #e3f2fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1rem;
          opacity: 0.8;
          margin: 0;
        }

        .controls-section {
          padding: 30px 40px;
          background: #fafbfc;
          border-bottom: 1px solid #e1e8ed;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 12px 45px 12px 15px;
          border: 2px solid #e1e8ed;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #8995a1;
        }

        .view-controls {
          display: flex;
          gap: 10px;
        }

        .view-btn {
          padding: 10px 15px;
          border: 2px solid #e1e8ed;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .view-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .view-btn:hover:not(.active) {
          background: #f8f9fa;
          border-color: #667eea;
        }

        .tabs-container {
          display: flex;
          gap: 5px;
          padding: 0 40px;
          background: white;
          border-bottom: 1px solid #e1e8ed;
        }

        .tab-btn {
          padding: 15px 25px;
          border: none;
          background: transparent;
          color: #8995a1;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-btn.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }

        .tab-btn:hover:not(.active) {
          color: #667eea;
          background: rgba(102, 126, 234, 0.03);
        }

        .content-section {
          padding: 30px 40px;
          background: white;
          min-height: 500px;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        .user-card {
          background: white;
          border: 1px solid #e1e8ed;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .user-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .user-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .user-card:hover::before {
          transform: scaleX(1);
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .avatar-icon {
          font-size: 24px;
        }

        .user-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 5px 0;
          color: #2c3e50;
        }

        .user-email {
          color: #7f8c8d;
          margin: 0 0 15px 0;
          font-size: 0.9rem;
        }

        .user-meta {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .role-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-badge {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.2);
        }

        .faculty-badge {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          border: 1px solid rgba(52, 152, 219, 0.2);
        }

        .student-badge {
          background: rgba(243, 156, 18, 0.1);
          color: #f39c12;
          border: 1px solid rgba(243, 156, 18, 0.2);
        }

        .department-tag {
          background: rgba(149, 165, 166, 0.1);
          color: #95a5a6;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          border: 1px solid rgba(149, 165, 166, 0.2);
        }

        .card-actions {
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid #ecf0f1;
        }

        .view-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .table-container {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid #e1e8ed;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #e1e8ed;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .users-table td {
          padding: 15px;
          border-bottom: 1px solid #f1f3f4;
          vertical-align: middle;
        }

        .users-table tr:hover {
          background: rgba(102, 126, 234, 0.02);
        }

        .table-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .table-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .table-action-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .table-action-btn:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .error {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 20px;
          border: 1px solid rgba(231, 76, 60, 0.2);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 1;
          animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-content h2 {
          margin: 0 0 30px 0;
          color: #2c3e50;
          font-size: 1.8rem;
          font-weight: 700;
          padding-bottom: 15px;
          border-bottom: 3px solid #667eea;
        }

        .user-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .detail-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }

        .detail-label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .detail-value {
          color: #34495e;
          font-size: 1rem;
          margin: 0;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 25px;
          font-size: 1.8rem;
          cursor: pointer;
          color: #95a5a6;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          transform: rotate(90deg);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #95a5a6;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #7f8c8d;
        }

        .empty-state p {
          font-size: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .erp-container {
            margin: 10px;
            border-radius: 15px;
          }
          
          .header-section, .controls-section, .content-section, .tabs-container {
            padding-left: 20px;
            padding-right: 20px;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          .user-detail-grid {
            grid-template-columns: 1fr;
          }

          .controls-row {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            max-width: none;
          }
        }
      `}</style>

      <div className="erp-container">
        <div className="header-section">
          <div className="header-content">
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Manage and view all system users across different roles</p>
          </div>
        </div>

        <div className="controls-section">
          <div className="controls-row">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                📋 Cards
              </button>
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                📊 Table
              </button>
            </div>
          </div>
        </div>

        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Users ({groupedUsers.all.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admins ({groupedUsers.admin.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'faculty' ? 'active' : ''}`}
              onClick={() => setActiveTab('faculty')}
            >
              Faculty ({groupedUsers.faculty.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
            >
              Students ({groupedUsers.student.length})
            </button>
          </div>
        )}

        <div className="content-section">
          {error && <div className="error">{error}</div>}
          
          {getUsersToDisplay().length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>No Users Found</h3>
              <p>No users match your current search criteria. Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            viewMode === 'cards' ? renderCards() : renderTable()
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h2>{selectedUser.fullName || selectedUser.name}</h2>
            
            <div className="user-detail-grid">
              <div className="detail-item">
                <div className="detail-label">Email Address</div>
                <p className="detail-value">{selectedUser.email}</p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Phone Number</div>
                <p className="detail-value">{selectedUser.phoneNumber || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Employee ID</div>
                <p className="detail-value">{selectedUser.employeeId || 'N/A'}</p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Enrollment Number</div>
                <p className="detail-value">{selectedUser.enrollmentNumber || 'N/A'}</p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Date of Birth</div>
                <p className="detail-value">
                  {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Gender</div>
                <p className="detail-value">{selectedUser.gender || 'Not specified'}</p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Department</div>
                <p className="detail-value">{selectedUser.stream || 'Not assigned'}</p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Role</div>
                <p className="detail-value">
                  <span className={getRoleBadgeClass(selectedUser.role)}>
                    {selectedUser.role?.toUpperCase()}
                  </span>
                </p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">City</div>
                <p className="detail-value">{selectedUser.city || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Pincode</div>
                <p className="detail-value">{selectedUser.pincode || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Member Since</div>
                <p className="detail-value">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Last Updated</div>
                <p className="detail-value">
                  {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
            
            {selectedUser.courses && selectedUser.courses.length > 0 && (
              <div className="detail-item" style={{gridColumn: '1 / -1'}}>
                <div className="detail-label">Enrolled Courses</div>
                <p className="detail-value">{selectedUser.courses.join(', ')}</p>
              </div>
            )}
            
            {selectedUser.address && (
              <div className="detail-item" style={{gridColumn: '1 / -1'}}>
                <div className="detail-label">Address</div>
                <p className="detail-value">{selectedUser.address}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AllUsers;