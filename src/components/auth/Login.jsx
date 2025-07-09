import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { USER_API_END_POINT } from '@/utils/constant';
import { setLoading, setUser } from '@/redux/authSlice';
import { toast } from 'react-toastify';
import { loginSuccess } from '../../redux/authSlice.js';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: '',
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await fetch(`${USER_API_END_POINT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message);

        const { user, token } = data;

        dispatch(loginSuccess({ user, token })); // ✅ set both user and token in redux

        const route = `/${user.role}/${user._id}`; // ✅ dynamic role-based route
        navigate(route);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="left-section">
          <div className="brand-content">
            <div className="logo-container">
              <div className="logo-circle">
                <span className="logo-text">📚</span>
              </div>
              <h1 className="brand-title">College ERP</h1>
            </div>
            
            <div className="tagline">
              <h2>Welcome to the Future of Education Management</h2>
              <p>Streamline your academic journey with our comprehensive ERP solution</p>
            </div>

            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">🎓</span>
                <span>Student Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👨‍🏫</span>
                <span>Faculty Portal</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Academic Analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure & Reliable</span>
              </div>
            </div>

            <div className="decorative-elements">
              <div className="floating-element element-1">💡</div>
              <div className="floating-element element-2">🚀</div>
              <div className="floating-element element-3">⭐</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="right-section">
          <div className="login-card">
            <div className="card-header">
              <h2>Sign In</h2>
              <p>Access your College ERP account</p>
            </div>

            <form className="login-form" onSubmit={submitHandler}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={input.email}
                  onChange={changeEventHandler}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={input.password}
                  onChange={changeEventHandler}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Login as</label>
                <div className="role-selection">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={input.role === 'student'}
                      onChange={changeEventHandler}
                    />
                    <span className="role-text">
                      <span className="role-icon">🎓</span>
                      Student
                    </span>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="faculty"
                      checked={input.role === 'faculty'}
                      onChange={changeEventHandler}
                    />
                    <span className="role-text">
                      <span className="role-icon">👨‍🏫</span>
                      Faculty
                    </span>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={input.role === 'admin'}
                      onChange={changeEventHandler}
                    />
                    <span className="role-text">
                      <span className="role-icon">👩‍💼</span>
                      Admin
                    </span>
                  </label>
                </div>
              </div>

              <button className="login-button" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

              <p className="signup-link">
                Don't have an account? <Link to="/signup">Create Account</Link>
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

        .login-container {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        }

        /* Left Section - Branding */
        .left-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .brand-content {
          max-width: 500px;
          text-align: center;
          z-index: 2;
        }

        .logo-container {
          margin-bottom: 3rem;
        }

        .logo-circle {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          animation: pulse 2s infinite;
        }

        .logo-text {
          font-size: 2.5rem;
        }

        .brand-title {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .tagline h2 {
          color: #e2e8f0;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .tagline p {
          color: #94a3b8;
          font-size: 1.1rem;
          margin-bottom: 3rem;
          line-height: 1.5;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cbd5e1;
          font-size: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .feature-icon {
          font-size: 1.2rem;
        }

        .decorative-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-element {
          position: absolute;
          font-size: 2rem;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .element-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .element-2 {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .element-3 {
          bottom: 25%;
          left: 20%;
          animation-delay: 4s;
        }

        /* Right Section - Login Form */
        .right-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .card-header {
          text-align: center;
          margin-bottom: 2.5rem;
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

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          color: #e2e8f0;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .form-input {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #f1f5f9;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input::placeholder {
          color: #64748b;
        }

        .form-input:focus {
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .role-selection {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .role-option {
          flex: 1;
          min-width: 0;
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
          margin: 0;
          accent-color: #667eea;
        }

        .role-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e2e8f0;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .role-icon {
          font-size: 1rem;
        }

        .login-button {
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

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-arrow {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .login-button:hover .button-arrow {
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

        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .signup-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .signup-link a:hover {
          color: #764ba2;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }
          
          .left-section {
            min-height: 40vh;
            padding: 1rem;
          }
          
          .brand-title {
            font-size: 2rem;
          }
          
          .tagline h2 {
            font-size: 1.4rem;
          }
          
          .features {
            grid-template-columns: 1fr;
          }
          
          .right-section {
            padding: 1rem;
          }
          
          .login-card {
            padding: 1.5rem;
          }
          
          .role-selection {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default Login;