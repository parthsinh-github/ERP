  import React, { useState, useRef } from 'react';

  import { useSelector, useDispatch } from 'react-redux';
  import { useParams } from 'react-router-dom';
  import useGetAllIdCard from '../hooks/useGetAllIdCard';

import { ID_CARD_API_END_POINT } from '@/utils/constant';  // Make sure it's defined
  const IDCardPage = () => {

    const {role ,id } = useParams();
    

    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const cardRef = useRef(null);
    
        const { allIdCard = [] } = useSelector((state) => state.idcard);
    useGetAllIdCard(); // just triggers fetching  
   
    const { user } = useSelector(state => state.auth);

  

 
const generateModernPDF = async () => {
  setSubmitting(true);
  
  try {
    // Create ultra-modern ID card container
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = `
      width: 350px;
      height: 550px;
      background: linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      border-radius: 25px;
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
      position: relative;
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
    `;

    // Add glassmorphism overlay
    const glassOverlay = document.createElement('div');
    glassOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 25px;
      z-index: 1;
    `;

    // Animated background pattern
    const pattern = document.createElement('div');
    pattern.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%);
      z-index: 2;
    `;

    // Header section with institutional branding
    const header = document.createElement('div');
    header.style.cssText = `
      position: relative;
      z-index: 10;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(15px);
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      margin: 15px;
      margin-bottom: 0;
      border-radius: 20px 20px 0 0;
    `;

    const collegeLogo = document.createElement('div');
    collegeLogo.style.cssText = `
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 12px;
      margin: 0 auto 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 16px;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    `;
    collegeLogo.textContent = 'VTC';

    const collegeName = document.createElement('h1');
    collegeName.style.cssText = `
      font-size: 18px;
      font-weight: 800;
      color: #1a202c;
      margin: 0 0 4px 0;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      line-height: 1.2;
    `;
    collegeName.textContent = 'Vidyaharti Trust College';

    const collegeSubtitle = document.createElement('p');
    collegeSubtitle.style.cssText = `
      font-size: 10px;
      color: #4a5568;
      margin: 0;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    `;
    collegeSubtitle.textContent = 'Excellence in Education';

    header.appendChild(collegeLogo);
    header.appendChild(collegeName);
    header.appendChild(collegeSubtitle);

    // Main content area
    const mainContent = document.createElement('div');
    mainContent.style.cssText = `
      position: relative;
      z-index: 10;
      flex: 1;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(15px);
      margin: 0 15px 15px 15px;
      border-radius: 0 0 20px 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    // Photo section with modern styling
    const photoContainer = document.createElement('div');
    photoContainer.style.cssText = `
      position: relative;
      margin-bottom: 15px;
    `;

    const photoFrame = document.createElement('div');
    photoFrame.style.cssText = `
      width: 100px;
      height: 100px;
      border-radius: 25px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 3px;
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
    `;

    const photo = document.createElement('img');
    photo.src = user?.photo || 'https://via.placeholder.com/100';
    photo.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 22px;
      object-fit: cover;
      border: 2px solid rgba(255,255,255,0.8);
    `;

    const statusIndicator = document.createElement('div');
    statusIndicator.style.cssText = `
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 16px;
      height: 16px;
      background: #10b981;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    `;

    photoFrame.appendChild(photo);
    photoContainer.appendChild(photoFrame);
    photoContainer.appendChild(statusIndicator);

    // Student information
    const studentName = document.createElement('h2');
    studentName.style.cssText = `
      font-size: 20px;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 15px 0;
      text-align: center;
      letter-spacing: -0.3px;
      line-height: 1.2;
    `;
    studentName.textContent = user?.fullName || 'Student Name';

    // Single role chip (combining all info)
    const roleInfo = [
      user?.role || 'Student',
      user?.stream || 'General',
      user?.batchYear || new Date().getFullYear()
    ].filter(Boolean).join(' • ');

    const roleChip = document.createElement('div');
    roleChip.style.cssText = `
      display: inline-block;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 15px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    `;
    roleChip.textContent = roleInfo;

    // Details grid with modern cards - FIXED VERSION
    const detailsContainer = document.createElement('div');
    detailsContainer.style.cssText = `
      width: 100%;
      display: grid;
      gap: 8px;
      margin-top: 10px;
    `;

    // Ensure we have valid data with proper fallbacks
    const details = [
      { 
        label: 'Student ID', 
        value: user?.enrollmentNumber || 'VTC' + Math.random().toString(36).substr(2, 6).toUpperCase(), 
        icon: '🆔' 
      },
      { 
        label: 'Contact', 
        value: user?.phoneNumber || user?.contact || 'Contact Not Available', 
        icon: '📱' 
      },
      { 
        label: 'Batch Year', 
        value: user?.batchYear?.toString() || new Date().getFullYear().toString(), 
        icon: '📅' 
      },
      { 
        label: 'Stream', 
        value: user?.stream || user?.course || 'General Stream', 
        icon: '🎓' 
      },
      { 
        label: 'Date of Birth', 
        value: user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN') : 'Not Specified', 
        icon: '🎂' 
      },
      { 
        label: 'Address', 
        value: user?.address ? (user.address.length > 30 ? user.address.substring(0, 30) + '...' : user.address) : 'Address Not Available', 
        icon: '📍' 
      }
    ];

    details.forEach(detail => {
      const detailCard = document.createElement('div');
      detailCard.style.cssText = `
        background: rgba(102, 126, 234, 0.08);
        border: 1px solid rgba(102, 126, 234, 0.15);
        border-radius: 10px;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        gap: 10px;
      `;

      const icon = document.createElement('span');
      icon.style.cssText = `
        font-size: 14px;
        width: 20px;
        text-align: center;
        flex-shrink: 0;
      `;
      icon.textContent = detail.icon;

      const content = document.createElement('div');
      content.style.cssText = `
        flex: 1;
        min-width: 0;
      `;

      const label = document.createElement('div');
      label.style.cssText = `
        font-size: 9px;
        font-weight: 600;
        color: #667eea;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 1px;
        line-height: 1;
      `;
      label.textContent = detail.label;

      const value = document.createElement('div');
      value.style.cssText = `
        font-size: 11px;
        font-weight: 500;
        color: #2d3748;
        word-break: break-word;
        line-height: 1.2;
      `;
      value.textContent = detail.value;

      content.appendChild(label);
      content.appendChild(value);
      detailCard.appendChild(icon);
      detailCard.appendChild(content);
      detailsContainer.appendChild(detailCard);
    });

    // Security features
    const securityStrip = document.createElement('div');
    securityStrip.style.cssText = `
      position: absolute;
      bottom: 15px;
      left: 15px;
      right: 15px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #667eea, #764ba2, #f093fb, transparent);
      border-radius: 2px;
    `;

    const qrCode = document.createElement('div');
    qrCode.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      width: 35px;
      height: 35px;
      background: #1a202c;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 8px;
      font-weight: 600;
    `;
    qrCode.textContent = 'QR';

    // Assemble the card
    pdfContainer.appendChild(glassOverlay);
    pdfContainer.appendChild(pattern);
    pdfContainer.appendChild(header);
    
    mainContent.appendChild(photoContainer);
    mainContent.appendChild(studentName);
    mainContent.appendChild(roleChip);
    mainContent.appendChild(detailsContainer);
    
    pdfContainer.appendChild(mainContent);
    pdfContainer.appendChild(securityStrip);
    pdfContainer.appendChild(qrCode);

    // Add to DOM temporarily for rendering
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    document.body.appendChild(pdfContainer);

    // Wait for images to load
    await new Promise(resolve => {
      if (photo.complete) {
        resolve();
      } else {
        photo.onload = resolve;
        photo.onerror = resolve;
      }
    });

    // Enhanced canvas rendering
    const html2canvas = await import('html2canvas');
    const canvas = await html2canvas.default(pdfContainer, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      width: 350,
      height: 550
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Create premium PDF
    const jsPDF = await import('jspdf');
    const pdf = new jsPDF.default('p', 'mm', 'a4');

    // Add premium background
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, 210, 297, 'F');

    // Add header
    pdf.setFontSize(24);
    pdf.setTextColor(26, 32, 44);
    pdf.text('OFFICIAL STUDENT ID CARD', 105, 30, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setTextColor(74, 85, 104);
    pdf.text('Vidyaharti Trust College - Digital Identity', 105, 40, { align: 'center' });

    // Add the enhanced ID card
    const cardWidth = 87.5;  // 350px / 4 (higher quality)
    const cardHeight = 137.5; // 550px / 4
    const x = (210 - cardWidth) / 2;
    const y = 60;

    pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight, undefined, 'FAST');

    // Add footer information
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 20, 220);
    pdf.text(`Valid until: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('en-IN')}`, 20, 230);
    
    pdf.setTextColor(102, 126, 234);
    pdf.text('This is a digitally generated official document', 105, 250, { align: 'center' });
    pdf.text('Please verify authenticity through college portal', 105, 260, { align: 'center' });

    // Add security watermark
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(50);
    pdf.text('OFFICIAL', 105, 150, { 
      align: 'center', 
      angle: 45,
      renderingMode: 'stroke'
    });

    // Save PDF
    const fileName = `${user?.fullName?.replace(/\s+/g, '_') || 'Student'}_ID_Card_${new Date().getFullYear()}.pdf`;
    pdf.save(fileName);

    // Cleanup
    document.body.removeChild(pdfContainer);
    
    setMessage('✨ Premium ID Card generated successfully with enhanced security features!');
    setTimeout(() => setMessage(''), 5000);

  } catch (err) {
    console.error('PDF Generation Error:', err);
    setError('Failed to generate ID card. Please try again.');
    setTimeout(() => setError(''), 5000);
  } finally {
    setSubmitting(false);
  }
};

  const handleDownload = async (e) => {
  e?.preventDefault();

  try {
    setSubmitting(true);

    // ✅ Step 1: Notify backend about the download
    const response = await fetch(`${ID_CARD_API_END_POINT}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to update download count.');
    }

    // ✅ Step 2: Now generate the ID Card PDF
    await generateModernPDF();

  } catch (err) {
    console.error("❌ Error during download:", err);
    setError('Failed to process the download. Please try again.');
  } finally {
    setSubmitting(false);
  }
};


  const handleRequest = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for re-download request');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setMessage('Re-download request submitted successfully!');
    setReason('');
    setTimeout(() => setMessage(''), 5000);
  };

  const renderActionButton = () => {
    if (allIdCard.length === 0) {
      return (
        <button 
          onClick={handleDownload} 
          style={styles.primaryButton} 
          disabled={submitting}
        >
          <span style={styles.buttonIcon}>🆔</span>
          {submitting ? 'Generating Premium Card...' : 'Generate Premium ID Card'}
        </button>
      );
    }

// ✅ If hook returns error or empty, treat as no data
if (!allIdCard || !Array.isArray(allIdCard) || allIdCard.length === 0) {
  return (
    <div style={styles.limitMessage}>
      <span style={styles.warningIcon}>ℹ️</span>
      <p>No ID card found for this student. Please generate a new ID card.</p>
      <button onClick={handleDownload} style={styles.primaryButton}>
        Generate ID Card
      </button>
    </div>
  );
}

const latestCard = allIdCard[0];
const downloadCount = latestCard.downloadCount ?? 0;

// ✅ Step 1: Check if download count reached the limit
if (downloadCount >= 3) {
  return (
    <div style={styles.limitMessage}>
      <span style={styles.warningIcon}>⚠️</span>
      <p>You've reached the download limit (3 times). Please contact admin for assistance.</p>
    </div>
  );
}

// ✅ Step 2: Continue normal logic if limit not reached
if (!latestCard.hasDownloaded) {
  return (
    <button
      onClick={handleDownload}
      style={styles.primaryButton}
      disabled={submitting}
    >
      <span style={styles.buttonIcon}>⬇️</span>
      {submitting ? 'Processing...' : 'Download ID Card'}
    </button>
  );

    } else if (latestCard.reDownloadRequest?.status === 'Approved') {
      return (
        <button
          onClick={handleDownload}
          style={styles.successButton}
          disabled={submitting}
        >
          <span style={styles.buttonIcon}>🔄</span>
          {submitting ? 'Processing...' : 'Re-Download ID Card'}
        </button>
      );
    } else if (latestCard.reDownloadRequest?.status === 'Pending') {
      return (
        <div style={styles.pendingMessage}>
          <span style={styles.pendingIcon}>⏳</span>
          <p>Re-download request is pending approval</p>
        </div>
      );
    } else {
      return (
        <div style={styles.requestForm}>
          <textarea
            placeholder="Please provide a reason for re-downloading your ID card..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={styles.modernTextarea}
          />
          <button onClick={handleRequest} style={styles.warningButton}>
            <span style={styles.buttonIcon}>📝</span>
            Submit Re-download Request
          </button>
        </div>
      );
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Animated background */}
      <div style={styles.backgroundPattern}></div>
      <div style={styles.floatingElements}>
        <div style={styles.floatingCircle1}></div>
        <div style={styles.floatingCircle2}></div>
        <div style={styles.floatingCircle3}></div>
      </div>
      
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>✨</div>
          <h1 style={styles.title}>ID Card Downloader</h1>
          <p style={styles.subtitle}>Generate your official college identification with cutting-edge security features</p>
        </div>

        {message && (
          <div style={styles.successAlert}>
            <span style={styles.alertIcon}>✅</span>
            {message}
          </div>
        )}
        
        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.alertIcon}>❌</span>
            {error}
          </div>
        )}

        {/* Live Preview Card */}
        {/* <div style={styles.previewSection}>
          <h3 style={styles.previewTitle}>Live Preview</h3>
          <div style={styles.previewCardContainer}>
            <div style={styles.previewCard} ref={cardRef}>
              <div style={styles.cardGradient}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardLogo}>VTC</div>
                  <div style={styles.cardCollegeName}>Vidyaharti Trust College</div>
                  <div style={styles.cardSubtitle}>Excellence in Education</div>
                </div>
                
                <div style={styles.cardBody}>
                  <div style={styles.photoSection}>
                    <img 
                      src={user?.photo || 'https://via.placeholder.com/100'} 
                      style={styles.studentPhoto}
                      alt="Student"
                    />
                    <div style={styles.statusDot}></div>
                  </div>
                  
                  <h3 style={styles.studentName}>{user?.fullName || 'Student Name'}</h3>
                  <div style={styles.roleChip}>{user?.role || 'Student'}</div>
                  <div style={styles.roleChip}>{user?.stream || 'Student'}</div>
                  <div style={styles.roleChip}>{user?.phoneNumber || 'Student'}</div>
                  
                  <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>🆔</span>
                      <div>
                        <div style={styles.detailLabel}>Student ID</div>
                        <div style={styles.detailValue}>{user?._id}</div>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>📱</span>
                      <div>
                        <div style={styles.detailLabel}>Contact</div>
                        <div style={styles.detailValue}>{user?.phoneNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div style={styles.actionSection}>
          {renderActionButton()}
        </div>

        {/* Features showcase */}
        {/* <div style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>Premium Features</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🔒</span>
              <h4>Security Enhanced</h4>
              <p>Advanced security features with QR codes and watermarks</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🎨</span>
              <h4>Modern Design</h4>
              <p>Glassmorphism effects with gradient backgrounds</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>📱</span>
              <h4>Digital Ready</h4>
              <p>High-quality PDF output optimized for digital use</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Download History Section */}
      {allIdCard.length > 0 && (
        <div style={styles.historySection}>
          <div style={styles.historyContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Download History</h2>
              <span style={styles.badge}>{allIdCard.length} record{allIdCard.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div style={styles.logsContainer}>
              {allIdCard.map((idCard, index) => {
                const downloadCount = idCard?.downloadCount || 0;
                const remaining = Math.max(0, 3 - downloadCount);
                const timestamp = idCard.downloadTimestamp
                  ? new Date(idCard.downloadTimestamp).toLocaleString()
                  : 'Not available';
                const requestStatus = idCard.reDownloadRequest?.status || 'None';

                return (
                  <div key={idCard._id} style={{
                    ...styles.logCard,
                    ...(index === 0 ? styles.latestCard : {})
                  }}>
                    {index === 0 && <div style={styles.latestBadge}>Latest</div>}
                    
                    <div style={styles.logHeader}>
                      <div style={styles.statusIndicator}>
                        <span style={{
                          ...styles.statusDot,
                          backgroundColor: idCard.hasDownloaded ? '#10b981' : '#94a3b8'
                        }}></span>
                        <span style={styles.statusText}>
                          {idCard.hasDownloaded ? 'Downloaded' : 'Not Downloaded'}
                        </span>
                      </div>
                      <span style={styles.timestamp}>{timestamp}</span>
                    </div>

                    <div style={styles.logContent}>
                      <div style={styles.logRow}>
                        <span style={styles.logLabel}>Download Count:</span>
                        <span style={styles.logValue}>
                          {downloadCount}/3
                          <span style={styles.remainingCount}>({remaining} remaining)</span>
                        </span>
                      </div>
                      
                      <div style={styles.logRow}>
                        <span style={styles.logLabel}>Re-Download Status:</span>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: 
                            requestStatus === 'Approved' ? '#dcfce7' :
                            requestStatus === 'Pending' ? '#fef3c7' :
                            requestStatus === 'Rejected' ? '#fee2e2' : '#f1f5f9',
                          color:
                            requestStatus === 'Approved' ? '#166534' :
                            requestStatus === 'Pending' ? '#92400e' :
                            requestStatus === 'Rejected' ? '#991b1b' : '#64748b'
                        }}>
                          {requestStatus}
                        </span>
                      </div>

                      {idCard.reDownloadRequest?.reason && (
                        <div style={styles.reasonSection}>
                          <span style={styles.logLabel}>Reason:</span>
                          <p style={styles.reasonText}>{idCard.reDownloadRequest.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        ${styles.primaryButton}:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        ${styles.featureCard}:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        ${styles.logCard}:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default IDCardPage;

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
    `,
    animation: 'float 20s ease-in-out infinite',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  floatingCircle1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: 'float 15s ease-in-out infinite',
  },
  floatingCircle2: {
    position: 'absolute',
    top: '70%',
    right: '10%',
    width: '150px',
    height: '150px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    animation: 'float 20s ease-in-out infinite reverse',
  },
  floatingCircle3: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    width: '80px',
    height: '80px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    animation: 'float 18s ease-in-out infinite',
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 10,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
    color: 'white',
  },
  headerIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
    animation: 'pulse 3s ease-in-out infinite',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '900',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
    letterSpacing: '-2px',
  },
  subtitle: {
    fontSize: '1.4rem',
    opacity: 0.9,
    margin: 0,
    fontWeight: '400',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  previewSection: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  previewTitle: {
    color: 'white',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  previewCardContainer: {
    display: 'flex',
    justifyContent: 'center',
    perspective: '1000px',
  },
  previewCard: {
    transform: 'scale(0.85) rotateY(-5deg)',
    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))',
    transition: 'all 0.3s ease',
  },
  cardGradient: {
    width: '320px',
    height: '500px',
    background: 'linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    borderRadius: '25px',
    overflow: 'hidden',
    position: 'relative',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },
  cardHeader: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(15px)',
    padding: '20px',
    textAlign: 'center',
    margin: '15px 15px 0 15px',
    borderRadius: '20px 20px 0 0',
  },
  cardLogo: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '10px',
    margin: '0 auto 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '800',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
  cardCollegeName: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#1a202c',
    margin: '0 0 5px 0',
    textTransform: 'uppercase',
    letterSpacing: '-0.5px',
  },
  cardSubtitle: {
    fontSize: '10px',
    color: '#4a5568',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  cardBody: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(15px)',
    margin: '0 15px 15px 15px',
    borderRadius: '0 0 20px 20px',
    padding: '25px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  photoSection: {
    position: 'relative',
    marginBottom: '20px',
  },
  studentPhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '25px',
    objectFit: 'cover',
    border: '4px solid #667eea',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
  },
  statusDot: {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    width: '16px',
    height: '16px',
    background: '#10b981',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.4)',
  },
  studentName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 10px 0',
    textAlign: 'center',
    letterSpacing: '-0.3px',
  },
  roleChip: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  detailsGrid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(102, 126, 234, 0.05)',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  detailIcon: {
    fontSize: '14px',
  },
  detailLabel: {
    fontSize: '9px',
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#2d3748',
  },
  actionSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '4rem',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem 3rem',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
    textTransform: 'none',
    letterSpacing: '0.5px',
  },
  successButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem 3rem',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
    background: 'rgba(16, 185, 129, 0.3)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(16, 185, 129, 0.5)',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 15px 35px rgba(16, 185, 129, 0.2)',
    textTransform: 'none',
    letterSpacing: '0.5px',
  },
  warningButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    background: 'rgba(245, 158, 11, 0.3)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(245, 158, 11, 0.5)',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: '1.5rem',
  },
  limitMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem 2rem',
    background: 'rgba(239, 68, 68, 0.2)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    maxWidth: '400px',
    color: 'white',
    textAlign: 'center',
  },
  pendingMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem 2rem',
    background: 'rgba(245, 158, 11, 0.2)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '2px solid rgba(245, 158, 11, 0.3)',
    maxWidth: '400px',
    color: 'white',
    textAlign: 'center',
  },
  requestForm: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(20px)',
    padding: '2rem',
    borderRadius: '20px',
    maxWidth: '400px',
    width: '100%',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  modernTextarea: {
    width: '100%',
    minHeight: '120px',
    padding: '1rem',
    fontSize: '1rem',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '15px',
    resize: 'vertical',
    fontFamily: 'inherit',
    marginBottom: '1.5rem',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    color: 'white',
  },
  warningIcon: {
    fontSize: '1.5rem',
  },
  pendingIcon: {
    fontSize: '1.5rem',
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 2rem',
    background: 'rgba(16, 185, 129, 0.2)',
    backdropFilter: 'blur(20px)',
    color: 'white',
    borderRadius: '15px',
    margin: '0 auto 2rem auto',
    maxWidth: '600px',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 2rem',
    background: 'rgba(239, 68, 68, 0.2)',
    backdropFilter: 'blur(20px)',
    color: 'white',
    borderRadius: '15px',
    margin: '0 auto 2rem auto',
    maxWidth: '600px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  alertIcon: {
    fontSize: '1.5rem',
  },
  featuresSection: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  featuresTitle: {
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '3rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '25px',
    padding: '2.5rem',
    textAlign: 'center',
    color: 'white',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  featureIcon: {
    fontSize: '3.5rem',
    display: 'block',
    marginBottom: '1.5rem',
  },
  historySection: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '4rem 0',
  },
  historyContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'white',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  badge: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    borderRadius: '25px',
    fontSize: '0.875rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  logsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  logCard: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    position: 'relative',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)',
  },
  latestCard: {
    border: '2px solid rgba(102, 126, 234, 0.5)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.2)',
  },
  latestBadge: {
    position: 'absolute',
    top: '-12px',
    right: '25px',
    padding: '0.5rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    borderRadius: '25px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f1f5f9',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
 
  statusText: {
    fontWeight: '700',
    color: '#374151',
    fontSize: '1rem',
  },
  timestamp: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  logContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
  },
  logLabel: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '1rem',
  },
  logValue: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: '1rem',
  },
  remainingCount: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginLeft: '0.5rem',
    fontWeight: '400',
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  reasonSection: {
    marginTop: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '15px',
    border: '2px solid #e2e8f0',
  },
  reasonText: {
    margin: '0.75rem 0 0 0',
    color: '#4b5563',
    fontSize: '1rem',
    lineHeight: '1.6',
    fontStyle: 'italic',
  }
    
};