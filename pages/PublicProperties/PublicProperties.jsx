import React, { useState, useEffect } from 'react';
import { FaSearch, FaHeart, FaFileAlt, FaCommentAlt, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PublicProperties.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PublicProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: ''
  },{ location: '' });
  const [savedProperties, setSavedProperties] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chatProperty, setChatProperty] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = localStorage.getItem('UserId');
  const [locations, setLocations] = useState([]);

  // تحميل البوستات من API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5062/api/post/view-tenant", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        console.log(response.data);
        const uniqueLocations = [...new Set(response.data.map(property => property.location))];
        setLocations(uniqueLocations);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);
  const filteredProperties = properties.filter(property => {
    return (
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.location === '' || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.minPrice === '' || property.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === '' || property.price <= Number(filters.maxPrice))
    );
  });
  // تحميل البوستات المحفوظة من قبل المستخدم
  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:5062/api/SavePost/saved-posts/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setSavedProperties(response.data.map(post => post.id)); // نفترض أن الاستجابة هي قائمة بالبوستات المحفوظة
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };

    if (currentUserId) {
      fetchSavedProperties();
    }
  }, [currentUserId]);

  /*const filteredProperties = properties.filter(property => {
    return (
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.location === '' || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.minPrice === '' || property.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === '' || property.price <= Number(filters.maxPrice))
    );
  });*/

  const toggleSaveProperty = async (propertyId) => {
    const isSaved = savedProperties.includes(propertyId);

    try {
      if (isSaved) {
        await axios.delete(
          `http://localhost:5062/api/SavePost/unsave-post/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          }
        );
        setSavedProperties(savedProperties.filter(id => id !== propertyId));
        toast.info('Removed from saved posts');
      } else {
        await axios.post(
          `http://localhost:5062/api/SavePost/save-post/${propertyId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          }
        );
        setSavedProperties([...savedProperties, propertyId]);
        toast.success('Saved successfully!');
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error('Error while saving/unsaving');
    }
  };

  const handleApply = (propertyId) => {
    navigate(`/booking/${propertyId}`);
  };

  const handleOpenChat = async (property) => {
    setChatProperty(property);
    setShowChat(true);

    try {
      const response = await fetch(`http://localhost:5062/api/Message/chat/${currentUserId}/${property.id}`);
      const data = await response.json();
      const formattedMessages = data.map((msg, index) => ({
        id: index + 1,
        text: msg.plainText,
        sender: msg.senderId === currentUserId ? 'user' : 'bot'
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([{
        id: 1,
        text: `Hello! I'm the virtual assistant for ${property.title}. How can I help you?`,
        sender: 'bot'
      }]);
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatProperty(null);
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const messageData = {
        PlainText: newMessage,
        SenderId: Number(localStorage.getItem('UserId')),
        ReceiverId: chatProperty?.landlordId || 2,
      };

      const response = await axios.post('http://localhost:5062/api/Message/send', messageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (response.status === 200) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: newMessage,
            sender: 'user'
          }
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error.response ? error.response.data : error);
      alert('There was an error sending the message.');
    }
  };

  return (
    <div className="public-properties">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="search-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search properties by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
        <select
  value={filters.location}
  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
>
  <option value="">All Locations</option>
  {locations.length > 0 ? (
    locations.map((location, index) => (
      <option key={index} value={location}>
        {location}
      </option>
    ))
  ) : (
    <option>No Locations Available</option>
  )}
</select>

          <input
            type="number"
            placeholder="Min Price ($)"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            min="0"
          />
          <input
            type="number"
            placeholder="Max Price ($)"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            min="0"
          />
        </div>
      </div>

      <div className="property-list">
        {filteredProperties.map(property => (
          <div key={property.id} className="property-card">
            <div className="property-image-container">
              <img 
                className="property-image"
                src={property.image || 'http://localhost:5062/images/default.jpg'}
                alt={property.title} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'http://localhost:5062/images/default.jpg'; 
                }}
              />
              <div className="property-image-overlay">
                <button 
                  className={`save-btn ${savedProperties.includes(property.id) ? 'saved' : ''}`}
                  onClick={() => toggleSaveProperty(property.id)}
                >
                  {savedProperties.includes(property.id) ? <FaHeart color="red" /> : <FaHeart />} 
                  {savedProperties.includes(property.id) ? 'Saved' : 'Save'}
                </button>
                <button 
                  className="chat-btn"
                  onClick={() => handleOpenChat(property)}
                >
                  <FaCommentAlt /> Chat
                </button>
              </div>
            </div>
            <div className="property-details">
              <div className="property-header">
                <h3>{property.title}</h3>
            
              </div>
              <p className="price">${property.price.toLocaleString()}/month</p>
              <p className="description">{property.description}</p>
              <div className="features">
                <p className="rental-status">
                  <span className="label">Status: </span>
                  <span className={
                    property.rentalStatus === 0
                      ? 'status-available'
                      : property.rentalStatus === 1
                        ? 'status-rented'
                        : 'status-unknown'
                  }>
                    {property.rentalStatus === 0
                      ? '🏠 Available'
                      : property.rentalStatus === 1
                        ? '🔒Rented'
                        : 'Unknown'}
                  </span>
                </p>
              </div>
              <div className="property-footer">
                <p className="landlord">Managed by: {property.landlordName}</p>
                <button 
                  className="apply-btn"
                  onClick={() => handleApply(property.id)}
                >
                  <FaFileAlt /> Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showChat && (
        <div className="property-chat-container">
          <div className="chat-header">
            <h3>Chat about {chatProperty?.title}</h3>
            <button className="close-chat" onClick={handleCloseChat}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit"><FaPaperPlane /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PublicProperties;
