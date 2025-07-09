import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import axios from 'axios';
import useGetAllExam from '../hooks/useGetAllExam';
import { useNavigate, useParams } from 'react-router-dom';

const Exam = () => {
  
   useGetAllExam();

   const navigate = useNavigate();
   
  const { role, id } = useParams(); // get dynamic params
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
      credentials: 'include', // Only if you're using cookie-based auth
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
      // Optional: refresh exam list here
    } else {
      alert('⚠️ Failed to create exam');
    }
  } catch (error) {
    alert('❌ Error creating exam: ' + error.message);
  }

};

  const handleBack = () => {
    // Navigates directly to /role/id
    navigate(`/${role}/${id}`);
  };
  return (
    <div style={styles.page}>
    <button onClick={handleBack} style={styles.backButton}>
      ← Back
    </button>

      <h2 style={styles.heading}>📚 Upcoming Exams</h2>

      {(user?.role === 'admin' || user?.role === 'faculty') && (
  <button onClick={() => setIsModalOpen(true)} style={styles.createButton}>
    Create
  </button>
)}


     {/* Add Exam Form (Only for admin or faculty) */}
{(user?.role === 'admin' || user?.role === 'faculty') && (
  isModalOpen && (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3 style={styles.modalTitle}>Create New Exam</h3>
        <form onSubmit={handleCreateExam} style={styles.form}>
          {[
            { name: 'title', placeholder: 'Exam Title' },
            { name: 'examType', placeholder: 'Exam Type' },
            { name: 'date', type: 'date' },
            { name: 'startTime', placeholder: 'Start Time (e.g. 09:00 AM)' },
            { name: 'endTime', placeholder: 'End Time (e.g. 12:00 PM)' },
            { name: 'department', placeholder: 'Department' },
            { name: 'semester', type: 'number', placeholder: 'Semester' },
            { name: 'subject', placeholder: 'Subject' },
            { name: 'createdBy', placeholder: 'Created By (user ID)' },
          ].map(({ name, placeholder, type = 'text' }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          ))}
          <div style={styles.modalActions}>
            <button type="submit" style={styles.createButton}>Create Exam</button>
            <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
)}


      {allExam && allExam.length > 0 ? (
        <div style={styles.cardGrid}>
          {allExam.map((exam) => (
            <div key={exam._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{exam.title}</h3>
                <p style={styles.cardSubtitle}>{exam.subject}</p>
              </div>
              <div style={styles.cardBody}>
                <p><strong>🏛 Department:</strong> {exam.department}</p>
                <p><strong>📅 Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
                <p><strong>🕒 Time:</strong> {exam.startTime} - {exam.endTime}</p>
                <p><strong>🎓 Semester:</strong> {exam.semester}</p>
              </div>
              <div style={styles.cardFooter}>
                👤 <strong>Created By:</strong> {exam.createdBy?.email || 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noExamsText}>No exams found.</p>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: '40px 20px',
    background: 'linear-gradient(to top right, #f8f9ff, #e0e7ff)',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  backButton: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
  },
  heading: {
    fontSize: '32px',
    textAlign: 'center',
    color: '#4b0082',
    marginBottom: '20px',
  },
  createButton: {
    backgroundColor: '#16a34a',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto 30px auto',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    width: '500px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  },
  modalTitle: {
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '15px',
  },
  input: {
    padding: '12px 18px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: '0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  noExamsText: {
    textAlign: 'center',
    color: 'red',
    fontSize: '16px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    color: '#333',
    textAlign: 'center',
  },
  cardHeader: {
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4b0082',
  },
  cardSubtitle: {
    fontSize: '16px',
    color: '#9e9e9e',
  },
  cardBody: {
    fontSize: '14px',
    color: '#555',
  },
  cardFooter: {
    marginTop: '15px',
    fontSize: '13px',
    color: '#777',
  },
};

export default Exam;
