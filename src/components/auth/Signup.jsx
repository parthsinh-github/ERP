import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';
  

const Signup = () => {
  const [input, setInput] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    employeeId: '',
    enrollmentNumber: '',
    password: '',
    secretKey: '',
    role: 'student',
    department: '',
    address: '',
    city: '',
    pincode: '',
    gender: '',
    dateOfBirth: ''
  });

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setInput(prev => ({ ...prev, role: value, secretKey: '' }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.gender) return toast.error('Gender is required');

    if ((input.role === 'admin' || input.role === 'faculty') && !input.secretKey) {
      return toast.error('Secret key is required for admin/faculty');
    }

   try {
  dispatch(setLoading(true));

  const res = await fetch(`${USER_API_END_POINT}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // replaces axios's withCredentials: true
    body: JSON.stringify(input)
  });

  const data = await res.json();
  
  if (res.ok && data.success) {
    toast.success(data.message);
    navigate('/'); // ✅ redirect to login after successful signup
  } else {
    toast.error(data.message || 'Signup failed');
  }
  console.log("data is :",res);
  
} catch (error) {
  toast.error('Signup failed: ' + error.message);
} finally {
  dispatch(setLoading(false));
}

  };

 

  return (
    <>
      <div className="signup-container">
        {/* Header with branding */}
        <div className="signup-header">
          <div className="header-brand">
            <div className="logo-mini">
              <span className="logo-emoji">🎓</span>
            </div>
            <div className="brand-info">
              <h1>College ERP</h1>
              <p>Join our academic community</p>
            </div>
          </div>
          <div className="header-decorations">
            <span className="deco-icon deco-1">📚</span>
            <span className="deco-icon deco-2">✨</span>
            <span className="deco-icon deco-3">🌟</span>
          </div>
        </div>

        {/* Main signup form */}
        <div className="signup-main">
          <div className="signup-card">
            <div className="card-header">
              <h2>Create Your Account</h2>
              <p>Start your journey with College ERP</p>
            </div>

            <form className="signup-form" onSubmit={submitHandler}>
              {/* Personal Information Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">👤</span>
                  Personal Information
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={input.fullName}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={input.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      value={input.phoneNumber}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={input.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={input.gender}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      placeholder="Enter department"
                      value={input.department}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">🎯</span>
                  Academic Information
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      placeholder="Enter employee ID"
                      value={input.employeeId}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Enrollment Number</label>
                    <input
                      type="text"
                      name="enrollmentNumber"
                      placeholder="Enter enrollment number"
                      value={input.enrollmentNumber}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div className="role-selection">
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={input.role === 'student'}
                        onChange={handleRoleChange}
                      />
                      <span className="role-content">
                        <span className="role-icon">🎓</span>
                        <span className="role-text">Student</span>
                      </span>
                    </label>
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="faculty"
                        checked={input.role === 'faculty'}
                        onChange={handleRoleChange}
                      />
                      <span className="role-content">
                        <span className="role-icon">👨‍🏫</span>
                        <span className="role-text">Faculty</span>
                      </span>
                    </label>
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={input.role === 'admin'}
                        onChange={handleRoleChange}
                      />
                      <span className="role-content">
                        <span className="role-icon">👩‍💼</span>
                        <span className="role-text">Admin</span>
                      </span>
                    </label>
                  </div>
                </div>

                {(input.role === 'admin' || input.role === 'faculty') && (
                  <div className="form-group">
                    <label className="form-label">Secret Key</label>
                    <input
                      type="text"
                      name="secretKey"
                      placeholder="Enter secret key"
                      value={input.secretKey}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              {/* Address Information Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">🏠</span>
                  Address Information
                </h3>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={input.address}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={input.city}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Enter pincode"
                      value={input.pincode}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">🔐</span>
                  Security
                </h3>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={input.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <button className="signup-button" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

              <p className="login-link">
                Already have an account? <Link to="/">Sign In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .signup-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 2rem 0;
        }

        .signup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 2rem;
          position: relative;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-mini {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }

        .logo-emoji {
          font-size: 1.5rem;
        }

        .brand-info h1 {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-info p {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .header-decorations {
          display: flex;
          gap: 2rem;
        }

        .deco-icon {
          font-size: 1.5rem;
          opacity: 0.3;
          animation: float 4s ease-in-out infinite;
        }

        .deco-1 { 
          animation-delay: 0s; 
        }
        
        .deco-2 { 
          animation-delay: 1.5s; 
        }
        
        .deco-3 { 
          animation-delay: 3s; 
        }

        .signup-main {
          display: flex;
          justify-content: center;
          padding: 0 2rem;
        }

        .signup-card {
          width: 100%;
          max-width: 800px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .card-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 0.5rem;
        }

        .card-header p {
          color: #94a3b8;
          font-size: 1rem;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .section-icon {
          font-size: 1.2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .form-label {
          color: #e2e8f0;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-input,
        .form-select {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #f1f5f9;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input::placeholder {
          color: #64748b;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .role-selection {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .role-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .role-option:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #667eea;
        }

        .role-option input[type="radio"] {
          accent-color: #667eea;
        }

        .role-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .role-icon {
          font-size: 1rem;
        }

        .role-text {
          color: #e2e8f0;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .signup-button {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .signup-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .signup-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-arrow {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .signup-button:hover .button-arrow {
          transform: translateX(3px);
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .login-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-link a:hover {
          color: #764ba2;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
          }
          50% { 
            transform: scale(1.05); 
          }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }

        @keyframes spin {
          0% { 
            transform: rotate(0deg); 
          }
          100% { 
            transform: rotate(360deg); 
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .signup-container {
            padding: 1rem 0;
          }
          
          .signup-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .header-decorations {
            gap: 1rem;
          }
          
          .signup-card {
            padding: 1.5rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .role-selection {
            grid-template-columns: 1fr;
          }
          
          .card-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Signup;