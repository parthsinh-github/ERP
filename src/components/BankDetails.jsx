import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setAllBankDetails } from "../redux/bankDetailSlice";
import useGetAllBankDetail from "../hooks/useGetAllBankDetail";


import { BANK_API_END_POINT } from '@/utils/constant';

const BankDetails = () => {
 const hookResult = useGetAllBankDetail() || {};
const { loading, error } = hookResult;

  const { id } = useParams();
  const dispatch = useDispatch();
  const { allBankDetails } = useSelector((state) => state.bankDetail);

  // Form state
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
  });

  // File handling state
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  
  // UI state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Memoized bank details list
  const bankList = useMemo(
    () => (Array.isArray(allBankDetails) ? allBankDetails.filter(Boolean) : []),
    [allBankDetails]
  );

  // Show notification with auto-dismiss
  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle file uploads with validation
  const handleFileChange = useCallback((e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    
    if (!file) {
      setFiles(prev => ({ ...prev, [name]: null }));
      setPreviews(prev => ({ ...prev, [name]: null }));
      return;
    }

    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (file.size > maxSize) {
      showNotification("File size should be less than 5MB", "error");
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      showNotification("Only JPG, PNG, and PDF files are allowed", "error");
      return;
    }

    setFiles(prev => ({ ...prev, [name]: file }));
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [name]: previewUrl }));
    } else {
      setPreviews(prev => ({ ...prev, [name]: 'pdf' }));
    }
  }, [showNotification]);

  // Form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!id) {
      showNotification("Student ID is required", "error");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    const uploadData = new FormData();
    uploadData.append("id", id);
    
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim()) {
        uploadData.append(key, value.trim());
      }
    });

    // Append files if present
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        uploadData.append(key, file);
      }
    });

    try {
      const response = await axios.post(
        `${BANK_API_END_POINT}/${id}`,
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      if (response.data.success) {
        showNotification("Bank details uploaded successfully!", "success");
        
        // Update Redux store
        dispatch(setAllBankDetails([
          ...(allBankDetails || []), 
          response.data.savedBank
        ]));
        
        // Reset form
        setFormData({
          bankName: "",
          accountNumber: "",
          ifsc: "",
          branch: "",
        });
        setFiles({});
        setPreviews({});
        
      } else {
        showNotification(response.data.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Network error occurred";
      showNotification(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  }, [id, formData, files, allBankDetails, dispatch, showNotification]);

  // Safe base64 conversion for images
  const convertToBase64 = useCallback((fileObj) => {
    if (!fileObj?.data?.data) return null;
    
    try {
      const uint8Array = new Uint8Array(fileObj.data.data);
      const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      return `data:${fileObj.contentType};base64,${btoa(binaryString)}`;
    } catch (error) {
      console.error("Error converting to base64:", error);
      return null;
    }
  }, []);

  // Clean up preview URLs on unmount
  React.useEffect(() => {
    return () => {
      Object.values(previews).forEach(url => {
        if (url && url !== 'pdf' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  if (loading) {
    return (
      <div className="bank-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading bank details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bank-container">
      <style>{`
        .bank-container {
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e2e8f0;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        }

        .notification.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .notification.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .notification.info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        .bank-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .bank-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .bank-card h3 {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bank-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 14px;
          color: #2d3748;
          font-weight: 500;
        }

        .bank-documents {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .document-item {
          text-align: center;
        }

        .document-label {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
        }

        .doc-image {
          width: 100%;
          max-width: 200px;
          height: 150px;
          object-fit: cover;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .doc-image:hover {
          transform: scale(1.02);
          border-color: #3182ce;
          box-shadow: 0 4px 12px rgba(49, 130, 206, 0.15);
        }

        .upload-form {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .file-input-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .file-input {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-input-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          background: #f7fafc;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #4a5568;
        }

        .file-input-label:hover {
          border-color: #3182ce;
          background: #ebf8ff;
          color: #3182ce;
        }

        .preview-container {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .preview-image {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }

        .pdf-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          font-size: 12px;
          color: #dc2626;
        }

        .progress-container {
          margin: 20px 0;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3182ce, #63b3ed);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #718096;
          margin-top: 4px;
          text-align: center;
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px -5px rgba(102, 126, 234, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #718096;
        }

        .empty-state h3 {
          font-size: 18px;
          margin: 0 0 8px 0;
          color: #4a5568;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3182ce;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .bank-container {
            padding: 16px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .bank-info {
            grid-template-columns: 1fr;
          }
          
          .bank-documents {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">
          🏦 Bank Details Management
        </h1>
      </div>

      {/* Notification */}
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="notification error">
          Error loading bank details: {error}
        </div>
      )}

      {/* Existing Bank Details */}
      {bankList.length > 0 ? (
        <div>
          {bankList.map((detail) => (
            <div key={detail._id} className="bank-card">
              <h3>🏛️ {detail.bankName}</h3>
              
              <div className="bank-info">
                <div className="info-item">
                  <span className="info-label">Account Number</span>
                  <span className="info-value">{detail.accountNumber}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">IFSC Code</span>
                  <span className="info-value">{detail.ifsc}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Branch</span>
                  <span className="info-value">{detail.branch}</span>
                </div>
              </div>

              {(detail.passbook || detail.cheque) && (
                <div className="bank-documents">
                  {detail.passbook && (
                    <div className="document-item">
                      <div className="document-label">📖 Passbook</div>
                      <img 
                        src={convertToBase64(detail.passbook)} 
                        alt="Passbook" 
                        className="doc-image" 
                      />
                    </div>
                  )}
                  {detail.cheque && (
                    <div className="document-item">
                      <div className="document-label">💳 Cheque</div>
                      <img 
                        src={convertToBase64(detail.cheque)} 
                        alt="Cheque" 
                        className="doc-image" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="empty-state">
            <h3>No Bank Details Found</h3>
            <p>Upload your bank details using the form below.</p>
          </div>
        )
      )}

      {/* Upload Form - Show only if no bank details exist or there's an error */}
      {(bankList.length === 0 || error) && !loading && (
        <form onSubmit={handleSubmit} className="upload-form">
          <h3 style={{ marginBottom: '24px', color: '#2d3748' }}>
            📝 Add Bank Details
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Bank Name *</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter bank name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Number *</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter account number"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">IFSC Code *</label>
              <input
                type="text"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter IFSC code"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch Name *</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter branch name"
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Passbook Document</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="passbook"
                  onChange={handleFileChange}
                  className="file-input"
                  accept="image/*,.pdf"
                />
                <div className="file-input-label">
                  📄 Choose Passbook File
                </div>
              </div>
              {previews.passbook && (
                <div className="preview-container">
                  {previews.passbook === 'pdf' ? (
                    <div className="pdf-preview">
                      📋 PDF Selected
                    </div>
                  ) : (
                    <img 
                      src={previews.passbook} 
                      alt="Passbook Preview" 
                      className="preview-image" 
                    />
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Cheque Document</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="cheque"
                  onChange={handleFileChange}
                  className="file-input"
                  accept="image/*,.pdf"
                />
                <div className="file-input-label">
                  📄 Choose Cheque File
                </div>
              </div>
              {previews.cheque && (
                <div className="preview-container">
                  {previews.cheque === 'pdf' ? (
                    <div className="pdf-preview">
                      📋 PDF Selected
                    </div>
                  ) : (
                    <img 
                      src={previews.cheque} 
                      alt="Cheque Preview" 
                      className="preview-image" 
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Uploading... {uploadProgress}%
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                Uploading...
              </>
            ) : (
              <>
                🚀 Upload Bank Details
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default BankDetails;