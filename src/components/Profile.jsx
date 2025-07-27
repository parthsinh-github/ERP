import React, { useState } from "react";
import { useSelector } from "react-redux";

const ProfileField = ({ label, value, icon, isEditing, onChange, name, type = "text" }) => (
  <div className="profile-field">
    <div className="field-header">
      {icon && <span className="field-icon">{icon}</span>}
      <label className="field-label">{label}</label>
    </div>
    <div className="field-content">
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
        <div className="field-value">
          <span className="value-text">{value || "Not specified"}</span>
        </div>
      )}
    </div>
  </div>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("Details : ", user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});
  const [activeTab, setActiveTab] = useState('personal');

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-content">
          <h3>Loading Profile</h3>
          <p>Please wait while we fetch your information...</p>
        </div>
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
    stream,
    batchYear,
    currentYear,
    division,
    address,
    city,
    pincode,
    role,
    createdBy,
    createdAt,
    updatedAt
  } = isEditing ? editedUser : user;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return { bg: '#e74c3c', light: 'rgba(231, 76, 60, 0.1)' };
      case 'faculty': return { bg: '#3498db', light: 'rgba(52, 152, 219, 0.1)' };
      case 'student': return { bg: '#2ecc71', light: 'rgba(46, 204, 113, 0.1)' };
      default: return { bg: '#95a5a6', light: 'rgba(149, 165, 166, 0.1)' };
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
    console.log("Saving user data:", editedUser);
    setIsEditing(false);
    // API call would go here
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'professional', label: 'Professional', icon: '🏢' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'courses', label: 'Courses', icon: '📚' }
  ];

  const renderPersonalInfo = () => (
    <div className="tab-content">
      <div className="fields-grid">
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
  );

  const renderProfessionalInfo = () => (
    <div className="tab-content">
      <div className="fields-grid">
        <ProfileField 
          label="Department" 
          value={department} 
          icon="🏬" 
          isEditing={isEditing}
          onChange={handleInputChange}
          name="department"
        />
        <ProfileField 
          label="Stream" 
          value={stream} 
          icon="🎯" 
          isEditing={isEditing}
          onChange={handleInputChange}
          name="stream"
        />
        <ProfileField 
          label="Batch Year" 
          value={batchYear} 
          icon="📅" 
          isEditing={isEditing}
          onChange={handleInputChange}
          name="batchYear"
        />
        <ProfileField 
          label="Current Year" 
          value={currentYear} 
          icon="📊" 
          isEditing={isEditing}
          onChange={handleInputChange}
          name="currentYear"
        />
        <ProfileField 
          label="Division" 
          value={division} 
          icon="🔢" 
          isEditing={isEditing}
          onChange={handleInputChange}
          name="division"
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
  );

  const renderLocationInfo = () => (
    <div className="tab-content">
      <div className="fields-grid">
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
        <div className="profile-field full-width">
          <div className="field-header">
            <span className="field-icon">🏠</span>
            <label className="field-label">Address</label>
          </div>
          <div className="field-content">
            {isEditing ? (
              <textarea
                name="address"
                value={address || ""}
                onChange={handleInputChange}
                className="field-textarea"
                placeholder="Enter full address"
                rows="3"
              />
            ) : (
              <div className="field-value">
                <span className="value-text">{address || "Not specified"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="tab-content">
      {Array.isArray(courses) && courses.length > 0 ? (
        <div className="courses-grid">
          {courses.map((course, index) => (
            <div key={index} className="course-card">
              <div className="course-icon">📖</div>
              <div className="course-info">
                <h4 className="course-name">
                  {typeof course === "object" ? course.name : course}
                </h4>
                <p className="course-meta">Course {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Courses Assigned</h3>
          <p>No courses have been assigned to this profile yet.</p>
        </div>
      )}
    </div>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case 'personal': return renderPersonalInfo();
      case 'professional': return renderProfessionalInfo();
      case 'location': return renderLocationInfo();
      case 'courses': return renderCourses();
      default: return renderPersonalInfo();
    }
  };

  const roleColors = getRoleColor(role);

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

        .profile-wrapper {
          min-height: 100vh;
          padding: 20px;
        }

        .profile-container {
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .profile-header {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        .profile-header::before {
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
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          border: 6px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .profile-avatar::after {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
          border-radius: 50%;
          z-index: -1;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 15px 0;
          background: linear-gradient(45deg, #fff, #e3f2fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .profile-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 15px;
        }

        .role-badge {
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: ${roleColors.bg};
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .department-text {
          color: #bdc3c7;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .profile-status {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #a8b5c1;
          font-size: 0.9rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #2ecc71;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .profile-actions {
          display: flex;
          gap: 15px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-edit {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .btn-save {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          color: white;
          box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
        }

        .btn-cancel {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }

        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .tabs-container {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e1e8ed;
          padding: 0 40px;
        }

        .tab-btn {
          padding: 20px 30px;
          border: none;
          background: transparent;
          color: #8995a1;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
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

        .tab-icon {
          font-size: 1.1rem;
        }

        .profile-content {
          padding: 40px;
          background: white;
          min-height: 600px;
        }

        .tab-content {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
        }

        .profile-field {
          background: #f8f9fa;
          border: 1px solid #e1e8ed;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .profile-field::before {
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

        .profile-field:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .profile-field:hover::before {
          transform: scaleX(1);
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .field-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .field-icon {
          font-size: 1.2rem;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
        }

        .field-label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-content {
          position: relative;
        }

        .field-value {
          padding: 15px 0;
        }

        .value-text {
          font-size: 1.1rem;
          color: #34495e;
          font-weight: 500;
        }

        .field-input, .field-textarea {
          width: 100%;
          padding: 15px;
          border: 2px solid #e1e8ed;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          font-family: inherit;
        }

        .field-input:focus, .field-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .field-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .course-card {
          background: white;
          border: 1px solid #e1e8ed;
          border-radius: 15px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .course-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .course-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .course-info {
          flex: 1;
        }

        .course-name {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .course-meta {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #95a5a6;
        }

        .empty-icon {
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

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 30px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-content {
          text-align: center;
        }

        .loading-content h3 {
          font-size: 1.5rem;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .loading-content p {
          font-size: 1rem;
          opacity: 0.8;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .fields-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .profile-wrapper {
            padding: 10px;
          }

          .profile-container {
            border-radius: 15px;
          }

          .profile-header {
            padding: 30px 20px;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }

          .profile-name {
            font-size: 2.2rem;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
            font-size: 2rem;
          }

          .profile-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .tabs-container {
            padding: 0 20px;
            overflow-x: auto;
          }

          .tab-btn {
            padding: 15px 20px;
            white-space: nowrap;
          }

          .profile-content {
            padding: 30px 20px;
          }

          .fields-grid {
            grid-template-columns: 1fr;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .profile-name {
            font-size: 1.8rem;
          }

          .profile-meta {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .field-input, .field-textarea {
            padding: 12px;
          }
        }
      `}</style>

      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="profile-header">
            <div className="header-content">
              <div className="profile-avatar">
                <span className="avatar-text">{getInitials(fullName)}</span>
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{fullName || "User Profile"}</h1>
                <div className="profile-meta">
                  <span className="role-badge">
                    {role?.toUpperCase() || 'USER'}
                  </span>
                  {department && <span className="department-text">{department}</span>}
                </div>
                <div className="profile-status">
                  <span className="status-dot"></span>
                  <span>Active Profile</span>
                </div>
              </div>
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="btn btn-save">
                      💾 Save Changes
                    </button>
                    <button onClick={handleCancel} className="btn btn-cancel">
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="btn btn-edit">
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="tabs-container">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="profile-content">
            {getTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;