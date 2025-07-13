import React, { useState } from "react";
import { useSelector } from "react-redux";

const ProfileField = ({ label, value, icon, isEditing, onChange, name, type = "text" }) => (
  <div className="profile-field">
    <div className="field-header">
      {icon && <span className="field-icon">{icon}</span>}
      <label className="field-label">{label}</label>
    </div>
    <div className="field-value">
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="field-input"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <span>{value || "N/A"}</span>
      )}
    </div>
  </div>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});


  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const {
    fullName,
    email,
    phoneNumber,
    employeeId,
    enrollmentNumber,
    dateOfBirth,
    gender,
    department,
    courses,
    address,
    city,
    pincode,
    role,
    createdBy,
  } = isEditing ? editedUser : user;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e74c3c';
      case 'faculty': return '#3498db';
      case 'student': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    console.log("Saving user data:", editedUser);
    setIsEditing(false);
    // You can dispatch an action to update the Redux store here
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">{getInitials(fullName)}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{fullName || "User"}</h1>
            <div className="profile-meta">
              <span className="role-badge" style={{ backgroundColor: getRoleColor(role) }}>
                {role?.toUpperCase()}
              </span>
              <span className="department-text">{department}</span>
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-save">
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn btn-cancel">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-edit">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="profile-content">
          {/* Personal Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <span className="section-icon">👤</span>
              Personal Information
            </h2>
            <div className="profile-grid">
              <ProfileField 
                label="Full Name" 
                value={fullName} 
                icon="👨‍💼" 
                isEditing={isEditing}
                onChange={handleInputChange}
                name="fullName"
              />
              <ProfileField 
                label="Email Address" 
                value={email} 
                icon="✉️" 
                isEditing={isEditing}
                onChange={handleInputChange}
                name="email"
                type="email"
              />
              <ProfileField 
                label="Phone Number" 
                value={phoneNumber} 
                icon="📱" 
                isEditing={isEditing}
                onChange={handleInputChange}
                name="phoneNumber"
                type="tel"
              />
              <ProfileField 
                label="Gender" 
                value={gender} 
                icon="⚧" 
                isEditing={isEditing}
                onChange={handleInputChange}
                name="gender"
              />
              <ProfileField 
                label="Date of Birth" 
                value={dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : ""} 
                icon="🎂"
                isEditing={isEditing}
                onChange={handleInputChange}
                name="dateOfBirth"
                type="date"
              />
              <ProfileField 
                label="Role" 
                value={role} 
                icon="🏷️" 
                isEditing={false}
                onChange={handleInputChange}
                name="role"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <span className="section-icon">🏢</span>
              Professional Information
            </h2>
            <div className="profile-grid">
              <ProfileField 
                label="Department" 
                value={department} 
                icon="🏬" 
                isEditing={isEditing}
                onChange={handleInputChange}
                name="department"
              />
              {role === "student" && (
                <ProfileField 
                  label="Enrollment Number" 
                  value={enrollmentNumber} 
                  icon="🎓" 
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  name="enrollmentNumber"
                />
              )}
              {(role === "faculty" || role === "admin") && (
                <ProfileField 
                  label="Employee ID" 
                  value={employeeId} 
                  icon="🆔" 
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  name="employeeId"
                />
              )}
              {role === "admin" && createdBy && (
                <ProfileField 
                  label="Created By (Admin ID)" 
                  value={createdBy} 
                  icon="👤" 
                  isEditing={false}
                  onChange={handleInputChange}
                  name="createdBy"
                />
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <span className="section-icon">📍</span>
              Location Information
            </h2>
            <div className="profile-grid">
              <ProfileField 
                label="City" 
                value={city} 
                icon="🏙️" 
                isEditing={isEditing}
                onChange={handleInputChange}
                name="city"
              />
              <ProfileField 
                label="Pincode" 
                value={pincode} 
                icon="📮" 
                isEditing={isEditing}
                onChange={handleInputChange}
                name="pincode"
              />
              <ProfileField 
                label="Address" 
                value={address} 
                icon="🏠" 
                isEditing={isEditing}
                onChange={handleInputChange}
                name="address"
              />
            </div>
          </div>

          {/* Courses Section */}
          {Array.isArray(courses) && courses.length > 0 && (
            <div className="profile-section">
              <h2 className="section-title">
                <span className="section-icon">📚</span>
                Courses
              </h2>
              <div className="courses-container">
                {courses.map((course, index) => (
                  <div key={index} className="course-item">
                    <span className="course-icon">📖</span>
                    <span className="course-name">
                      {typeof course === "object" ? course.name : course}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e  0%, #764ba2 100%);
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .profile-header {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3498db, #2ecc71);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          color: white;
          border: 4px solid rgba(255, 255, 255, 0.2);
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 300;
        }

        .profile-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .department-text {
          color: #bdc3c7;
          font-size: 1.1rem;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .btn-edit {
          background: #3498db;
          color: white;
        }

        .btn-save {
          background: #2ecc71;
          color: white;
        }

        .btn-cancel {
          background: #e74c3c;
          color: white;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .profile-content {
          padding: 2rem;
        }

        .profile-section {
          margin-bottom: 2rem;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          overflow: hidden;
        }

        .section-title {
          background: #f8f9fa;
          color: #2c3e50;
          padding: 1rem 1.5rem;
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          border-bottom: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          font-size: 1.1rem;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1.5rem;
        }

        .profile-field {
          background: #f8f9fa;
          border-radius: 6px;
          padding: 1rem;
          border-left: 4px solid #3498db;
          transition: all 0.3s ease;
        }

        .profile-field:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .field-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .field-icon {
          font-size: 1rem;
        }

        .field-label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-value {
          font-size: 1.1rem;
          color: #34495e;
          font-weight: 400;
        }

        .field-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .field-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .courses-container {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .course-item {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .course-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .course-icon {
          font-size: 1.2rem;
        }

        .course-name {
          font-weight: 500;
          font-size: 1rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: #2c3e50;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e8e8e8;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-wrapper {
            padding: 1rem;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem;
          }

          .profile-name {
            font-size: 2rem;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .courses-container {
            grid-template-columns: 1fr;
          }

          .profile-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;