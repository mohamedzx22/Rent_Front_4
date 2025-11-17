import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTimes, FaArrowLeft } from 'react-icons/fa';
import './AddProperty.css';
import axios from 'axios';

const AddProperty = () => {
  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    amenities: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty(prev => ({ ...prev, [name]: value }));
  };

  const removeImage = () => {
    setSelectedImage(null);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); 
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!property.title || !property.price || !property.location) {
      alert('Please fill in required fields (Title, Price, Location)');
      return;
    }
  
    const formData = new FormData();
    formData.append("Title", property.title);
    formData.append("Description", property.description);
    formData.append("Location", property.location);
    formData.append("Price", property.price);
  
    if (selectedImage) {
      formData.append("Image", selectedImage); 
    }
  
    try {
      const response = await axios.post('http://localhost:5062/api/post/landlord', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        }
      });
      console.log('Server response:', response.data);
      navigate('/landlord');
    } catch (error) {
      console.error('Error submitting property:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data.errors)}`);
      } else {
        alert('There was an error submitting your property.');
      }
    }
  };
  
  

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="add-property-page">
      <button className="back-btn" onClick={() => navigate('/landlord')}>
        <FaArrowLeft /> Back to Properties
      </button>

      <h1>Add New Property</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Property Title*</label>
            <input
              name="title"
              value={property.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price per month*</label>
            <input
              name="price"
              type="number"
              value={property.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location*</label>
          <input
            name="location"
            value={property.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Detailed Description</label>
          <textarea
            name="description"
            value={property.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>


        <div className="form-group">
          <label>Property Image</label>
          <button type="button" className="upload-btn" onClick={triggerFileInput}>
            <FaUpload /> Select Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <div className="image-preview-container">
            {selectedImage && (
              <div className="image-preview">
                <img src={selectedImage} alt="Property preview" />
                <button 
                  type="button"
                  className="remove-image"
                  onClick={removeImage}
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;