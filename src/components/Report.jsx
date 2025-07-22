import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useGetAllReport from '../hooks/useGetAllReport';

import { REPORT_API_END_POINT } from '@/utils/constant';
import { useSelector } from 'react-redux';

const Report = () => {
  useGetAllReport();
  const { role, id } = useParams();
  const navigate = useNavigate();
  const { allReport } = useSelector((state) => state.report);
    const { user } = useSelector((state) => state.auth);

    

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newReport, setNewReport] = useState({
    type: "Exam",
    title: "",
    description: "",
    dateIssued: new Date().toISOString().split('T')[0]
  });

  const handleBack = () => {
    navigate(`/${role}/${id}`);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: '#f59e0b', 
        bg: '#fef3c7', 
        text: '#92400e',
        icon: '⏳'
      },
      approved: { 
        color: '#10b981', 
        bg: '#d1fae5', 
        text: '#065f46',
        icon: '✅'
      },
      rejected: { 
        color: '#ef4444', 
        bg: '#fee2e2', 
        text: '#991b1b',
        icon: '❌'
      },
      default: { 
        color: '#6b7280', 
        bg: '#f3f4f6', 
        text: '#374151',
        icon: '📄'
      }
    };
    return configs[status.toLowerCase()] || configs.default;
  };

  const getTypeIcon = (type) => {
    const icons = {
      exam: '📝',
      discipline: '⚖️',
      performance: '📈',
      other: '📋'
    };
    return icons[type.toLowerCase()] || icons.other;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredReports = allReport.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  

  return (
    <div style={styles.container}>
      {/* Modern Header */}
      <div style={styles.headerContainer}>
        <div style={styles.headerTop}>
          <div style={styles.breadcrumb}>
               {/* {(role === "admin" || role === "faculty") && (
          <button 
            onClick={() => setShowModal(true)} 
            style={styles.primaryButton}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Create Report
          </button>
        )} */}
            <span style={styles.breadcrumbText}>Dashboard</span>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbCurrent}>Reports</span>
          </div>
          
          <div style={styles.headerActions}>
            <div style={styles.reportStats}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{allReport.length}</span>
                <span style={styles.statLabel}>Total Reports</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>
                  {allReport.filter(r => r.status.toLowerCase() === 'pending').length}
                </span>
                <span style={styles.statLabel}>Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.headerMain}>
          <div style={styles.titleSection}>
            <h1 style={styles.pageTitle}>Report Management</h1>
            <p style={styles.pageSubtitle}>View and manage all academic reports</p>
          </div>
          
        {(role === 'admin' || role === 'faculty') && (
  <button 
    onClick={() => setShowModal(true)} 
    style={styles.primaryButton}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
    Create Reportt
  </button>
)}

        </div>
      </div>

      {/* Modern Controls */}
      <div style={styles.controlsContainer}>
        <div style={styles.searchContainer}>
          <svg style={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search reports by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.filtersContainer}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button style={styles.filterButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Modern Grid */}
      {filteredReports.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📄</div>
          <h3 style={styles.emptyTitle}>No Reports Found</h3>
          <p style={styles.emptyMessage}>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first report to get started'}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredReports.map((report) => {
            const statusConfig = getStatusConfig(report.status);
            return (
              <div key={report._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitleSection}>
                    <div style={styles.typeIndicator}>
                      <span style={styles.typeIcon}>{getTypeIcon(report.type)}</span>
                      <span style={styles.typeText}>{report.type}</span>
                    </div>
                    <h3 style={styles.cardTitle}>{report.title}</h3>
                  </div>
                  
                  <div 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: statusConfig.bg,
                      color: statusConfig.text,
                      border: `1px solid ${statusConfig.color}20`
                    }}
                  >
                    <span style={styles.statusIcon}>{statusConfig.icon}</span>
                    {report.status}
                  </div>
                </div>
                
                <div style={styles.cardContent}>
                  <p style={styles.description}>{report.description}</p>
                  
                  <div style={styles.cardMeta}>
                    <div style={styles.metaItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>Issued: {formatDate(report.dateIssued)}</span>
                    </div>
                    
                    {report.score && (
                      <div style={styles.scoreContainer}>
                        <div style={styles.scoreBar}>
                          <div 
                            style={{
                              ...styles.scoreProgress,
                              width: `${(report.score / report.maxScore) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span style={styles.scoreText}>
                          {report.score}/{report.maxScore}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button style={styles.actionButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View
                  </button>
                  <button style={styles.actionButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Report</h2>
              <button 
                onClick={() => setShowModal(false)} 
                style={styles.modalClose}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch(`${REPORT_API_END_POINT}/${id}/${id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                      ...newReport,
                      studentId: id,
                    }),
                  });
                  const data = await response.json();
                  console.log("DAta" , data);
                  
                  if (data.success) {
                    setShowModal(false);
                    window.location.reload();
                  } else {
                    alert("Error creating report.");
                  }
                } catch (err) {
                  alert("Error: " + err.message);
                }
              }}
              style={styles.modalForm}
            >
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Report Type</label>
                  <select
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                    style={styles.formSelect}
                    required
                  >
                    <option value="Exam">Exam</option>
                    <option value="Discipline">Discipline</option>
                    <option value="Performance">Performance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Issue Date</label>
                  <input
                    type="date"
                    value={newReport.dateIssued}
                    onChange={(e) => setNewReport({ ...newReport, dateIssued: e.target.value })}
                    style={styles.formInput}
                    required
                  />
                </div>
              </div>

 
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Student </label>
                  <input
                    type="Student"
                    value={newReport.Student}
                    onChange={(e) => setNewReport({ ...newReport, Student: e.target.value })}
                    style={styles.formInput}
                    required
                  />
                </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Report Title</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  style={styles.formInput}
                  placeholder="Enter report title"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  style={styles.formTextarea}
                  placeholder="Provide detailed description..."
                  rows="4"
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.secondaryButton}
                >
                  Cancel
                </button>
                {(role === "admin" || role === "faculty") && (
                <button type="submit" style={styles.primaryButton}>
                  Create Report
                </button>
              )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Header Styles
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '32px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    borderBottom: '1px solid #f1f5f9',
  },
  
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#64748b',
  },
  
  breadcrumbText: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  
  breadcrumbSeparator: {
    color: '#cbd5e1',
    fontSize: '14px',
  },
  
  breadcrumbCurrent: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '600',
  },
  
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  
  reportStats: {
    display: 'flex',
    gap: '32px',
  },
  
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1',
  },
  
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  headerMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '24px 32px 32px',
  },
  
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
    lineHeight: '1.2',
  },
  
  pageSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0',
  },
  
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },

  // Controls Styles
  controlsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    padding: '0 32px',
    marginBottom: '32px',
  },
  
  searchContainer: {
    position: 'relative',
    flex: '1',
    maxWidth: '400px',
  },
  
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  
  filtersContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  
  filterSelect: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    minWidth: '120px',
  },
  
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Grid Styles
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px',
    padding: '0 32px',
  },
  
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '16px',
  },
  
  cardTitleSection: {
    flex: '1',
  },
  
  typeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  
  typeIcon: {
    fontSize: '16px',
  },
  
  typeText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0',
    lineHeight: '1.4',
  },
  
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
    flexShrink: 0,
  },
  
  statusIcon: {
    fontSize: '12px',
  },
  
  cardContent: {
    marginBottom: '20px',
  },
  
  description: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: '0 0 16px',
  },
  
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#64748b',
  },
  
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  scoreBar: {
    width: '60px',
    height: '6px',
    backgroundColor: '#f1f5f9',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  
  scoreProgress: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  
  scoreText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  cardActions: {
    display: 'flex',
    gap: '8px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: '1',
    justifyContent: 'center',
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 0',
    marginBottom: '24px',
  },
  
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0',
  },
  
  modalClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  modalForm: {
    padding: '0 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  
  formLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  
  formInput: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  
  formSelect: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  
  formTextarea: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },
  
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '24px',
    borderTop: '1px solid #f1f5f9',
  },
  
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Loading and Empty States
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
    padding: '0 32px',
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f1f5f9',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '500',
  },
  
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
    textAlign: 'center',
    padding: '0 32px',
  },
  
  emptyIcon: {
    fontSize: '48px',
    opacity: '0.5',
  },
  
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0',
  },
  
  emptyMessage: {
    fontSize: '16px',
    color: '#64748b',
    maxWidth: '400px',
    margin: '0',
  },
};

//
export default Report;
