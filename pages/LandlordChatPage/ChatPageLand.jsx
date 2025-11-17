import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
//import { jwtDecode } from 'jwt-decode';

const ChatPage = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [selectedChat, setSelectedChat] = useState({ messages: [] });
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const connectionRef = useRef(null);
  const userId = parseInt(localStorage.getItem("UserId"));

  const fetchTenants = async () => {
    const token = localStorage.getItem("userToken");

    /*if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        console.warn("🔐 Token has expired.");
        // TODO: Refresh token logic
      } else {
        console.log("🔐 Token is valid.");
      }
    }*/

    try {
      const response = await fetch(`http://localhost:5062/api/Message/landlord/tenants-messaged/${userId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const formatted = data.map(tenant => ({
          id: tenant.id,
          name: tenant.name,
        }));
        setTenants(formatted);
      }
    } catch (error) {
      console.error('❌ Error fetching tenants:', error);
    }
  };

  const startConnection = async (connection) => {
    try {
      await connection.start();
      console.log("✅ SignalR connected (landlord)");
    } catch (err) {
      console.error("⚠️ SignalR connection failed, retrying...", err);
      setTimeout(() => startConnection(connection), 1000);
    }
  };

  useEffect(() => {
    fetchTenants();

    if (connectionRef.current) return;

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5062/messagehub", {
        accessTokenFactory: () => localStorage.getItem("userToken") || ""
      })
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("ReceiveMessage", (senderId, message, sentAt) => {
      console.log("📩 New SignalR message");

      setSelectedChat(prev => {
        const exists = prev.messages?.some(
          m => m.text === message && m.senderId === senderId && m.SentAt === sentAt
        );
        if (exists) return prev;

        return {
          ...prev,
          messages: [...(prev.messages || []), {
            text: message,
            senderId,
            SentAt: sentAt || new Date().toISOString()
          }]
        };
      });
    });

    connection.onclose(() => {
      console.warn("⚠️ SignalR disconnected, reconnecting...");
      setTimeout(() => startConnection(connection), 5000);
    });

    connectionRef.current = connection;
    startConnection(connection);

    return () => {
      connection.stop();
    };
  }, []);

  const fetchMessages = async (receiverId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5062/api/Message/chat/${userId}/${receiverId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const formatted = data.map(msg => ({
          text: msg.plainText || msg.PlainText || msg.text || "",
          senderId: msg.senderId || msg.SenderId,
          receiverId: msg.receiverId || msg.ReceiverId,
          SentAt: msg.SentAt || new Date().toISOString()
        }));
        setSelectedChat(prev => ({ ...prev, messages: formatted }));
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTenantSelect = async (tenant) => {
    setSelectedChat({ ...tenant, messages: [] });
    await fetchMessages(tenant.id);
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedChat || !selectedChat.id) return;

    const messageDto = {
      SenderId: userId,
      ReceiverId: selectedChat.id,
      PlainText: messageInput
    };

    const newMsg = {
      text: messageDto.PlainText,
      senderId: userId,
      receiverId: selectedChat.id,
      SentAt: new Date().toISOString()
    };

    // إضافة الرسالة إلى الحالة بشكل فوري
    setSelectedChat(prev => ({
      ...prev,
      messages: [...(prev.messages || []), newMsg]
    }));

    try {
      const response = await fetch('http://localhost:5062/api/Message/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageDto)
      });

      if (response.ok) {
        setMessageInput(''); // تنظيف خانة الإدخال بعد الإرسال
      } else {
        console.error("❌ Failed to send message");
      }
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>
        <h3>Your Tenants Chats</h3>
        {tenants.map(tenant => (
          <div
            key={tenant.id}
            className={`chat-user ${selectedChat?.id === tenant.id ? 'active' : ''}`}
            onClick={() => handleTenantSelect(tenant)}
          >
            <div className="chat-name">{tenant.name}</div>
          </div>
        ))}
      </div>

      <div className="chat-main">
        {selectedChat && selectedChat.id ? (
          <>
            <div className="chat-header">
              <div className="chat-partner-info">
                <h4>{selectedChat.name}</h4>
              </div>
            </div>

            <div className="chat-body">
              {isLoading ? (
                <div className="loading">Loading messages...</div>
              ) : selectedChat?.messages?.length > 0 ? (
                selectedChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-bubble ${msg.senderId === userId ? 'outgoing' : 'incoming'}`}
                  >
                    <p>{msg.text}</p>
                    <span className="message-time">
                      {new Date(msg.SentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-messages">No messages yet</p>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <p className="select-chat">Select a tenant to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
