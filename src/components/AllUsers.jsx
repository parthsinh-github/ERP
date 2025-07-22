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


  const groupedUsers = {
    admin: users.filter(user => user.role === 'admin'),
    faculty: users.filter(user => user.role === 'faculty'),
    student: users.filter(user => user.role === 'student'),
  };

  const handleCardClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

   

  const renderUsers = () => {
    if (user?.role === 'admin' || user?.role === 'faculty') {
      return (
        <>
          <div className="user-section">
            <h2>Admins</h2>
            <div className="user-cards">
              {groupedUsers.admin.map(user => (
                <div
                  key={user._id}
                  className="user-card admin"
                  onClick={() => handleCardClick(user)}
                >
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="user-section">
            <h2>Faculties</h2>
            <div className="user-cards">
              {groupedUsers.faculty.map(user => (
                <div
                  key={user._id}
                  className="user-card faculty"
                  onClick={() => handleCardClick(user)}
                >
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="user-section">
            <h2>Students</h2>
            <div className="user-cards">
              {groupedUsers.student.map(user => (
                <div
                  key={user._id}
                  className="user-card student"
                  onClick={() => handleCardClick(user)}
                >
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (user?.role === 'student') {
      return (
        <div className="user-section">
          <h2>Students</h2>
          <div className="user-cards">
            {groupedUsers.student.map(user => (
              <div
                key={user._id}
                className="user-card student"
                onClick={() => handleCardClick(user)}
              >
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f4f8;
        }

        .users-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .page-title {
          font-size: 3rem;
          text-align: center;
          color: #1e2a38;
          margin-bottom: 50px;
        }

        .user-section {
          margin-bottom: 60px;
        }

        .user-section h2 {
          font-size: 1.6rem;
          color: #2f3e4e;
          border-left: 5px solid #5c6ac4;
          padding-left: 15px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .user-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .user-card {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-top: 4px solid transparent;
          cursor: pointer;
        }

        .user-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
        }

        .user-card h3 {
          margin: 0 0 10px;
          font-size: 1.25rem;
          color: #2c3e50;
        }

        .user-card p {
          margin: 0;
          font-size: 0.95rem;
          color: #7f8c8d;
        }

        .admin {
          border-top-color: #27ae60;
        }

        .faculty {
          border-top-color: #2980b9;
        }

        .student {
          border-top-color: #f39c12;
        }

        .error {
          text-align: center;
          color: red;
          font-size: 1rem;
          margin-bottom: 20px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          position: relative;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .modal-content h2 {
          margin-top: 0;
          color: #2c3e50;
        }

        .modal-content p {
          margin: 8px 0;
          color: #555;
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
        }

        .close-btn:hover {
          color: #e74c3c;
        }

        .back-btn {
          margin-top: 20px;
          padding: 10px 15px;
          background-color: #2980b9;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .back-btn:hover {
          background-color: #1f65a5;
        }
      `}</style>

      <div className="users-container">
        <h1 className="page-title">All Users</h1>
        {error && <div className="error">{error}</div>}
        {renderUsers()}
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h2>{selectedUser.fullName}</h2>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
            <p><strong>Employee ID:</strong> {selectedUser.employeeId}</p>
            <p><strong>Enrollment Number:</strong> {selectedUser.enrollmentNumber}</p>
            <p><strong>Date of Birth:</strong> {new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {selectedUser.gender}</p>
            <p><strong>Department:</strong> {selectedUser.department}</p>
            <p><strong>Courses:</strong> {selectedUser.courses.join(', ')}</p>
            <p><strong>Address:</strong> {selectedUser.address}</p>
            <p><strong>City:</strong> {selectedUser.city}</p>
            <p><strong>Pincode:</strong> {selectedUser.pincode}</p>
            <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>

 
          </div>
        </div>
      )}
    </>
  );
};

export default AllUsers;
