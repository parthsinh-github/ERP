import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Plus, FileText, User, Phone, Mail, Calendar, Package } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllDocumentRequests from '../hooks/useGetAllDocumentRequests';

import { DOCUMENT_API_END_POINT } from '@/utils/constant';



const Document = () => {
  const { role, id } = useParams();
  const { allRequests } = useSelector((state) => state.document);
   useGetAllDocumentRequests();
  const { user } = useSelector((state) => state.auth);

    

  const [showDialog, setShowDialog] = useState(false);

  useGetAllDocumentRequests();
  const handleAction = async (requestId, status) => {
    try {
      const res = await fetch(`${DOCUMENT_API_END_POINT}/${id}/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          logMessage: `Marked as ${status} by admin`,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      if (data.success) {
        alert(`✅ Status updated to ${status}`);
        window.location.reload();
      } else {
        alert(`⚠️ Failed to update: ${data.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('❌ Error updating status:', err.message || err);
      alert(`❌ Error: ${err.message || 'Status update failed'}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTitle}>
            <FileText style={styles.headerIcon} />
            <h1 style={styles.heading}>Document Requests</h1>
          </div>
          <div style={styles.headerStats}>
            <span style={styles.statBadge}>
              {allRequests.length} {allRequests.length === 1 ? 'Request' : 'Requests'}
            </span>
          </div>
        </div>
        
        {user?.role === 'student' && (
          <button style={styles.createBtn} onClick={() => setShowDialog(true)}>
            <Plus size={18} />
            Create New Request
          </button>
        )}
      </div>

      {showDialog && <CreateDocumentDialog id={id} onClose={() => setShowDialog(false)} />}

      {allRequests.length === 0 ? (
        <div style={styles.emptyState}>
          <FileText size={64} style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>No document requests found</h3>
          <p style={styles.emptyText}>
            {user?.role === 'student' 
              ? 'Create your first document request to get started' 
              : 'Students haven\'t submitted any requests yet'}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {allRequests.map((req) => (
            <div key={req._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{req.documentType}</h3>
                <div style={getStatusBadgeStyle(req.status)}>
                  {req.status.toUpperCase()}
                </div>
              </div>
              
              <div style={styles.cardContent}>
                <div style={styles.infoRow}>
                  <FileText size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Reason:</span>
                  <span style={styles.infoValue}>{req.reason}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <User size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Student:</span>
                  <span style={styles.infoValue}>{req.student?.fullName}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <Phone size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Contact:</span>
                  <span style={styles.infoValue}>{req.contactNumber}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <Mail size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Email:</span>
                  <span style={styles.infoValue}>{req.deliveryEmail || 'N/A'}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <Package size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Delivery:</span>
                  <span style={styles.infoValue}>{req.deliveryMode}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <Calendar size={16} style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Need by:</span>
                  <span style={styles.infoValue}>
                    {req.expectedNeedDate ? new Date(req.expectedNeedDate).toDateString() : 'Not mentioned'}
                  </span>
                </div>
              </div>

              <div style={styles.cardActions}>
                {req.status === 'pending' ? (
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleAction(req._id, 'approved')}
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleAction(req._id, 'rejected')}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div style={styles.readOnlyStatus}>
                    <Clock size={16} />
                    Action completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateDocumentDialog = ({ id, onClose }) => {
  const [form, setForm] = useState({
    documentType: '',
    reason: '',
    deliveryMode: 'email',
    deliveryEmail: '',
    contactNumber: '',
    expectedNeedDate: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
       const res = await fetch(`${DOCUMENT_API_END_POINT}/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Dara : ", data);
      

      if (res.ok) {
        alert('✅ Request created');
        onClose();
        window.location.reload();
      } else {
        alert('❌ Failed to create: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error submitting: ' + error.message);
    }
  };

  return (
    <div style={styles.dialogOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.dialog}>
        <div style={styles.dialogHeader}>
          <h3 style={styles.dialogTitle}>Create Document Request</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
       <div style={styles.form} onSubmit={submitHandler}>
  <div style={styles.formGroup}>
    <label style={styles.label}>Document Type *</label>
    <select 
      name="documentType" 
      required 
      onChange={handleChange}
      style={styles.input}
    >
      <option value="">-- Select Document Type --</option>
      <option value="Bonafide">Bonafide</option>
      <option value="Character Certificate">Character Certificate</option>
      <option value="Leaving Certificate">Leaving Certificate</option>
      <option value="Marksheets">Marksheets</option>
      <option value="Caste Certificate">Caste Certificate</option>
      <option value="Transfer Certificate">Transfer Certificate</option>
      <option value="Fee Structure">Fee Structure</option>
      <option value="Migration Certificate">Migration Certificate</option>
      <option value="Scholarship Letter">Scholarship Letter</option>
    </select>
  </div>

          
          <div style={styles.formGroup}>
            <label style={styles.label}>Reason *</label>
            <input 
              name="reason" 
              placeholder="Purpose for requesting this document"
              required 
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
        <div style={styles.formGroup}>
  <label style={styles.label}>Delivery Mode</label>
  <select name="deliveryMode" onChange={handleChange} style={styles.select}>
    <option value="">-- Select Delivery Mode --</option>
    <option value="physical">Physical</option>
    <option value="email">Email</option>
    <option value="both">Both</option>
  </select>
</div>

          
          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Email</label>
            <input 
              name="deliveryEmail" 
              placeholder="your.email@example.com"
              type="email"
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Number *</label>
            <input 
              name="contactNumber" 
              placeholder="+1 (555) 123-4567"
              required 
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Expected Need Date</label>
            <input 
              type="date" 
              name="expectedNeedDate" 
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.dialogActions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} onClick={submitHandler}>
              <Plus size={16} />
              Create Request
            </button>
          </div>
        </div>
      </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    color: '#ffffff',
    size: 32,
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0',
    letterSpacing: '-0.02em',
  },
  headerStats: {
    display: 'flex',
    gap: '12px',
  },
  statBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
  grid: {
    display: 'grid',
    gap: '24px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
    flex: 1,
    lineHeight: '1.3',
  },
  cardContent: {
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
    minWidth: '70px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '400',
  },
  cardActions: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '16px',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  approveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
  },
  rejectBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
  },
  readOnlyStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
  },
  dialogOverlay: {
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
  dialog: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 0',
  },
  dialogTitle: {
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
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
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
  select: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #f1f5f9',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)',
  },
};

const getStatusBadgeStyle = (status) => {
  const baseStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  };

  switch (status) {
    case 'approved':
      return {
        ...baseStyle,
        backgroundColor: '#d1fae5',
        color: '#065f46',
        border: '1px solid #a7f3d0',
      };
    case 'rejected':
      return {
        ...baseStyle,
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fecaca',
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fed7aa',
      };
  }
};

export default Document;