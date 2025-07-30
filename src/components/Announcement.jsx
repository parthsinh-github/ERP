import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { toast, Toaster } from 'react-hot-toast';   // ✅ Added

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Calendar, User, Plus, Bell } from 'lucide-react';
import useGetAllAnnouncement from '../hooks/useGetAllAnnouncement';

import { ANNOUNCEMENT_API_END_POINT } from '@/utils/constant';

const Announcement = () => {
  useGetAllAnnouncement();

  const { role, id } = useParams();
  const navigate = useNavigate();
  const { allAnnouncement, searchedQuery } = useSelector(state => state.announcement);

  const { user } = useSelector(state => state.auth);
  
  
  

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    if (!id) {
      toast.error('User ID is missing. Cannot create announcement.');
      setSubmitting(false);
      return;
    }

    // ✅ Convert empty strings to null
    const cleanedData = {
      ...formData,
      stream: formData.stream || null,
      batchYear: formData.batchYear || null,
      division: formData.division || null,
      createdBy: id,
    };
    
    const response = await fetch(`${ANNOUNCEMENT_API_END_POINT}/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanedData),
      credentials: 'include',
    });

    const data = await response.json();
    console.log("Dtaa  : ", data);

    if (response.ok) {
      toast.success('✅ Announcement added!');
      setFormData({ title: '', description: '', date: '' });
      setShowForm(false);
    } else {
      toast.error(`⚠️ Failed to create announcement: ${data.error || 'Unknown error'}`);
    }
  } catch (err) {
    console.error(err);
    toast.error('❌ Error creating announcement');
  } finally {
    setSubmitting(false);
  }
};


  const closeDialog = () => {
    setSelectedAnnouncement(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({ title: '', description: '', date: '' });
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
              <Bell size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Latest Announcements
            </h2>
            <div style={styles.breadcrumb}>
              <span style={styles.breadcrumbItem}>Dashboard</span>
              <span style={styles.breadcrumbSeparator}>•</span>
              <span style={styles.breadcrumbActive}>Announcements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Add Announcement Button (Only for admin or faculty) */}
        {(role === 'admin' || role === 'faculty') && (
          <div style={styles.actionBar}>
            <button 
              onClick={() => setShowForm(true)} 
              style={styles.addButton}
            >
              <Plus size={20} style={{ marginRight: '8px' }} />
              Add New Announcement
            </button>
          </div>
        )}

        {/* Searched Query Info */}
        {searchedQuery && (
          <div style={styles.searchResults}>
            <p style={styles.searchQuery}>
              Showing results for: <span style={styles.highlight}>{searchedQuery}</span>
            </p>
          </div>
        )}

        {/* Announcements Grid */}
        {allAnnouncement.length === 0 ? (
          <div style={styles.noData}>
            <Bell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>No announcements found</h3>
            <p>Check back later for updates and notifications.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {allAnnouncement.map((item) => (
              <div 
                key={item._id} 
                style={styles.card}
                onClick={() => setSelectedAnnouncement(item)}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <div style={styles.cardBadge}>New</div>
                </div>
                <p style={styles.cardText}>
                  {item.description.length > 100 
                    ? `${item.description.substring(0, 100)}...` 
                    : item.description
                  }
                </p>
                <div style={styles.cardFooter}>
                  <div style={styles.meta}>
                    <Calendar size={16} style={{ marginRight: '6px' }} />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.meta}>
                    <User size={16} style={{ marginRight: '6px' }} />
                    <span>{item.createdBy?.fullName || 'Admin'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Announcement Form Dialog */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <div style={styles.dialogHeader}>
              <h3 style={styles.dialogTitle}>Create New Announcement</h3>
              <button onClick={closeForm} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.dialogContent}>
              <form onSubmit={handleSubmit} style={styles.form}>
               <div style={styles.inputGroup}>
  <label style={styles.label}>Title</label>
  <input
    type="text"
    name="title"
    placeholder="Enter announcement title"
    value={formData.title}
    onChange={handleChange}
    style={styles.input}
    required
  />
</div>

<div style={styles.inputGroup}>
  <label style={styles.label}>Description</label>
  <textarea
    name="description"
    placeholder="Enter announcement description"
    value={formData.description}
    onChange={handleChange}
    style={styles.textarea}
    required
  />
</div>

<div style={styles.inputGroup}>
  <label style={styles.label}>Batch Year</label>
  <select
    name="batchYear"
    value={formData.batchYear}
    onChange={handleChange}
    
    style={styles.select} // Add this in your styles
  >
    <option value="">Select Batch Year</option>
    <option value="2023">2023</option>
    <option value="2024">2024</option>
    <option value="2025">2025</option>
    <option value="2026">2026</option>
  </select>
</div>

<div style={styles.inputGroup}>
  <label style={styles.label}>Stream</label>
  <select
    name="stream"
    value={formData.stream}
    onChange={handleChange}
    
    style={styles.select}
  >
    <option value="">Select Stream</option>
    <option value="BBA">BBA</option>
    <option value="BCA">BCA</option>
    <option value="BTECH">BTECH</option>
    <option value="BCOM">BCOM</option>
    <option value="MCA">MCA</option>
    <option value="MBA">MBA</option>
    <option value="OTHER">OTHER</option>
  </select>
</div>

<div style={styles.inputGroup}>
  <label style={styles.label}>Division</label>
  <select
    name="division"
    value={formData.division}
    onChange={handleChange}
    
    style={styles.select}
  >
    <option value="">Select Division</option>
    <option value="Div-1">Div-1</option>
    <option value="Div-2">Div-2</option>
    <option value="Div-3">Div-3</option>
    <option value="Div-4">Div-4</option>
    <option value="Div-5">Div-5</option>
  </select>
</div>

<div style={styles.inputGroup}>
  <label style={styles.label}>Date</label>
  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    style={styles.input}
    required
  />
</div>

                <div style={styles.dialogActions}>
                  <button type="button" onClick={closeForm} style={styles.cancelButton}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Announcement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Detail Dialog */}
      {selectedAnnouncement && (
        <div style={styles.overlay}>
          <div style={styles.announcementDialog}>
            <div style={styles.dialogHeader}>
              <h3 style={styles.dialogTitle}>{selectedAnnouncement.title}</h3>
              <button onClick={closeDialog} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.dialogContent}>
              <div style={styles.announcementMeta}>
                <div style={styles.metaItem}>
                  <Calendar size={16} style={{ marginRight: '6px' }} />
                  <span>{new Date(selectedAnnouncement.date).toLocaleDateString()}</span>
                </div>
                <div style={styles.metaItem}>
                  <User size={16} style={{ marginRight: '6px' }} />
                  <span>By: {selectedAnnouncement.createdBy?.fullName || 'Admin'}</span>
                </div>
              </div>
              <div style={styles.announcementContent}>
                <p style={styles.fullDescription}>{selectedAnnouncement.description}</p>
              </div>
              <div style={styles.announcementContent}>
                <p style={styles.fullDescription}>{selectedAnnouncement.batchYear}</p>
              </div>
              <div style={styles.announcementContent}>
                <p style={styles.fullDescription}>{selectedAnnouncement.division}</p>
              </div>
              <div style={styles.announcementContent}>
                <p style={styles.fullDescription}>{selectedAnnouncement.stream}</p>
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
    ':hover': {
      backgroundColor: '#3a3a4a',
      borderColor: '#4f46e5',
    },
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
    justifyContent: 'flex-end',
    marginBottom: '30px',
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
  searchResults: {
    backgroundColor: '#1a1a2e',
    border: '1px solid #2a2a3a',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  searchQuery: {
    margin: 0,
    fontSize: '14px',
    color: '#94a3b8',
  },
  highlight: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  noData: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: 0,
    flex: 1,
  },
  cardBadge: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  cardText: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
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
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  announcementDialog: {
    backgroundColor: '#1a1a2e',
    border: '1px solid #2a2a3a',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '600px',
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
  announcementMeta: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#0f0f23',
    borderRadius: '8px',
    border: '1px solid #2a2a3a',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#94a3b8',
  },
  announcementContent: {
    lineHeight: '1.6',
  },
  fullDescription: {
    fontSize: '16px',
    color: '#e2e8f0',
    margin: 0,
    lineHeight: '1.8',
  },
};

export default Announcement;