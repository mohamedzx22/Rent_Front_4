
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { FaHome, FaPlus, FaEnvelope, FaChartLine, FaFileAlt, FaReply, FaTimes } from 'react-icons/fa';
import './LandlordDashboard.css';
import { fetchWithRefresh } from '../../hooks/api';

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesData = await fetchWithRefresh('http://localhost:5062/api/post/landlord/posts');
        
        if (!propertiesData) {
          throw new Error('No data received');
        }
        
        console.log('Fetched properties:', propertiesData); // تحقق من شكل البيانات هنا
        setProperties(Array.isArray(propertiesData) ? propertiesData : []);
        
      } catch (error) {
        console.error('Fetch error:', error);
        setProperties([]);
        
        // Redirect to login on 401 error
        if (error.message.includes('401')) {
          window.location.href = '/login';
        }
      }
    };
    
  
    // Fetch rental applications
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5062/api/Proposal/Pending_Proposals', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        console.log('Fetched applications:', response.data.views);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]); 
      }
    };
  
    // Call both fetch functions
    fetchProperties();
    fetchApplications();
  
  }, []);
  

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  const handleStatusChange = (propertyId, newStatus) => {
    setProperties(properties.map(prop => 
      prop.id === propertyId ? { ...prop, status: newStatus } : prop
    ));
  };

  const handleEdit = (propertyId) => {
    navigate(`/edit-property/${propertyId}`);
  };

  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this property?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5062/api/post/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
  
        if (response.status === 204) {
          setProperties(properties.filter(prop => prop.id !== propertyId));
          setApplications(applications.filter(app => app.propertyId !== propertyId));
          setMessages(messages.filter(msg => msg.propertyId !== propertyId));
          alert('Property and related applications and messages have been deleted.');
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('There was an error deleting the property.');
      }
    }
  };

  const handleApprove = async (appId) => {
    try {
        // إرسال طلب قبول إلى الـ backend
        const response = await axios.put(
            `http://localhost:5062/api/proposal/approve-proposal/${appId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                },
            }
        );
        // تحديث الحالة في الواجهة بعد القبول
        setApplications(applications.map(app =>
            app.id === appId ? { ...app, status: 1 } : app
        ));
        alert('Application accepted successfully!');
    } catch (error) {
        console.error('Error accepting application:', error);
        alert('Failed to accept the application.');
    }
};

const handleReject = async (appId) => {
    try {
        // إرسال طلب رفض إلى الـ backend
        const response = await axios.put(
            `http://localhost:5062/api/proposal/reject-proposal/${appId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                },
            }
        );
        // تحديث الحالة في الواجهة بعد الرفض
        setApplications(applications.map(app =>
            app.id === appId ? { ...app, status: 2 } : app
        ));
        alert('Application rejected successfully!');
    } catch (error) {
        console.error('Error rejecting application:', error);
        alert('Failed to reject the application.');
    }
};


const handleViewApplication = (appId) => {
    const application = applications.find(app => app.id === appId);
    console.log("Fetching application with id:", appId);
    navigate(`/application/${appId}`, { state: { application } });

};
  const handleViewMessage = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
      setUnreadCount(messages.filter(msg => !msg.read && msg.id !== messageId).length);
      setSelectedMessage(message);
      setIsReplying(false);
      setReplyContent('');
    }
  };

  const handleBackToMessages = () => {
    setSelectedMessage(null);
    setIsReplying(false);
    setReplyContent('');
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    setUnreadCount(messages.filter(msg => !msg.read && msg.id !== messageId).length);
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null);
      setIsReplying(false);
    }
  };

  const handleStartReply = () => {
    setIsReplying(true);
    setReplyContent(`Re: ${selectedMessage.subject}\n\nDear ${selectedMessage.from},\n\n`);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyContent('');
  };

  const handleReplySubmit = () => {
    if (replyContent.trim() === '') return;
    
    // In a real app, you would send this to your backend
    const newMessage = {
      id: messages.length + 1,
      from: 'You',
      subject: `Re: ${selectedMessage.subject}`,
      date: new Date().toISOString().split('T')[0],
      read: true,
      propertyId: selectedMessage.propertyId,
      content: replyContent
    };
    
    setMessages([newMessage, ...messages]);
    setIsReplying(false);
    setReplyContent('');
    alert('Reply sent successfully!');
  };

  const getPropertyTitle = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.title : 'General Inquiry';
  };
 
  return (
    <div className="landlord-dashboard">
      <div className="sidebar">
        <button 
          className={`nav-item ${activeTab === 'properties' ? 'active' : ''}`} 
          onClick={() => setActiveTab('properties')}
        >
          <FaHome /> My Posts
        </button>
        <button 
          className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`} 
          onClick={() => setActiveTab('applications')}
        >
          <FaFileAlt /> Applications
        </button>
        <button 
  className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} 
  onClick={() => navigate('/landlordChat/:landlordId')}
>
  <FaEnvelope /> Chat
</button>

        <button 
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} 
          onClick={() => setActiveTab('analytics')}
        >
          <FaChartLine /> Analytics
        </button>
      </div>

      <div className="main-content">
        {activeTab === 'properties' && (
          <div className="properties-section">
            <div className="section-header">
              <h2>My Posts</h2>
              <button className="add-property" onClick={handleAddProperty}>
                <FaPlus /> Add Property
              </button>
            </div>
            {properties.length === 0 ? (
              <p>You haven't listed any properties yet.</p>
            ) : (
<table>
  <thead>
    <tr>
      <th>Image</th>
      <th>Title</th>
      <th>Location</th>
      <th>Price</th>
      <th>Views</th>
      <th>Rental State</th>
      <th>Approval State</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {properties.map(property => (
      <tr key={property.id}>
        <td>
          <img 
            src={property.image || `${process.env.PUBLIC_URL}/assets/properties/default.jfif`} 
            alt={property.title}
            className="property-thumbnail"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `${process.env.PUBLIC_URL}/assets/properties/default.jfif`;
            }}
          />
        </td>
        <td>{property.title}</td>
        <td>{property.location}</td>
        <td>${Number(property.price).toLocaleString()}</td>
        <td>{property.numberOfViewers}</td>
        <td style={{ color: property.rentalStatus === 1 ? 'red' : 'green' }}>
        {property.rentalStatus === 0 ? '✔️Available' : property.rentalStatus === 1 ? '💸Rented' : 'Unknown'}</td>
        <td>
        <td style={{ color: property.acceptedStatus === 2 ? 'red' : 'green' }}>
  {property.acceptedStatus == 0 ? '🕘Pending' :
   property.acceptedStatus == 1 ? '✅Approved' :
   property.acceptedStatus == 2 ? '❌Rejected' : 'Unknown'}
</td>        </td>
        <td>
          <button className="edit-btn" onClick={() => handleEdit(property.id)}>Edit</button>
          <button className="delete-btn" onClick={() => handleDelete(property.id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
            )}
          </div>
        )}

{activeTab === 'applications' && (
                    <div className="applications-section">
                        <h2>Rental Applications</h2>
                        {applications.length === 0 ? (
                            <p>No applications received yet.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Property</th>
                                        <th>Location</th>
                                        <th>Price</th>
                                        <th>Views</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {applications.map(app => {
const property = properties.find(p => p.id === app.postId);

                                            return (
                                                <tr key={app.id}>
                                                    <td>
  <img
    src={property?.image || `${process.env.PUBLIC_URL}/assets/properties/default.jfif`}
    alt={property?.title || 'Property'}
    className="property-thumbnail"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = `${process.env.PUBLIC_URL}/assets/properties/default.jfif`;
    }}
  />
</td>

                                                    <td>{property?.title || 'Unknown Property'}</td>
                                                    <td>{property?.location || '-'}</td>
                                                    <td>${property ? Number(property.price).toLocaleString() : '-'}</td>
                                                    <td>{property?.views ?? '-'}</td>
                                                    <td>
                                                        <span className={`status-badge ${app.status}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {app.status === 0 && (
                                                            <>
                                                                <button className="approve-btn" onClick={() => handleApprove(app.id)}>Approve</button>
                                                                <button className="reject-btn" onClick={() => handleReject(app.id)}>Reject</button>
                                                            </>
                                                        )}

                                                        <button className="view-btn" onClick={() => handleViewApplication(app.id)}>View</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                </tbody>
                            </table>
                        )}
                    </div>
                )}

{activeTab === 'messages' && (
  <div className="messages-section">
    <h2>Messages</h2>

    {selectedMessage ? (
      <div className="message-detail">
        <button className="back-btn" onClick={handleBackToMessages}>Back to Messages</button>
        <h3>{selectedMessage.subject}</h3>
        <p><strong>From:</strong> {selectedMessage.from}</p>
        <p><strong>Date:</strong> {selectedMessage.SentAt}</p>
        <p className="message-content">{selectedMessage.PlainText}</p>

        {isReplying ? (
          <div className="reply-section">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply here..."
              rows="6"
            />
            <div className="reply-actions">
              <button className="send-btn" onClick={handleReplySubmit}>Send Reply</button>
              <button className="cancel-btn" onClick={handleCancelReply}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="message-actions">
            <button className="reply-btn" onClick={handleStartReply}>
              <FaReply /> Reply
            </button>
            <button className="delete-btn" onClick={() => handleDeleteMessage(selectedMessage.id)}>
              <FaTimes /> Delete
            </button>
          </div>
        )}
      </div>
    ) : (
      // This part is the message listing when no message is selected
      <div>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Property</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message, index) => (
                <tr key={index} className={!message.read ? 'unread' : ''}>
                  <td>{message.senderId}</td>
                  <td>{message.receiverId}</td>
                  <td>{message.plainText}</td>
                  <td>{new Date(message.sentAt).toLocaleString()}</td>
                  <td>{message.read ? 'Read' : 'Unread'}</td>
                  <td>
                    <button className="view-btn" onClick={() => handleViewMessage(message.id)}>View</button>
                    <button className="delete-btn" onClick={() => handleDeleteMessage(message.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )}
  </div>
)}

{activeTab === 'analytics' && (
  <div className="analytics-section">
    <h2> Analytics</h2>
    <div className="analytics-grid">
      <div className="stat-card">
        <h3>Total Properties</h3>
        <p>{properties.length}</p>
      </div>
      <div className="stat-card">
        <h3>Approved Posts</h3>
        <p>{properties.filter(p => p.rentalStatus === 0 && p.acceptedStatus === 1).length}</p>  {/* Available and Approved */}
      </div>
      <div className="stat-card">
        <h3>Total Views</h3>
        <p>{properties.reduce((sum, prop) => sum + prop.views, 0)}</p>
      </div>
      <div className="stat-card">
  <h3>Total Users Sent Messages</h3>
  <p>{[...new Set(messages.map(message => message.senderId))].length}</p> {/* حساب عدد المرسلين الفريدين */}
</div>

    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default LandlordDashboard;