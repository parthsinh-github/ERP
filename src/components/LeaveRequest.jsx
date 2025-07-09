import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Calendar, User, FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import useGetAllLeave from '../hooks/useGetAllLeave';

const LeaveRequest = () => {
  const { role, id } = useParams();
  const refreshLeave = useGetAllLeave();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const { allLeave } = useSelector((state) => state.leave);
  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    department: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/leave/submit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdBy: userId,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit leave request');

      alert('Leave request sent!');
      setFormData({
        studentName: '',
        studentId: '',
        department: '',
        fromDate: '',
        toDate: '',
        reason: '',
      });

      setShowForm(false);
      refreshLeave();
    } catch (err) {
      console.error(err);
      alert('Error submitting leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = (leave) => {
    setSelectedLeave(leave);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedLeave(null);
    setShowDialog(false);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      studentName: '',
      studentId: '',
      department: '',
      fromDate: '',
      toDate: '',
      reason: '',
    });
  };

  const handleAction = async (action) => {
    try {
      let response;

      if (role === 'student' && action === 'withdraw') {
        response = await fetch(`http://localhost:3000/api/v1/leave/${id}/${selectedLeave._id}`, {
          method: 'DELETE',
        });
        console.log("Delete response : ", response);
      } else if ((role === 'admin' || role === 'faculty') && (action === 'approved' || action === 'rejected')) {
        response = await fetch(`http://localhost:3000/api/v1/leave/${selectedLeave._id}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: action }),
        });
      } else {
        alert('Unauthorized action');
        return;
      }

      if (!response.ok) throw new Error('Action failed');

      alert(`Leave ${action === 'withdraw' ? 'withdrawn' : `marked as ${action}`} successfully`);
      refreshLeave();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#eab308';
      case 'approved':
        return '#16a34a';
      case 'rejected':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  const calculateDuration = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.backBtnContainer}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              <ArrowLeft size={18} style={{ marginRight: '6px' }} />
              Back
            </button>
          </div>

          <div style={styles.pageTitle}>
            <h2 style={styles.heading}>
              <FileText size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Leave Management
            </h2>
            <div style={styles.breadcrumb}>
              <span style={styles.breadcrumbItem}>Dashboard</span>
              <span style={styles.breadcrumbSeparator}>•</span>
              <span style={styles.breadcrumbActive}>Leave Requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Action Bar */}
        <div style={styles.actionBar}>
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Clock size={20} />
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statValue}>
                  {allLeave?.filter(leave => leave.status === 'pending').length || 0}
                </div>
                <div style={styles.statLabel}>Pending</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#16a34a'}}>
                <CheckCircle size={20} />
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statValue}>
                  {allLeave?.filter(leave => leave.status === 'approved').length || 0}
                </div>
                <div style={styles.statLabel}>Approved</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#ef4444'}}>
                <XCircle size={20} />
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statValue}>
                  {allLeave?.filter(leave => leave.status === 'rejected').length || 0}
                </div>
                <div style={styles.statLabel}>Rejected</div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowForm(true)} 
            style={styles.addButton}
          >
            <Plus size={20} style={{ marginRight: '8px' }} />
            New Leave Request
          </button>
        </div>

        {/* Leave Requests Grid */}
        {allLeave?.length === 0 ? (
          <div style={styles.noData}>
            <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>No leave requests found</h3>
            <p>Submit your first leave request to get started.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {allLeave?.map((item) => (
              <div 
                key={item._id} 
                style={styles.card}
                onClick={() => handleCardClick(item)}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeaderLeft}>
                    <h3 style={styles.cardTitle}>{item.studentName}</h3>
                    <p style={styles.cardSubtitle}>ID: {item.studentId}</p>
                  </div>
                  <div style={styles.statusBadge}>
                    <div style={{...styles.statusIcon, color: getStatusColor(item.status)}}>
                      {getStatusIcon(item.status)}
                    </div>
                    <span style={{...styles.statusText, color: getStatusColor(item.status)}}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.cardInfoRow}>
                    <User size={16} style={{ marginRight: '8px', color: '#64748b' }} />
                    <span style={styles.cardInfo}>{item.department}</span>
                  </div>
                  
                  <div style={styles.cardInfoRow}>
                    <Calendar size={16} style={{ marginRight: '8px', color: '#64748b' }} />
                    <span style={styles.cardInfo}>
                      {new Date(item.fromDate).toLocaleDateString()} - {new Date(item.toDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={styles.durationBadge}>
                    {calculateDuration(item.fromDate, item.toDate)} day{calculateDuration(item.fromDate, item.toDate) > 1 ? 's' : ''}
                  </div>

                  <div style={styles.reasonPreview}>
                    <strong>Reason:</strong> {item.reason.length > 60 ? `${item.reason.substring(0, 60)}...` : item.reason}
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.cardFooterText}>
                    Applied: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave Request Form Dialog */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <div style={styles.dialogHeader}>
              <h3 style={styles.dialogTitle}>Submit Leave Request</h3>
              <button onClick={closeForm} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.dialogContent}>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Student Name</label>
                    <input
                      type="text"
                      name="studentName"
                      placeholder="Enter student name"
                      value={formData.studentName}
                      onChange={handleChange}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      placeholder="Enter student ID"
                      value={formData.studentId}
                      onChange={handleChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Department</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>From Date</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>To Date</label>
                    <input
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Reason for Leave</label>
                  <textarea
                    name="reason"
                    placeholder="Enter reason for leave"
                    value={formData.reason}
                    onChange={handleChange}
                    style={styles.textarea}
                    required
                  />
                </div>

                <div style={styles.dialogActions}>
                  <button type="button" onClick={closeForm} style={styles.cancelButton}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Leave Detail Dialog */}
      {showDialog && selectedLeave && (
        <div style={styles.overlay}>
          <div style={styles.detailDialog}>
            <div style={styles.dialogHeader}>
              <h3 style={styles.dialogTitle}>Leave Request Details</h3>
              <button onClick={handleCloseDialog} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.dialogContent}>
              <div style={styles.detailContent}>
                <div style={styles.detailHeader}>
                  <div style={styles.detailHeaderLeft}>
                    <h4 style={styles.detailTitle}>{selectedLeave.studentName}</h4>
                    <p style={styles.detailSubtitle}>ID: {selectedLeave.studentId}</p>
                  </div>
                  <div style={styles.statusBadge}>
                    <div style={{...styles.statusIcon, color: getStatusColor(selectedLeave.status)}}>
                      {getStatusIcon(selectedLeave.status)}
                    </div>
                    <span style={{...styles.statusText, color: getStatusColor(selectedLeave.status)}}>
                      {selectedLeave.status}
                    </span>
                  </div>
                </div>

                <div style={styles.detailBody}>
                  <div style={styles.detailRow}>
                    <strong>Department:</strong> {selectedLeave.department}
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Duration:</strong> {new Date(selectedLeave.fromDate).toLocaleDateString()} - {new Date(selectedLeave.toDate).toLocaleDateString()}
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Total Days:</strong> {calculateDuration(selectedLeave.fromDate, selectedLeave.toDate)} day{calculateDuration(selectedLeave.fromDate, selectedLeave.toDate) > 1 ? 's' : ''}
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Applied On:</strong> {new Date(selectedLeave.createdAt).toLocaleDateString()}
                  </div>
                  <div style={styles.reasonSection}>
                    <strong>Reason:</strong>
                    <p style={styles.reasonText}>{selectedLeave.reason}</p>
                  </div>
                </div>

                <div style={styles.actionButtons}>
                  {role === 'student' ? (
                    <button 
                      style={styles.withdrawButton} 
                      onClick={() => handleAction('withdraw')}
                    >
                      Withdraw Request
                    </button>
                  ) : (
                    <>
                      <button 
                        style={styles.approveButton} 
                        onClick={() => handleAction('approved')}
                      >
                        <CheckCircle size={16} style={{ marginRight: '6px' }} />
                        Approve
                      </button>
                      <button 
                        style={styles.rejectButton} 
                        onClick={() => handleAction('rejected')}
                      >
                        <XCircle size={16} style={{ marginRight: '6px' }} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f23',
    color: '#e2e8f0',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
  },
  header: {
    backgroundColor: '#1a1a2e',
    borderBottom: '1px solid #2a2a3a',
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  backBtnContainer: {
    marginBottom: '20px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2a2a3a',
    color: '#e2e8f0',
    border: '1px solid #3a3a4a',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  pageTitle: {
    textAlign: 'center',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  breadcrumbItem: {
    color: '#94a3b8',
  },
  breadcrumbSeparator: {
    color: '#64748b',
  },
  breadcrumbActive: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    border: '1px solid #2a2a3a',
    borderRadius: '12px',
    padding: '16px',
    gap: '12px',
    minWidth: '120px',
  },
  statIcon: {
    backgroundColor: '#eab308',
    padding: '8px',
    borderRadius: '8px',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#e2e8f0',
  },
  statLabel: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  },
  noData: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1a1a2e',
    border: '1px solid #2a2a3a',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
      borderColor: '#4f46e5',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: '0 0 4px 0',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#2a2a3a',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  statusIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  statusText: {
    textTransform: 'capitalize',
  },
  cardContent: {
    marginBottom: '16px',
  },
  cardInfoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px',
  },
  cardInfo: {
    color: '#94a3b8',
  },
  durationBadge: {
    display: 'inline-block',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  reasonPreview: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.4',
  },
  cardFooter: {
    borderTop: '1px solid #2a2a3a',
    paddingTop: '12px',
  },
  cardFooterText: {
    fontSize: '12px',
    color: '#64748b',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  dialog: {
    backgroundColor: '#1a1a2e',
    border: '1px solid #2a2a3a',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  detailDialog: {
    backgroundColor: '#1a1a2e',
    border: '1px solid #2a2a3a',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #2a2a3a',
  },
  dialogTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
  dialogContent: {
    padding: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#94a3b8',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#2a2a3a',
    color: '#e2e8f0',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#2a2a3a',
    color: '#e2e8f0',
    resize: 'vertical',
    minHeight: '120px',
    transition: 'border-color 0.3s ease',
  },
  dialogActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '12px 24px',
    border: '1px solid #3a3a4a',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  submitBtn: {
    padding: '12px 24px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: '#0f0f23',
    borderRadius: '8px',
    border: '1px solid #2a2a3a',
  },
  detailHeaderLeft: {
    flex: 1,
  },
  detailTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: '0 0 4px 0',
  },
  detailSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  detailBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailRow: {
    fontSize: '14px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  reasonSection: {
    marginTop: '8px',
  },
  reasonText: {
    fontSize: '14px',
    color: '#e2e8f0',
    lineHeight: '1.6',
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#0f0f23',
    borderRadius: '8px',
    border: '1px solid #2a2a3a',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  approveButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  rejectButton: {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 18px',
  backgroundColor: '#ef4444',     // Tailwind's red-500
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', // subtle red shadow
  cursor: 'pointer',
  transition: 'all 0.3s ease',
},

}
export default LeaveRequest;
