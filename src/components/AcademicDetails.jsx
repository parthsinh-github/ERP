import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllAcademicDetails from '../hooks/useGetAllAcadamicDetails';
import { useParams } from 'react-router-dom';


import { ACADAMIC_API_END_POINT } from '@/utils/constant';

const AcademicDetails = () => {
  const dispatch = useDispatch();
  useGetAllAcademicDetails();
  const { role, id } = useParams();
  const { user } = useSelector(state => state.auth);
  const { allAcademicDetails, loading } = useSelector(state => state.academicDetail || {});

  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [dragOver, setDragOver] = useState({});
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const documentTypes = useMemo(() => [
    { key: 'tenthMarksheet', label: '10th Marksheet', icon: '📜', category: 'academic' },
    { key: 'twelfthMarksheet', label: '12th Marksheet', icon: '📜', category: 'academic' },
    { key: 'lc', label: 'Leaving Certificate', icon: '📋', category: 'certificate' },
    { key: 'casteCertificate', label: 'Caste Certificate', icon: '🏛️', category: 'certificate' },
    { key: 'aadhar', label: 'Aadhar Card', icon: '🆔', category: 'identity' },
    { key: 'birthCertificate', label: 'Birth Certificate', icon: '🎂', category: 'certificate' },
    { key: 'photo', label: 'Passport Photo', icon: '📸', category: 'identity' },
    { key: 'migrationCertificate', label: 'Migration Certificate', icon: '🎓', category: 'academic' }
  ], []);

  const filteredDocuments = useMemo(() => {
    if (!allAcademicDetails) return [];
    
    return allAcademicDetails.filter(doc => {
      const matchesSearch = searchTerm === '' || 
        doc.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.keys(doc).some(key => 
          key.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesFilter = filterType === 'all' || 
        Object.keys(doc).some(key => {
          const docType = documentTypes.find(dt => dt.key === key);
          return docType && docType.category === filterType;
        });
      
      return matchesSearch && matchesFilter;
    });
  }, [allAcademicDetails, searchTerm, filterType, documentTypes]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ File size should not exceed 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('❌ Only JPG, PNG, and PDF files are allowed');
        return;
      }
      
      setFiles(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  }, []);

  const handleDragOver = useCallback((e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  const handleDragLeave = useCallback((e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: false }));
  }, []);

  const handleDrop = useCallback((e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: false }));
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const mockEvent = { target: { files: [file], name: fieldName } };
      handleFileChange(mockEvent);
    }
  }, [handleFileChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(files).length === 0) {
      alert('⚠️ Please select at least one file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user._id);
    Object.keys(files).forEach((key) => formData.append(key, files[key]));

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      
      const xhr = new XMLHttpRequest();
      const uploadUrl = `${ACADAMIC_API_END_POINT}/${id}`;
      xhr.open('POST', uploadUrl, true);
      xhr.withCredentials = true;
console.log(uploadUrl); 
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const res = JSON.parse(xhr.responseText);
          if (res.success) {
            setUploadStatus('success');
          
          } else {
            setUploadStatus('error');
            alert('⚠️ Upload failed: ' + res.message);
          }
        } else {
          setUploadStatus('error');
          alert(`❌ Upload failed with status ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        setUploadStatus('error');
        alert('❌ Network error occurred');
      };

      xhr.send(formData);
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadStatus('error');
      alert('❌ Error uploading documents');
    }
  };

  const handleDelete = useCallback((docId, field) => {
    setDeleteConfirm({ docId, field });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    
    try {
      // Add actual delete API call here
      console.log(`Deleting ${deleteConfirm.field} from document ${deleteConfirm.docId}`);
      setDeleteConfirm(null);
      // Refresh data after successful deletion
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('❌ Failed to delete document');
    }
  }, [deleteConfirm]);

  const removeFile = useCallback((fieldName) => {
    setFiles(prev => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
    setPreviews(prev => {
      const updated = { ...prev };
      if (updated[fieldName]) {
        URL.revokeObjectURL(updated[fieldName]);
        delete updated[fieldName];
      }
      return updated;
    });
  }, []);

  return (
    <div className="academic-container">
      <style>{`
        .academic-container {
          padding: 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
        }

        .container-content {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .header {
          text-align: center;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.95);
          padding: 24px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .subtitle {
          color: #6b7280;
          margin-top: 8px;
          font-size: 1.1rem;
        }

        .controls {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.9);
          padding: 16px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .search-filter-group {
          display: flex;
          gap: 12px;
          flex: 1;
          min-width: 300px;
        }

        .search-input, .filter-select {
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .search-input:focus, .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236b7280' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 12px center;
          padding-left: 40px;
        }

        .view-toggle {
          display: flex;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 4px;
        }

        .view-btn {
          padding: 8px 12px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .view-btn.active {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .document-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .document-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .document-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 24px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .document-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
        }

        .document-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f1f5f9;
        }

        .student-info {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .document-count {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .document-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
        }

        .document-item {
          position: relative;
          text-align: center;
        }

        .document-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .image-wrapper {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .image-wrapper:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .doc-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        }

        .pdf-icon {
          width: 80px;
          height: 100px;
          object-fit: contain;
          cursor: pointer;
          margin: 10px auto;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .delete-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s ease;
          opacity: 0;
        }

        .image-wrapper:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        .no-docs {
          text-align: center;
          padding: 64px 24px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          margin-bottom: 32px;
        }

        .no-docs-icon {
          font-size: 4rem;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .no-docs-text {
          font-size: 1.2rem;
          color: #6b7280;
          margin: 0;
        }

        .upload-form {
          background: rgba(255, 255, 255, 0.95);
          padding: 32px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .form-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .form-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .upload-field {
          position: relative;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          font-size: 0.95rem;
        }

        .drop-zone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
          position: relative;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .drop-zone:hover, .drop-zone.drag-over {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }

        .drop-zone.has-file {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .drop-text {
          color: #6b7280;
          font-size: 0.9rem;
          margin-top: 8px;
        }

        .preview-container {
          margin-top: 12px;
          position: relative;
        }

        .preview-img {
          width: 100%;
          max-height: 120px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .remove-file-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .progress-section {
          margin-bottom: 24px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 4px;
          transition: width 0.3s ease;
          position: relative;
        }

        .progress::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: progress-shine 2s infinite;
        }

        @keyframes progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-text {
          text-align: center;
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .upload-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          min-width: 140px;
          position: relative;
          overflow: hidden;
        }

        .upload-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .upload-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .clear-btn {
          padding: 14px 24px;
          background: transparent;
          color: #6b7280;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: zoom-out;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-image {
          max-width: 90%;
          max-height: 90%;
          border-radius: 12px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .delete-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
        }

        .delete-modal-content {
          background: white;
          padding: 32px;
          border-radius: 16px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .delete-modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 12px;
        }

        .delete-modal-text {
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .delete-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .confirm-btn {
          padding: 10px 20px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .cancel-btn {
          padding: 10px 20px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .status-message {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-weight: 500;
          text-align: center;
        }

        .status-success {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-error {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        @media (max-width: 768px) {
          .academic-container {
            padding: 16px;
          }
          
          .document-grid {
            grid-template-columns: 1fr;
          }
          
          .upload-grid {
            grid-template-columns: 1fr;
          }
          
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-filter-group {
            min-width: auto;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="container-content">
        <div className="header">
          <h1 className="title">📚 Academic Documents</h1>
          <p className="subtitle">Manage and upload academic credentials securely</p>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="search-filter-group">
            <input
              type="text"
              placeholder="Search documents or student ID..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="certificate">Certificates</option>
              <option value="identity">Identity</option>
            </select>
          </div>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {/* Existing Documents */}
        {!loading && filteredDocuments && filteredDocuments.length > 0 ? (
          <div className={viewMode === 'grid' ? 'document-grid' : 'document-list'}>
            {filteredDocuments.map((doc, index) => {
              const docFields = Object.entries(doc).filter(([key, value]) =>
                key !== "_id" && key !== "userId" && key !== "__v" && !key.includes("At") && value
              );
              
              return (
                <div key={index} className="document-card">
                  <div className="card-header">
                    <div className="student-info">
                      👤 Student ID: {doc.userId}
                    </div>
                    <div className="document-count">
                      {docFields.length} docs
                    </div>
                  </div>
                  <div className="document-items">
                    {docFields.map(([key, value]) => {
                      const docType = documentTypes.find(dt => dt.key === key);
                      return (
                        <div key={key} className="document-item">
                          <div className="document-label">
                            {docType?.icon || '📄'} {docType?.label || key}
                          </div>
                          <div className="image-wrapper">
                            {value.endsWith('.pdf') ? (
                              <a href={value} target="_blank" rel="noopener noreferrer">
                                <img 
                                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png" 
                                  alt="PDF" 
                                  className="pdf-icon" 
                                />
                              </a>
                            ) : (
                              <img 
                                src={value} 
                                alt={docType?.label || key} 
                                className="doc-image" 
                                onClick={() => setModalImage(value)}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJMMTEgMTRMMTUgMTBNMjEgMTJDMjEgMTYuOTcwNiAxNi45NzA2IDIxIDEyIDIxQzcuMDI5NDQgMjEgMyAxNi45NzA2IDMgMTJDMyA3LjAyOTQ0IDcuMDI5NDQgMyAxMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyWiIgc3Ryb2tlPSIjOTCA5Q0EwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                                }}
                              />
                            )}
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDelete(doc._id, key)}
                              title="Delete document"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : !loading && (
          <div className="no-docs">
            <div className="no-docs-icon">📂</div>
            <p className="no-docs-text">
              {searchTerm || filterType !== 'all' 
                ? 'No documents match your search criteria' 
                : 'No academic documents found. Upload your first document below.'}
            </p>
          </div>
        )}

        {/* Upload Form */}
        {(!allAcademicDetails || allAcademicDetails.length === 0) && (
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-header">
              <h3 className="form-title">📤 Upload Documents</h3>
              <p className="form-subtitle">Select and upload your academic documents (Max 5MB each)</p>
            </div>

            {/* Status Messages */}
            {uploadStatus === 'success' && (
              <div className="status-message status-success">
                ✅ Documents uploaded successfully! Refreshing page...
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="status-message status-error">
                ❌ Upload failed. Please try again.
              </div>
            )}

            <div className="upload-grid">
              {documentTypes.map(({ key, label, icon }) => (
                <div key={key} className="upload-field">
                  <div className="field-label">
                    {icon} {label}
                  </div>
                  <div 
                    className={`drop-zone ${dragOver[key] ? 'drag-over' : ''} ${files[key] ? 'has-file' : ''}`}
                    onDragOver={(e) => handleDragOver(e, key)}
                    onDragLeave={(e) => handleDragLeave(e, key)}
                    onDrop={(e) => handleDrop(e, key)}
                  >
                    <input
                      type="file"
                      name={key}
                      onChange={handleFileChange}
                      className="file-input"
                      accept="image/*,application/pdf"
                    />
                    {!files[key] ? (
                      <>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
                        <div>Click or drag file here</div>
                        <div className="drop-text">JPG, PNG, PDF (Max 5MB)</div>
                      </>
                    ) : (
                      <div style={{ fontSize: '2rem', color: '#10b981' }}>✓</div>
                    )}
                  </div>
                  {previews[key] && (
                    <div className="preview-container">
                      <img src={previews[key]} alt="preview" className="preview-img" />
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => removeFile(key)}
                        title="Remove file"
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            {uploadStatus === 'uploading' && (
              <div className="progress-section">
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <div className="progress-text">
                  Uploading... {uploadProgress}%
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="upload-btn"
                disabled={uploadStatus === 'uploading' || Object.keys(files).length === 0}
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Documents'}
              </button>
              {Object.keys(files).length > 0 && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => {
                    setFiles({});
                    Object.values(previews).forEach(url => URL.revokeObjectURL(url));
                    setPreviews({});
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
          </form>
        )}

        {/* Image Modal */}
        {modalImage && (
          <div className="modal-overlay" onClick={() => setModalImage(null)}>
            <img src={modalImage} alt="Preview" className="modal-image" />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h3 className="delete-modal-title">⚠️ Confirm Deletion</h3>
              <p className="delete-modal-text">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
              <div className="delete-modal-actions">
                <button className="confirm-btn" onClick={confirmDelete}>
                  Delete
                </button>
                <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicDetails;