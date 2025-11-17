import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaShare, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import './Property.css';

function Property({ userType }) {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  
  // Mock property data - replace with API call in real app
  const property = {
    id: propertyId,
    title: 'Luxury Apartment',
    description: 'Beautiful 2-bedroom apartment with stunning city views',
    price: 1200,
    location: 'New York',
    bedrooms: 2,
    bathrooms: 2,
    size: '1200 sqft',
    amenities: ['Pool', 'Gym', 'Parking'],
    landlord: 'John Doe',
    status: 'available',
    views: 124,
    images: [
    
      `${process.env.PUBLIC_URL}/assets/properties/property2.jpg`
    ],
    date: '2023-05-15',
    requiredDocuments: ['ID Proof', 'Proof of Income', 'Credit Report']
  };

  const handleApply = () => {
    if (userType !== 'tenant') {
      alert('Please login as a tenant to apply');
      return;
    }
    navigate(`/apply/${propertyId}`, {
      state: {
        propertyDetails: {
          title: property.title,
          landlord: property.landlord,
          price: property.price,
          location: property.location,
          requiredDocuments: property.requiredDocuments
        }
      }
    });
  };

  const handleSave = () => {
    if (userType !== 'tenant') {
      alert('Please login as a tenant to save properties');
      return;
    }
    setIsSaved(!isSaved);
    // In a real app, this would be an API call
    console.log(isSaved ? 'Removed from saved' : 'Added to saved');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Property link copied to clipboard!');
  };

  return (
    <div className="property-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="property-gallery">
        {property.images.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={`Property ${index}`} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/assets/properties/default.jpg`;
            }}
          />
        ))}
      </div>

      <div className="property-details">
        <h1>{property.title}</h1>
        <p className="location">{property.location}</p>
        <p className="price">${property.price}/month</p>
        
        <div className="property-meta">
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
          <span>{property.size}</span>
        </div>

        <div className="property-description">
          <h3>Description</h3>
          <p>{property.description}</p>
        </div>

        <div className="property-amenities">
          <h3>Amenities</h3>
          <ul>
            {property.amenities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="property-landlord">
          <h3>Landlord</h3>
          <p>{property.landlord}</p>
        </div>

        <div className="required-documents">
          <h3>Required Documents for Application</h3>
          <ul>
            {property.requiredDocuments.map((doc, i) => (
              <li key={i}>{doc}</li>
            ))}
          </ul>
        </div>

        <div className="property-actions">
          {userType === 'tenant' && (
            <>
              <button className="apply-btn" onClick={handleApply}>
                <FaFileAlt /> Apply Now
              </button>
              <button 
                className={`save-btn ${isSaved ? 'saved' : ''}`} 
                onClick={handleSave}
              >
                <FaHeart /> {isSaved ? 'Saved' : 'Save'}
              </button>
            </>
          )}
          <button className="share-btn" onClick={handleShare}>
            <FaShare /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default Property;
