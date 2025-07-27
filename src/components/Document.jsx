import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Plus, FileText, User, Phone, Mail, Calendar, Package, Filter, Search } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllDocumentRequests from '../hooks/useGetAllDocumentRequests';

import { toast, Toaster } from 'react-hot-toast';   // ✅ Added

import { DOCUMENT_API_END_POINT } from '@/utils/constant';

const Document = () => {
  const { role, id } = useParams();
  const { allRequests } = useSelector((state) => state.document);
  useGetAllDocumentRequests();
  const { user } = useSelector((state) => state.auth);

  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleAction = async (requestId, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/document/${id}/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          logMessage: `Marked as ${status} by admin`,
        }),
      });

      const data = await res.json();
      console.log("data : ",data);
      

      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      if (data.success) {
        toast.success(`✅ Status updated to ${status}`);

       
      } else {
      toast.error(`⚠️ Failed to update: ${data.error || 'Unknown error'}`);

      }

    } catch (err) {
      console.error('❌ Error updating status:', err.message || err);
    toast.error(`❌ Error: ${err.message || 'Status update failed'}`);

    }
  };

  // Filter requests based on search and status
  const filteredRequests = allRequests.filter(req => {
    const matchesSearch = req.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status counts
  const getStatusCounts = () => {
    const counts = { pending: 0, approved: 0, rejected: 0 };
    allRequests.forEach(req => {
      counts[req.status] = (counts[req.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div style={styles.pageContainer}>
      <div style={styles.topSection}>
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.heroTitle}>
              <FileText style={styles.heroIcon} />
              <h1 style={styles.mainTitle}>Document Management</h1>
            </div>
            <p style={styles.heroSubtitle}>
              {role === 'admin' 
                ? 'Review and manage student document requests' 
                : 'Request and track your academic documents'}
            </p>
          </div>
          
          {role === 'student' && (
            <button style={styles.ctaButton} onClick={() => setShowDialog(true)}>
              <Plus size={20} />
              New Request
            </button>
          )}
        </div>

        {/* Stats Dashboard */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{allRequests.length}</div>
            <div style={styles.statLabel}>Total Requests</div>
            <div style={styles.statIcon}>📄</div>
          </div>
          <div style={{...styles.statCard, ...styles.pendingCard}}>
            <div style={styles.statNumber}>{statusCounts.pending || 0}</div>
            <div style={styles.statLabel}>Pending</div>
            <div style={styles.statIcon}>⏳</div>
          </div>
          <div style={{...styles.statCard, ...styles.approvedCard}}>
            <div style={styles.statNumber}>{statusCounts.approved || 0}</div>
            <div style={styles.statLabel}>Approved</div>
            <div style={styles.statIcon}>✅</div>
          </div>
          <div style={{...styles.statCard, ...styles.rejectedCard}}>
            <div style={styles.statNumber}>{statusCounts.rejected || 0}</div>
            <div style={styles.statLabel}>Rejected</div>
            <div style={styles.statIcon}>❌</div>
          </div>
        </div>

        {/* Filters and Search */}
        {allRequests.length > 0 && (
          <div style={styles.filterSection}>
            <div style={styles.searchContainer}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by document type, student name, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            
            <div style={styles.filterContainer}>
              <Filter size={16} style={styles.filterIcon} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {showDialog && <CreateDocumentDialog id={id} onClose={() => setShowDialog(false)} />}

      {filteredRequests.length === 0 ? (
        <div style={styles.emptyState}>
          {allRequests.length === 0 ? (
            <>
              <div style={styles.emptyIcon}>📋</div>
              <h3 style={styles.emptyTitle}>No document requests yet</h3>
              <p style={styles.emptyText}>
                {user?.role === 'student'
                  ? 'Start by creating your first document request'
                  : 'Students haven\'t submitted any requests yet'}
              </p>
              {role === 'student' && (
                <button style={styles.emptyActionBtn} onClick={() => setShowDialog(true)}>
                  <Plus size={18} />
                  Create First Request
                </button>
              )}
            </>
          ) : (
            <>
              <div style={styles.emptyIcon}>🔍</div>
              <h3 style={styles.emptyTitle}>No matching requests</h3>
              <p style={styles.emptyText}>
                Try adjusting your search terms or filters
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={styles.requestsContainer}>
          <div style={styles.requestsHeader}>
            <h2 style={styles.sectionTitle}>
              {filteredRequests.length === allRequests.length 
                ? 'All Requests' 
                : `Filtered Results (${filteredRequests.length})`}
            </h2>
          </div>
          
          <div style={styles.cardsGrid}>
            {filteredRequests.map((req) => (
              <div key={req._id} style={{
                ...styles.requestCard,
                ...(req.status === 'pending' ? styles.pendingBorder : {}),
                ...(req.status === 'approved' ? styles.approvedBorder : {}),
                ...(req.status === 'rejected' ? styles.rejectedBorder : {})
              }}>
                <div style={styles.cardTopBar}>
                  <div style={styles.documentTypeHeader}>
                    <FileText size={20} style={styles.docIcon} />
                    <h3 style={styles.documentTitle}>{req.documentType}</h3>
                  </div>
                  <div style={getStatusBadgeStyle(req.status)}>
                    {getStatusIcon(req.status)}
                    {req.status.toUpperCase()}
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.primaryInfo}>
                    <div style={styles.reasonSection}>
                      <span style={styles.reasonLabel}>Purpose</span>
                      <p style={styles.reasonText}>{req.reason}</p>
                    </div>
                  </div>

                  <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                      <User size={16} style={styles.detailIcon} />
                      <div style={styles.detailContent}>
                        <span style={styles.detailLabel}>Student</span>
                        <span style={styles.detailValue}>{req.student?.fullName || 'N/A'}</span>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <Phone size={16} style={styles.detailIcon} />
                      <div style={styles.detailContent}>
                        <span style={styles.detailLabel}>Phone</span>
                        <span style={styles.detailValue}>{req.student?.phoneNumber || 'N/A'}</span>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <Mail size={16} style={styles.detailIcon} />
                      <div style={styles.detailContent}>
                        <span style={styles.detailLabel}>Email</span>
                        <span style={styles.detailValue}>{req.student?.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <Calendar size={16} style={styles.detailIcon} />
                      <div style={styles.detailContent}>
                        <span style={styles.detailLabel}>Need by</span>
                        <span style={styles.detailValue}>
                          {req?.expectedNeedDate
                            ? new Date(req.expectedNeedDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Flexible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {req.status === 'pending' && role === 'admin' && (
                  <div style={styles.cardActions}>
                    <button
                      style={styles.approveButton}
                      onClick={() => handleAction(req._id, 'approved')}
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      style={styles.rejectButton}
                      onClick={() => handleAction(req._id, 'rejected')}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:3000/api/v1/document/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
toast.success('✅ Request created successfully!');

        onClose();
      } else {
      toast.error(`❌ Failed to create: ${data.error}`);

      }
    } catch (error) {
     toast.error(`❌ Error submitting: ${error.message}`);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>Create Document Request</h2>
            <p style={styles.modalSubtitle}>Fill in the details for your document request</p>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form style={styles.modalForm} onSubmit={submitHandler}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Document Type *</label>
              <select
                name="documentType"
                required
                onChange={handleChange}
                style={styles.selectInput}
              >
                <option value="">Select document type</option>
                <option value="Bonafide">Bonafide Certificate</option>
                <option value="Character Certificate">Character Certificate</option>
                <option value="Leaving Certificate">Leaving Certificate</option>
                <option value="Marksheets">Academic Marksheets</option>
                <option value="Caste Certificate">Caste Certificate</option>
                <option value="Transfer Certificate">Transfer Certificate</option>
                <option value="Fee Structure">Fee Structure</option>
                <option value="Migration Certificate">Migration Certificate</option>
                <option value="Scholarship Letter">Scholarship Letter</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Expected Need Date</label>
              <input
                type="date"
                name="expectedNeedDate"
                onChange={handleChange}
                style={styles.textInput}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Purpose/Reason *</label>
            <textarea
              name="reason"
              placeholder="Please describe why you need this document..."
              required
              onChange={handleChange}
              style={styles.textareaInput}
              rows={4}
            />
          </div>

          <div style={styles.modalActions}>
            <button 
              type="button" 
              onClick={onClose} 
              style={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved': return '✓';
    case 'rejected': return '✗';
    default: return '⏳';
  }
};

const getStatusBadgeStyle = (status) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '25px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  };

  switch (status) {
    case 'approved':
      return {
        ...baseStyle,
        backgroundColor: '#d1fae5',
        color: '#065f46',
        border: '2px solid #10b981',
      };
    case 'rejected':
      return {
        ...baseStyle,
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: '2px solid #ef4444',
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: '#fef3c7',
        color: '#92400e',
        border: '2px solid #f59e0b',
      };
  }
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
},
  topSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '3rem 2rem 2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  heroContent: {
    color: 'white',
  },
  heroTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  heroIcon: {
    width: '2.5rem',
    height: '2.5rem',
  },
  mainTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
    margin: 0,
    fontWeight: '400',
  },
  ctaButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    backgroundColor: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '15px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2rem',
    textAlign: 'center',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  pendingCard: {
    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
    borderColor: '#f59e0b',
  },
  approvedCard: {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
    borderColor: '#10b981',
  },
  rejectedCard: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
    borderColor: '#ef4444',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statIcon: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '1.5rem',
    opacity: 0.7,
  },
  filterSection: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    minWidth: '300px',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '15px',
    fontSize: '1rem',
    outline: 'none',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '1rem',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  },
  filterIcon: {
    color: '#6b7280',
  },
  filterSelect: {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
  },
  requestsContainer: {
    padding: '2rem',
  },
  requestsHeader: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
    gap: '2rem',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '0',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    border: '2px solid #f1f5f9',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  pendingBorder: {
    borderColor: '#f59e0b',
    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.15)',
  },
  approvedBorder: {
    borderColor: '#10b981',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)',
  },
  rejectedBorder: {
    borderColor: '#ef4444',
    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
  },
  cardTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  documentTypeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  docIcon: {
    color: '#667eea',
  },
  documentTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  cardBody: {
    padding: '2rem',
  },
  primaryInfo: {
    marginBottom: '1.5rem',
  },
  reasonSection: {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  reasonLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  reasonText: {
    margin: '0.5rem 0 0 0',
    fontSize: '1rem',
    color: '#374151',
    lineHeight: '1.6',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
  },
  detailIcon: {
    color: '#6b7280',
    flexShrink: 0,
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  detailLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '0.875rem',
    color: '#374151',
    fontWeight: '500',
  },
  cardActions: {
    display: 'flex',
    gap: '1rem',
    padding: '1.5rem 2rem',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
  },
  approveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  rejectButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    margin: '2rem',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  emptyActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    padding: '1rem',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '2rem 2rem 1rem',
    borderBottom: '1px solid #f1f5f9',
  },
  modalTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  },
  modalSubtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
  closeButton: {
    width: '2.5rem',
    height: '2.5rem',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  },
  modalForm: {
    padding: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  inputLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    letterSpacing: '0.025em',
  },
  textInput: {
    padding: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
    outline: 'none',
  },
  selectInput: {
    padding: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
    outline: 'none',
    cursor: 'pointer',
  },
  textareaInput: {
    padding: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #f1f5f9',
  },
  cancelButton: {
    padding: '1rem 1.5rem',
    backgroundColor: '#f8fafc',
    color: '#6b7280',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
}

export default Document;
