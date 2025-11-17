import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFilePdf, FaArrowLeft } from 'react-icons/fa';
import './ApplicationDetailPage.css';

const ApplicationDetailPage = () => {
    const { id } = useParams(); // assuming route like /applications/:id
    console.log("Route param id:", id);
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);

    const statusMap = { 0: 'pending', 1: 'approved', 2: 'rejected' };

    useEffect(() => {
      fetch(`http://localhost:5062/api/Proposal/Proposal/${id}`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
      })
      .then(res => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
      })
      .then(data => {
          console.log('Fetched data:', data);
          setApplication(data);
      })
      .catch(err => console.error('Error fetching application:', err));
  }, [id]);
  
    const handleDownload = (doc, index) => {
        const byteCharacters = atob(doc);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `Tenant_Document_${index + 1}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    };


    const handleView = (doc) => {
        const byteCharacters = atob(doc);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl);
    };


    if (!application) {
        return <p>Loading application...</p>;
    }

    const statusText = statusMap[application.status] || 'unknown';

    return (
        <div className="application-detail-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back to Applications
            </button>

            <div className="application-header">
                <h1>Application Details</h1>
                <h2>{application.postTitle}</h2>
                <div className={`status-badge ${statusText}`}>
                    {statusText}
                </div>
            </div>

            <div className="application-details">
                <div className="detail-section">
                    <h3>Application Information</h3>
                    <p><strong>Name:</strong> {application.name}</p>
                    <p><strong>Applied on:</strong> {application.date}</p>
                    <p><strong>Phone:</strong> {application.phone}</p>
                    <p><strong>Status:</strong> {statusText}</p>
                    {application.message && (
                        <p><strong>Landlord Message:</strong> {application.message}</p>
                    )}
                </div>
                <div className="detail-section">
                    <h3>Submitted Document</h3>
                    {application.documentBase64 ? (
                        <div>
                            <FaFilePdf className="pdf-icon" />
                            <span>Tenant_Document.pdf</span>
                            <button className="view-doc-btn" onClick={() => handleView(application.documentBase64)}>View</button>
                            <button className="download-doc-btn" onClick={() => handleDownload(application.documentBase64, 0)}>Download</button>
                        </div>
                    ) : (
                        <p>No document submitted</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ApplicationDetailPage;

