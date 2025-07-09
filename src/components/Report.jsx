import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import useGetAllReport from '../hooks/useGetAllReport';
import { useNavigate, useParams } from 'react-router-dom';

const Report = () => {
   useGetAllReport();   
  const { role, id } = useParams(); // get dynamic params

  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetch('http://localhost:3000/api/v1/report/all')
    .then(response => response.json())
    .then(data => {
      setReports(data.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching reports:', error);
      setLoading(false);
    });
}, []);


  const handleBack = () => {
     navigate(`/${role}/${id}`);
  };

  

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>← Back</button>
      <h2 style={styles.heading}>Report List</h2>

      {loading ? (
        <p style={styles.centerText}>Loading...</p>
      ) : reports.length === 0 ? (
        <p style={styles.centerText}>No reports found.</p>
      ) : (
        <div style={styles.list}>
          {reports.map((report) => (
            <div key={report._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.title}>{report.title}</h3>
                <span style={{
                  ...styles.status,
                  ...(report.status === 'Pending' ? styles.pending : styles.approved)
                }}>
                  {report.status}
                </span>
              </div>
              <p><strong>Type:</strong> {report.type}</p>
              <p>{report.description}</p>
              <p style={styles.date}><strong>Date Issued:</strong> {new Date(report.dateIssued).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  backButton: {
    marginBottom: '16px',
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px'
  },
  centerText: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fafafa',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  status: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: '1px solid'
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderColor: '#ffeeba'
  },
  approved: {
    backgroundColor: '#d4edda',
    color: '#155724',
    borderColor: '#c3e6cb'
  },
  date: {
    fontSize: '13px',
    color: '#555',
    marginTop: '8px'
  }
};

export default Report;
