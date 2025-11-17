import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { FaUsers, FaHome, FaCheck, FaTimes, FaInfoCircle, FaTrash } from 'react-icons/fa';
import { fetchWithAuth } from 'C:/Users/DELL/Desktop/FCAIH/Level 6/IA/clientapp/src/utils/fetchWithAuth'; 
import { fetchWithRefresh } from '../../hooks/api';
//import { useAuth } from '../../context/AuthContext'; 
//import { useFetchWithRefresh } from '../hooks/useFetchWithRefresh';  // التأكد من مسار الاستيراد

const AdminDashboard = () => {
  const [pendingLandlords, setPendingLandlords] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allLandlords, setAllLandlords] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('landlords');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

 const token = localStorage.getItem('userToken');
 //const { token, refreshAccessToken, loading } = useAuth();  

console.log(JSON.parse(atob(token.split('.')[1])));

  useEffect(() => {
    if (token) {
      fetchPendingData();
    } else {
      console.error('No token found. Please login first.');
    }
  }, []);

  /*useEffect(() => {
       if (!token) {
         refreshAccessToken();
        return;
        }
        fetchPendingData();
      }, [token, refreshAccessToken]);*/

  const fetchPendingData = async () => {
    try {
      const [landlordsRes, propertiesRes] = await Promise.all([
        fetch('http://localhost:5062/api/Admin/pending-landlords', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5062/api/Admin/pending-posts', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!landlordsRes.ok || !propertiesRes.ok) {
        throw new Error('Failed to fetch pending data');
      }

      const landlordsData = await landlordsRes.json();
      const propertiesData = await propertiesRes.json();

      setPendingLandlords(landlordsData);
      setPendingProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching pending data:', error);
    }
  };

  const fetchAllLandlords = async () => {
    try {
        const data = await fetchWithRefresh('http://localhost:5062/api/Admin/all-landlords');
        setAllLandlords(data);
    } catch (error) {
        console.error('Error fetching landlords:', error);
    }
};

const fetchAllProperties = async () => {
    try {
        const data = await fetchWithRefresh('http://localhost:5062/api/Admin/all-posts');
        setAllProperties(data);
    } catch (error) {
        console.error('Error fetching properties:', error);
    }
};

useEffect(() => {
    fetchAllLandlords();
    fetchAllProperties();
}, []);


  const handleApprove = async (id, type) => {
    try {
      const url = type === 'landlord'
        ? 'http://localhost:5062/api/Admin/approve-landlord'
        : 'http://localhost:5062/api/Admin/approve-post';
        console.log('Approving  id:', id);

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ Id: id }) 
      });
     
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Approval failed');
      }
  
      // لو العملية نجحت
      if (type === 'landlord') {
        setPendingLandlords(prev => prev.filter(item => item.id !== id));
      } else {
        setPendingProperties(prev => prev.filter(item => item.id !== id));
      }
      
      closeModal();
    } catch (error) {
      console.error('Error approving:', error);
      alert(error.message); 
    }
  };



  const handleReject = async (id, type) => {
    try {
      const url = type === 'landlord'
        ? 'http://localhost:5062/api/Admin/reject-landlord'
        : 'http://localhost:5062/api/Admin/reject-post';

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error('Rejection failed');

      if (type === 'landlord') {
        setPendingLandlords(prev => prev.filter(item => item.id !== id));
      } else {
        setPendingProperties(prev => prev.filter(item => item.id !== id));
      }

      closeModal();
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const handleDeleteRejectedLandlords = async () => {
    try {
      const response = await fetch('http://localhost:5062/api/Admin/delete-rejected-landlords', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete rejected landlords');
      }

      console.log('Rejected landlords deleted successfully');
      fetchPendingData();
    } catch (error) {
      console.error('Error deleting rejected landlords:', error);
    }
  };

  const handleDeleteRejectedPosts = async () => {
    try {
      const response = await fetch('http://localhost:5062/api/Admin/delete-rejected-posts', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete rejected posts');
      }

      console.log('Rejected posts deleted successfully');
      fetchPendingData();
    } catch (error) {
      console.error('Error deleting rejected posts:', error);
    }
  };

  const showDetails = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === 'landlords' ? 'active' : ''} onClick={() => { setActiveTab('landlords'); fetchPendingData(); }}>
          <FaUsers /> Pending Landlords
        </button>

        <button className={activeTab === 'properties' ? 'active' : ''} onClick={() => { setActiveTab('properties'); fetchPendingData(); }}>
          <FaHome /> Pending Properties
        </button>

        <button className={activeTab === 'all-landlords' ? 'active' : ''} onClick={() => { setActiveTab('all-landlords'); fetchAllLandlords(); }}>
          <FaUsers /> All Landlords
        </button>

        <button className={activeTab === 'all-properties' ? 'active' : ''} onClick={() => { setActiveTab('all-properties'); fetchAllProperties(); }}>
          <FaHome /> All Properties
        </button>
      </div>

      <div className="actions-top">
        {activeTab === 'landlords' && (
          <button className="delete-btn" onClick={handleDeleteRejectedLandlords}>
            <FaTrash /> Delete Rejected Landlords
          </button>
        )}
        {activeTab === 'properties' && (
          <button className="delete-btn" onClick={handleDeleteRejectedPosts}>
            <FaTrash /> Delete Rejected Posts
          </button>
        )}
      </div>

      {/* Tables */}
      {activeTab === 'landlords' && (
        <LandlordTable data={pendingLandlords} onApprove={handleApprove} onReject={handleReject} showDetails={showDetails} />
      )}
      {activeTab === 'properties' && (
        <PropertyTable data={pendingProperties} onApprove={handleApprove} onReject={handleReject} showDetails={showDetails} />
      )}
      {activeTab === 'all-landlords' && (
        <LandlordTable data={allLandlords} showDetails={showDetails} />
      )}
      {activeTab === 'all-properties' && (
        <PropertyTable data={allProperties} showDetails={showDetails} />
      )}

      {/* Modal */}
      {selectedItem && modalType && (
        <Modal selectedItem={selectedItem} modalType={modalType} closeModal={closeModal} />
      )}
    </div>
  );
};

// Reusable Tables
const LandlordTable = ({ data, onApprove, onReject, showDetails }) => (
  <div className="pending-section">
    <h2>Landlords</h2>
    {data.length === 0 ? <p>No landlords available.</p> : (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            {onApprove && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(landlord => (
            <tr key={landlord.id}>
              <td>{landlord.name}</td>
              <td>{landlord.email}</td>
              <td>{landlord.landlordStatus === 0 ? '🕘 Pending' : landlord.landlordStatus === 1 ? '✅ Approved' : '❌ Rejected'}</td>
              {onApprove && (
                <td className="actions">
                  <button className="approve-btn" onClick={() => onApprove(landlord.id, 'landlord')}><FaCheck /> Approve</button>
                  <button className="reject-btn" onClick={() => onReject(landlord.id, 'landlord')}><FaTimes /> Reject</button>
                  <button className="details-btn" onClick={() => showDetails(landlord, 'landlord')}><FaInfoCircle /> Details</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
const PropertyTable = ({ data, onApprove, onReject, showDetails }) => (
  <div className="pending-section">
    <h2>Posts</h2>
    {data.length === 0 ? <p>No properties available.</p> : (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Landlord</th>
            <th>Price</th>
            <th>Location</th>
            <th>Rental Status</th>
            <th>Accept Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(property => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.landlordName}</td>
              <td>${property.price}</td>
              <td>{property.location}</td>
              <td style={{ color: property.rentalStatus === 1 ? 'red' : 'green' }}>
                {property.rentalStatus === 1 ? 'Rented' : 'Available'}
              </td>
              
              <td style={{ color: property.acceptedStatus === 2 ? 'red' : 'green' }}>
                {property.acceptedStatus === 0 && 'Pending'}
                {property.acceptedStatus === 1 && 'Approved'}
                {property.acceptedStatus === 2 && 'Rejected'}
              </td>
              <td className="actions">
                {onApprove ? (
                  <>
                    <button className="approve-btn" onClick={() => onApprove(property.id)}><FaCheck /> Approve</button>
                    <button className="reject-btn" onClick={() => onReject(property.id)}><FaTimes /> Reject</button>
                    <button className="details-btn" onClick={() => showDetails(property, 'property')}><FaInfoCircle /> Details</button>
                  </>
                ) : (
                  <button className="details-btn" onClick={() => showDetails(property, 'property')}><FaInfoCircle /> Details</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

// Modal
const Modal = ({ selectedItem, modalType, closeModal }) => (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="close-modal" onClick={closeModal}>×</button>
      {modalType === 'landlord' ? (
        <>
          <h2>Landlord Details</h2>
          <div className="details-grid">
            <div><strong>Name:</strong> {selectedItem.name}</div>
            <div><strong>Email:</strong> {selectedItem.email}</div>
          </div>
        </>
      ) : (
        <>
          <h2>Property Details</h2>
          {selectedItem.image && (
            <div className="property-image">
              <img src={selectedItem.image} alt={selectedItem.title} />
            </div>
          )}
          <div className="details-grid">
            <div><strong>Title:</strong> {selectedItem.title}</div>
            <div><strong>Description:</strong> {selectedItem.description}</div>
            <div><strong>Price:</strong> ${selectedItem.price}</div>
            <div><strong>Location:</strong> {selectedItem.location}</div>
            <div><strong>Landlord:</strong> {selectedItem.landlordName}</div>
          </div>
        </>
      )}
    </div>
  </div>
);

export default AdminDashboard;
