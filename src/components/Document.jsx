import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
// import useGetAllDocumentRequests from '../hooks/useGetAllDocumentRequests';
import useGetAllDocumentRequests from '../hooks/useGetAllDocumentRequests';

const Document = () => {
  const { role, id } = useParams();

  useGetAllDocumentRequests(); // fetches all requests

  const { allRequests } = useSelector((state) => state.document); // coming from slice

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
      console.log("response : " + res);
      console.log("Request id  : " + requestId);


      const data = await res.json();

      if (!res.ok) {
        // Backend responded with an error status
        throw new Error(data.error || 'Failed to update status');
      }

      if (data.success) {
        alert(`✅ Status updated to ${status}`);
        window.location.reload(); // Or better: refetch state using a hook
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
                {req.status === 'pending' && (
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
                )}
                {req.status !== 'pending' && (
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

// 💄 Inline styles
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
};

// 🟡 Dynamic status color
const getStatusStyle = (status) => {
  switch (status) {
    case 'approved':
      return { color: '#22c55e', fontWeight: 'bold' };
    case 'rejected':
      return { color: '#ef4444', fontWeight: 'bold' };
    default:
      return { color: '#eab308', fontWeight: 'bold' }; // pending
  }
};

export default Document;
