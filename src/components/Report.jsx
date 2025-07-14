import React, { useEffect, useState } from 'react';
import useGetAllReport from '../hooks/useGetAllReport';
import { useNavigate, useParams } from 'react-router-dom';

const Report = () => {
  useGetAllReport();
  const { role, id } = useParams();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/v1/report/all');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setReports(data.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleBack = () => {
    navigate(`/${role}/${id}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'var(--status-pending)';
      case 'approved':
        return 'var(--status-approved)';
      case 'rejected':
        return 'var(--status-rejected)';
      default:
        return 'var(--status-default)';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         report.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Error loading reports: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <h1 style={styles.heading}>Report Dashboard</h1>
        <div style={styles.headerActions}>
          <span style={styles.reportCount}>{filteredReports.length} reports</span>
        </div>
      </header>

      <div style={styles.controls}>
        <div style={styles.searchContainer}>
          <svg style={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
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
      </div>

      {filteredReports.length === 0 ? (
        <div style={styles.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={styles.emptyIcon}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
          <h3 style={styles.emptyTitle}>No reports found</h3>
          <p style={styles.emptyMessage}>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'There are no reports available at the moment'
            }
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredReports.map((report) => (
            <article key={report._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>{report.title}</h2>
                <span 
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(report.status)
                  }}
                >
                  {report.status}
                </span>
              </div>
              
              <div style={styles.cardContent}>
                <div style={styles.typeContainer}>
                  <span style={styles.typeLabel}>Type:</span>
                  <span style={styles.typeValue}>{report.type}</span>
                </div>
                
                <p style={styles.description}>{report.description}</p>
                
                <div style={styles.cardFooter}>
                  <div style={styles.dateContainer}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.dateIcon}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span style={styles.dateText}>
                      {formatDate(report.dateIssued)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#fafbfc',
    minHeight: '100vh'
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e1e8ed'
  },
  
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d9e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#374151',
    ':hover': {
      backgroundColor: '#f8f9fa',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  },
  
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0'
  },
  
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  
  reportCount: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
    backgroundColor: '#f3f4f6',
    padding: '4px 12px',
    borderRadius: '16px'
  },
  
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  
  searchContainer: {
    position: 'relative',
    flex: '1',
    minWidth: '300px'
  },
  
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none'
  },
  
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    fontSize: '14px',
    border: '1px solid #d1d9e0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit'
  },
  
  filterSelect: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #d1d9e0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    }
  },
  
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '16px'
  },
  
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0',
    lineHeight: '1.4'
  },
  
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#ffffff',
    flexShrink: 0
  },
  
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  typeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  typeLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280'
  },
  
  typeValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  
  description: {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: '0'
  },
  
  cardFooter: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6'
  },
  
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  dateIcon: {
    color: '#9ca3af',
    flexShrink: 0
  },
  
  dateText: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500'
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px'
  },
  
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #f3f4f6',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  
  loadingText: {
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '500'
  },
  
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px'
  },
  
  errorText: {
    fontSize: '16px',
    color: '#dc2626',
    textAlign: 'center'
  },
  
  retryButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
    textAlign: 'center'
  },
  
  emptyIcon: {
    color: '#9ca3af',
    marginBottom: '8px'
  },
  
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#4b5563',
    margin: '0'
  },
  
  emptyMessage: {
    fontSize: '16px',
    color: '#6b7280',
    maxWidth: '400px',
    margin: '0'
  }
};

// Add CSS for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  :root {
    --status-pending: #f59e0b;
    --status-approved: #10b981;
    --status-rejected: #ef4444;
    --status-default: #6b7280;
  }
`;
document.head.appendChild(styleSheet);

export default Report;