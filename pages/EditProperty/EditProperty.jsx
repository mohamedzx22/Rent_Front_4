import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';  // إضافة axios
import './EditProperty.css';
import { FaUpload, FaTimes, FaArrowLeft } from 'react-icons/fa';

const EditProperty = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Title: '',
    location: '',
    Price: '',
    status: 'available',
    image: null,
    imagePreview: ''
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5062/api/post/PostDetails/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
  
        if (response.data) {
          setFormData({
            Id: response.data.id,
            Title: response.data.title, // تم تغييرها لتتوافق مع الحقل في state
            location: response.data.location,
            Price: response.data.price, // تم تغييرها لتتوافق مع الحقل في state
            status: response.data.status,
            image: response.data.image,
            imagePreview: response.data.imagePreview || '' // إذا كانت الصورة موجودة
          });
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        alert('Failed to fetch property details.');
      }
    };
  
    fetchPropertyDetails();
  }, [propertyId]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('Title', formData.Title);
    data.append('location', formData.location); // ✅ مصحح
    data.append('Price', formData.Price);
  
    const statusMapping = {
      "available": 0,
      "rented": 1,
      "maintenance": 2
    };
    
    if (formData.status && statusMapping.hasOwnProperty(formData.status.toLowerCase())) {
      data.append('Rentalstate', statusMapping[formData.status.toLowerCase()]);
    }
    
    
    if (formData.image) {
      data.append('images', formData.image);
    }
    console.log("Status value:", formData.status);

  
    try {
      const response = await axios.put(`http://localhost:5062/api/Post/update/${propertyId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });
  
      if (response.status === 204) {
        alert('Property updated successfully');
        navigate('/landlord');
      } else {
        alert('Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('There was an error updating your property.');
    }
  };
  
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  return (
    <div className="landlord-dashboard">
      <div className="main-content">
        <div className="section-header">
          <h2>Edit Property</h2>
          <button className="back-button" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <form onSubmit={handleSubmit} className="edit-form" encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              name="Title" 
              value={formData.Title} // تأكد من أن الحقل هنا هو Title (كما في الـ state) 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input 
              type="number" 
              name="Price" 
              value={formData.Price} // تأكد من أن الحقل هنا هو Price (كما في الـ state)
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="image">Image Upload</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.imagePreview && (
              <img src={formData.imagePreview} alt="Preview" className="image-preview" />
            )}
          </div>
          <button type="submit" className="add-property">Update Property</button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
