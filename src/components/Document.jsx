import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import useGetAllDocumentRequests from '../hooks/useGetAllDocumentRequests';

const Document = () => {
  const { role, id } = useParams();
  const { allRequests } = useSelector((state) => state.document);
  const { user } = useSelector((state) => state.auth);

  const [showDialog, setShowDialog] = useState(false);

  useGetAllDocumentRequests();

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
      <h2 style={styles.heading}>📄 Document Requests</h2>

      {/* ✅ Show create request button for students */}
      {user?.role === 'student' && (
        <div style={styles.btnWrapper}>
          <button style={styles.createBtn} onClick={() => setShowDialog(true)}>
            ➕ Create New Request
          </button>
        </div>
      )}

      {/* ✅ Show Modal Dialog */}
      {showDialog && <CreateDocumentDialog id={id} onClose={() => setShowDialog(false)} />}

      {allRequests.length === 0 ? (
        <p style={styles.noData}>No document requests found.</p>
      ) : (
        <div style={styles.grid}>
          {allRequests.map((req) => (
            <div key={req._id} style={styles.card}>
              <h3 style={styles.title}>{req.documentType}</h3>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Student:</strong> {req.student?.fullName}</p>
              <p><strong>Contact:</strong> {req.contactNumber}</p>
              <p><strong>Email:</strong> {req.deliveryEmail || 'N/A'}</p>
              <p><strong>Delivery Mode:</strong> {req.deliveryMode}</p>
              <p><strong>Need by:</strong> {req.expectedNeedDate ? new Date(req.expectedNeedDate).toDateString() : 'Not mentioned'}</p>
              <p><strong>Status:</strong>
                <span style={getStatusStyle(req.status)}> {req.status.toUpperCase()} </span>
              </p>

              <div style={styles.actions}>
                {req.status === 'pending' ? (
                  <>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleAction(req._id, 'approved')}
                    >
                      <CheckCircle size={16} style={{ marginRight: '5px' }} />
                      Approve
                    </button>
                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleAction(req._id, 'rejected')}
                    >
                      <XCircle size={16} style={{ marginRight: '5px' }} />
                      Reject
                    </button>
                  </>
                ) : (
                  <div style={styles.readOnlyStatus}>
                    <Clock size={14} /> Action already taken
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

// 🧩 Modal component
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
      const res = await fetch(`http://localhost:3000/api/v1/document/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

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
    <div style={styles.dialogOverlay}>
      <div style={styles.dialog}>
        <h3 style={{ marginBottom: '12px' }}>📩 Create Document Request</h3>
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input name="documentType" placeholder="Document Type" required onChange={handleChange} />
          <input name="reason" placeholder="Reason" required onChange={handleChange} />
          <select name="deliveryMode" onChange={handleChange}>
            <option value="email">Email</option>
            <option value="print">Printed Copy</option>
          </select>
          <input name="deliveryEmail" placeholder="Delivery Email (if email)" onChange={handleChange} />
          <input name="contactNumber" placeholder="Contact Number" required onChange={handleChange} />
          <input type="date" name="expectedNeedDate" onChange={handleChange} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.createBtn}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 💄 Styles
const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#333',
  },
  btnWrapper: {
    textAlign: 'right',
    marginBottom: '20px',
  },
  createBtn: {
    padding: '10px 18px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: '0.3s',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: '10px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
  approveBtn: {
    backgroundColor: '#22c55e',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  readOnlyStatus: {
    marginTop: '10px',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  dialogOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'approved':
      return { color: '#22c55e', fontWeight: 'bold' };
    case 'rejected':
      return { color: '#ef4444', fontWeight: 'bold' };
    default:
      return { color: '#eab308', fontWeight: 'bold' };
  }
};

export default Document;
