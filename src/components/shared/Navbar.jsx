import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage } from '../components/ui/avatar';
import { LogOut, User2, Bell } from 'lucide-react'; // Added Bell icon for notice
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {

  const { role, id } = useParams(); // get dynamic params
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (role && id) {
      navigate(`/${role}/${id}/announcement`);
    } else {
      console.warn("Missing role or id in URL params.");
    }
  };

  // Logout handler to clear user data and redirect
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });

      if (res.data.success) {
        dispatch(setUser(null)); // Clear user data from Redux
        navigate('/'); // Redirect to home or login page
        toast.success(res.data.message); // Display success message
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while logging out.");
    }
  };

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="brand-section">
            <div className="logo-icon">🎓</div>
            <h1 className="brand-text">
              College <span className="brand-highlight">ERP</span>
            </h1>
          </div>

          {/* Navigation */}
          <div className="nav-section">
            <ul className="nav-list">
              {/* Role-based Navigation */}
              {user && user.role === 'recruiter' ? (
                <>
                  <li className="nav-item">
                    <Link to="/admin/companies" className="nav-link">Companies</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/jobs" className="nav-link">Jobs</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <div onClick={handleClick} className="notification-btn">
                      <Bell size={20} />
                    </div>
                  </li>
                </>
              )}
            </ul>

            {/* Authentication or Profile UI */}
            {!user ? (
              <div className="auth-buttons">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Signup
                </Link>
              </div>
            ) : (
              <div className="profile-section">
                {/* Display Avatar and Popover only if the user is logged in */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="profile-avatar">
                      <AvatarImage src={user.profilePhoto || "/default-avatar.png"} alt="avatar" />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="popover-content">
                    <div>
                      <div className="profile-header">
                        <Avatar className="profile-avatar-large">
                          <AvatarImage src={user.profilePhoto || "/default-avatar.png"} alt="avatar" />
                        </Avatar>
                        <div className="profile-info">
                          <h4>{user?.fullName || "Unknown User"}</h4>
                          <p>{user?.role }</p>
                        </div>
                      </div>

                      <div className="profile-actions">
                        {/* route: "/profile" */}
                       <Link to={`/${role}/${id}/Profile`} className="profile-action-btn">
                          <User2 size={18} />
                          View Profile
                        </Link>
                      </div>

                    </div>
                  </PopoverContent>
                </Popover>

                {/* Logout Button visible only when user is logged in */}
                <div onClick={logoutHandler} className="logout-btn">
                  <LogOut size={18} />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      <style>{`
        .navbar-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0 20px;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1120px;
          height: 80px;
          margin: 0 auto;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: pulse 2s infinite;
        }

        .brand-text {
          font-size: 28px;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .brand-highlight {
          color: #f97316;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .nav-section {
          display: flex;
          align-items: center;
          gap: 48px;
        }

        .nav-list {
          display: flex;
          align-items: center;
          gap: 20px;
          font-weight: 500;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .notification-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          position: relative;
        }

        .notification-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .notification-btn::after {
          content: '';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: #f97316;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);
        }
.profile-section {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.profile-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-avatar:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.popover-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  width: 320px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.profile-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.profile-avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid #667eea;
  overflow: hidden;
}

.profile-info h4 {
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.profile-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  word-break: break-word;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
  color: #667eea;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.profile-action-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateX(4px);
}
        @media (max-width: 768px) {
          .navbar-content {
            padding: 0 16px;
            height: 70px;
          }
          
          .nav-section {
            gap: 24px;
          }
          
          .nav-list {
            gap: 12px;
          }
          
          .brand-text {
            font-size: 24px;
          }
          
          .logo-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      `}</style>


    </>
  );
};

export default Navbar;