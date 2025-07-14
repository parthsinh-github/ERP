import React, { useState } from 'react';
import { ArrowLeft, Plus, BookOpen, Calendar, Clock, GraduationCap, Building, User, FileText, Timer } from 'lucide-react';

// Mock hooks for demonstration
const useSelector = (selector) => {
  const mockState = {
    auth: { user: { role: 'admin' } },
    exam: { 
      allExam: [
        {
          _id: '1',
          title: 'Mid-Term Examination',
          subject: 'Computer Science',
          department: 'Information Technology',
          date: '2024-03-15',
          startTime: '09:00 AM',
          endTime: '12:00 PM',
          semester: 6,
          examType: 'Written',
          createdBy: { email: 'admin@university.edu' }
        },
        {
          _id: '2',
          title: 'Final Examination',
          subject: 'Database Management',
          department: 'Computer Science',
          date: '2024-03-20',
          startTime: '10:00 AM',
          endTime: '01:00 PM',
          semester: 4,
          examType: 'Practical',
          createdBy: { email: 'faculty@university.edu' }
        }
      ]
    }
  };
  return selector(mockState);
};

const useParams = () => ({ role: 'admin', id: '123' });
const useGetAllExam = () => {};
const useNavigate = () => (path) => console.log('Navigate to:', path);

const Exam = () => {
  useGetAllExam();
  const navigate = useNavigate();
  
  const { role, id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { allExam } = useSelector(store => store.exam);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    examType: '',
    date: '',
    startTime: '',
    endTime: '',
    department: '',
    semester: '',
    subject: '',
    createdBy: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/v1/exam/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Exam created successfully!');
        setFormData({
          title: '',
          examType: '',
          date: '',
          startTime: '',
          endTime: '',
          department: '',
          semester: '',
          subject: '',
          createdBy: '',
        });
        setIsModalOpen(false);
      } else {
        alert('⚠️ Failed to create exam');
      }
    } catch (error) {
      alert('❌ Error creating exam: ' + error.message);
    }
  };

  const handleBack = () => {
    navigate(`/${role}/${id}`);
  };

  const getExamTypeIcon = (examType) => {
    switch (examType?.toLowerCase()) {
      case 'practical':
        return <Timer size={16} style={{ color: '#8b5cf6' }} />;
      case 'written':
        return <FileText size={16} style={{ color: '#06b6d4' }} />;
      default:
        return <BookOpen size={16} style={{ color: '#10b981' }} />;
    }
  };

  const getExamTypeColor = (examType) => {
    switch (examType?.toLowerCase()) {
      case 'practical':
        return '#8b5cf6';
      case 'written':
        return '#06b6d4';
      default:
        return '#10b981';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        
        <div style={styles.headerContent}>
          <div style={styles.headerTitle}>
            <GraduationCap size={32} style={{ color: '#ffffff' }} />
            <h1 style={styles.heading}>Exam Management</h1>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{allExam?.length || 0}</span>
              <span style={styles.statLabel}>Total Exams</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>
                {allExam?.filter(exam => new Date(exam.date) > new Date()).length || 0}
              </span>
              <span style={styles.statLabel}>Upcoming</span>
            </div>
          </div>
        </div>

        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button onClick={() => setIsModalOpen(true)} style={styles.createButton}>
            <Plus size={18} />
            Create Exam
          </button>
        )}
      </div>

      {/* Create Exam Modal */}
      {(user?.role === 'admin' || user?.role === 'faculty') && isModalOpen && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Create New Exam</h3>
              <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <div style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <FileText size={16} />
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Mid-Term Examination"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <BookOpen size={16} />
                    Exam Type *
                  </label>
                  <input
                    type="text"
                    name="examType"
                    placeholder="e.g., Written, Practical, Oral"
                    value={formData.examType}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Calendar size={16} />
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Clock size={16} />
                    Start Time *
                  </label>
                  <input
                    type="text"
                    name="startTime"
                    placeholder="e.g., 09:00 AM"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Clock size={16} />
                    End Time *
                  </label>
                  <input
                    type="text"
                    name="endTime"
                    placeholder="e.g., 12:00 PM"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Building size={16} />
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <GraduationCap size={16} />
                    Semester *
                  </label>
                  <input
                    type="number"
                    name="semester"
                    placeholder="e.g., 6"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    min="1"
                    max="10"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <BookOpen size={16} />
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g., Database Management"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <User size={16} />
                    Created By (User ID) *
                  </label>
                  <input
                    type="text"
                    name="createdBy"
                    placeholder="Enter user ID"
                    value={formData.createdBy}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" onClick={handleCreateExam} style={styles.submitButton}>
                  <Plus size={16} />
                  Create Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exam Cards */}
      {allExam && allExam.length > 0 ? (
        <div style={styles.cardGrid}>
          {allExam.map((exam) => (
            <div key={exam._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitleRow}>
                  <h3 style={styles.cardTitle}>{exam.title}</h3>
                  <div style={{
                    ...styles.examTypeBadge,
                    backgroundColor: `${getExamTypeColor(exam.examType)}20`,
                    color: getExamTypeColor(exam.examType),
                    border: `1px solid ${getExamTypeColor(exam.examType)}40`
                  }}>
                    {getExamTypeIcon(exam.examType)}
                    {exam.examType}
                  </div>
                </div>
                <p style={styles.cardSubject}>{exam.subject}</p>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <Building size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Department:</span>
                  <span style={styles.infoValue}>{exam.department}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <Calendar size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Date:</span>
                  <span style={styles.infoValue}>{new Date(exam.date).toLocaleDateString()}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <Clock size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Time:</span>
                  <span style={styles.infoValue}>{exam.startTime} - {exam.endTime}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <GraduationCap size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Semester:</span>
                  <span style={styles.infoValue}>{exam.semester}</span>
                </div>
              </div>
              
              <div style={styles.cardFooter}>
                <User size={14} style={styles.createdByIcon} />
                <span style={styles.createdByText}>
                  Created by: {exam.createdBy?.email || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <GraduationCap size={64} style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>No exams scheduled</h3>
          <p style={styles.emptyText}>
            {(user?.role === 'admin' || user?.role === 'faculty') 
              ? 'Create your first exam to get started' 
              : 'Check back later for upcoming exams'}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '32px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    marginBottom: '40px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '24px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0',
    letterSpacing: '-0.02em',
  },
  headerStats: {
    display: 'flex',
    gap: '16px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '16px 20px',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: '4px',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '14px 24px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 0',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  form: {
    padding: '0 24px 24px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #f1f5f9',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    marginBottom: '20px',
  },
  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
    flex: 1,
  },
  examTypeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardSubject: {
    fontSize: '16px',
    color: '#667eea',
    fontWeight: '500',
    margin: '0',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  infoIcon: {
    color: '#667eea',
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    minWidth: '80px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '500',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  createdByIcon: {
    color: '#94a3b8',
  },
  createdByText: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '64px 32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  emptyIcon: {
    color: '#e2e8f0',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0',
  },
};

export default Exam;