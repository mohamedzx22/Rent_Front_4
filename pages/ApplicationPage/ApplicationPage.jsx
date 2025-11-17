import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFileUpload, FaTimes, FaCheck, FaArrowLeft } from 'react-icons/fa';
import './ApplicationPage.css';

const ApplicationForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const pathParts = window.location.pathname.split('/');
  const propertyId = pathParts[pathParts.length - 1];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: ''
  });

  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(true);

  // ✅ Increase view count
  useEffect(() => {
    const incrementView = async () => {
      if (!propertyId || isNaN(propertyId)) return;

      try {
        const response = await fetch(`http://localhost:5062/api/Post/add-1-view-post/${propertyId}`, {
          method: 'POST'
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorData}`);
        }

        const result = await response.json();
        console.log("👁️ View count incremented. New viewer count:", result.viewers);
      } catch (error) {
        console.error('❌ Error increasing views:', error.message);
      }
    };

    incrementView();
  }, [propertyId]);

  // ✅ Fetch post details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      const token = localStorage.getItem('userToken');

      if (!token) {
        console.warn("🚫 No token found in localStorage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5062/api/Post/PostDetails/${propertyId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setPropertyDetails(data);
      } catch (err) {
        console.error("❌ Failed to fetch property:", err.message);
      } finally {
        setLoadingProperty(false);
      }
    };

    if (propertyId) fetchPropertyDetails();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length !== files.length) {
      alert('Only PDF files are accepted');
      return;
    }

    setDocuments(prev => [...prev, ...pdfFiles]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");

    // ✅ إذا المستخدم غير مسجل دخول، يتم توجيهه للصفحة login
    if (!token) {
      alert("You need to log in first.");
      navigate("/login"); // غيري هذا حسب مسار صفحة تسجيل الدخول عندك
      return;
    }
    if (documents.length === 0) {
      alert("Please upload at least one document.");
      return;
    }

    setIsSubmitting(true);

    const form = new FormData();
    form.append("name", formData.fullName);
    form.append("Phone", formData.phone);
    form.append("PostId", propertyId); 
    form.append("Document", documents[0]);

    try {
      const token = localStorage.getItem("userToken");
      
      const response = await fetch("http://localhost:5062/api/Proposal/AddProposal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form,
      });

      const result = await response.text();

      if (response.ok) {
        console.log("✅ Application submitted:", result);
        setSubmitSuccess(true);
      } else {
        console.error("❌ Failed:", result);
        alert("" + result);
      }
    } catch (err) {
      console.error("❌ Submit error:", err.message);
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="application-success-page">
        <div className="success-content">
          <FaCheck className="success-icon" />
          <h2>Application Submitted Successfully!</h2>
          <p>Your application for {propertyDetails?.title} has been received.</p>
          <p>The landlord will review your application and contact you soon.</p>
          <button onClick={() => navigate('/tenant/applications')} className="back-to-applications">
            View My Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Property
      </button>

      <div className="application-header">
        <h1>Rental Application</h1>
        {loadingProperty ? (
          <p>Loading property details...</p>
        ) : propertyDetails ? (
          <div className="property-summary">
            <h2>{propertyDetails.title}</h2>
            <p>Landlord: {propertyDetails.landlordName}</p>
            <p>Location: {propertyDetails.location}</p>
            <p>Price: ${propertyDetails.price}/month</p>
          </div>
        ) : (
          <p>❌ Could not load property data.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-section">
          <h3>Required Documents</h3>
          <p className="document-instructions">Please upload the following documents in PDF format:</p>
          <ul className="required-docs-list">
            {propertyDetails?.requiredDocuments?.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>

          <div className="file-upload-container">
            <label className="file-upload-label">
              <FaFileUpload className="upload-icon" />
              <span>Upload Documents (PDF only)</span>
              <input type="file" onChange={handleFileChange} accept=".pdf" multiple style={{ display: 'none' }} />
            </label>
          </div>

          {documents.length > 0 && (
            <div className="uploaded-files">
              <h4>Documents to be Submitted:</h4>
              <ul>
                {documents.map((doc, index) => (
                  <li key={index}>
                    <span>{doc.name}</span>
                    <button type="button" onClick={() => removeDocument(index)} className="remove-doc-btn">
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting || documents.length === 0}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
