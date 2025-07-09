import React from 'react';
import { useSelector } from 'react-redux';
import useGetAllIdCard from '@/hooks/useGetAllIdCard';

const IDCard = () => {
  useGetAllIdCard();
  const idCards = useSelector(state => state.idcard.allIdCard);

  console.log("🎓 All ID Cards Received:", idCards); // Check if data is coming

  return (
    <div className="idcard-container">
      <h2 className="idcard-title">Student ID Cards</h2>

      {idCards.length === 0 ? (
        <p className="no-id-msg">No ID cards found.</p>
      ) : (
        <div className="idcard-grid">
          {idCards.map((card, index) => {
            const student = card.student;

            return (
              <div key={card._id || index} className="idcard-card">
                {student ? (
                  <>
                    <h3 className="student-name">{student.fullName}</h3>
                    <p><strong>City:</strong> {student.city}</p>
                    <p><strong>Phone:</strong> {student.phoneNumber}</p>
                    <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
                    <p><strong>DOB:</strong> {new Date(student.dob).toLocaleDateString()}</p>
                  </>
                ) : (
                  <div className="missing-data">
                    ⚠️ Student data missing
                    <p className="missing-id">ID: {card._id}</p>
                  </div>
                )}

                {card.photoURL && (
                  <div className="photo-wrapper">
                    <img
                      src={card.photoURL}
                      alt="ID Photo"
                      className="id-photo"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .idcard-container {
          padding: 24px;
          font-family: sans-serif;
        }

        .idcard-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .no-id-msg {
          color: gray;
        }

        .idcard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .idcard-card {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }

        .idcard-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .student-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .missing-data {
          color: red;
        }

        .missing-id {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .photo-wrapper {
          margin-top: 12px;
        }

        .id-photo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
};

export default IDCard;
