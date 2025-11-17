import React, { useState, useEffect } from 'react';
import './ChatPage.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const ChatPage = () => {
  const navigate = useNavigate();
  const [landlords, setLandlords] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userId = parseInt(localStorage.getItem("UserId"));
  const [connection, setConnection] = useState(null);

  // ✅ Fetch accepted landlords
  const fetchLandlords = async () => {
    try {
      const response = await fetch('http://localhost:5062/api/Message/tenant/accepted-landlords');
      const data = await response.json();
      if (Array.isArray(data)) {
        const formatted = data.map(l => ({
          id: l.userid,
          Name: l.name,
          Email: l.email,
          messages: []
        }));
        setLandlords(formatted);
      }
    } catch (err) {
      console.error('❌ Error fetching landlords:', err);
    }
  };

  // ✅ Fetch messages with a specific landlord
  const fetchMessages = async (receiverId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5062/api/Message/chat/${userId}/${receiverId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const msgs = data.map(m => ({
          text: m.plainText || m.PlainText || m.text || "",
          senderId: m.senderId || m.SenderId,
          receiverId: m.receiverId || m.ReceiverId,
          SentAt: m.SentAt
        }));
        setSelectedChat(prev => ({ ...prev, messages: msgs }));
      }
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ SignalR Setup
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5062/messagehub", {
        accessTokenFactory: () => localStorage.getItem("userToken") || ""
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.on("ReceiveMessage", (senderId, message, sentAt) => {
      const newMsg = {
        text: message,
        senderId: parseInt(senderId),
        SentAt: sentAt || new Date().toISOString()
      };

      setLandlords(prev =>
        prev.map(l => {
          if (l.id === parseInt(senderId)) {
            const exists = l.messages.some(m => m.SentAt === newMsg.SentAt);
            return { ...l, messages: exists ? l.messages : [...l.messages, newMsg] };
          }
          return l;
        })
      );

      setSelectedChat(prev => {
        if (prev && prev.id === parseInt(senderId)) {
          const exists = prev.messages.some(m => m.SentAt === newMsg.SentAt);
          return { ...prev, messages: exists ? prev.messages : [...prev.messages, newMsg] };
        }
        return prev;
      });
    });

    newConnection.start()
      .then(() => console.log("✅ SignalR connected"))
      .catch(err => {
        console.error("❌ SignalR connection error:", err);
        setTimeout(() => newConnection.start(), 2000);
      });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
      console.log("🔌 SignalR disconnected");
    };
  }, []);

  const handleLandlordSelect = async (landlord) => {
    setSelectedChat({ ...landlord, messages: [] });
    await fetchMessages(landlord.id);
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMsg = {
      text: messageInput,
      senderId: userId,
      receiverId: selectedChat.id,
      SentAt: new Date().toISOString()
    };

    const dto = {
      SenderId: userId,
      ReceiverId: selectedChat.id,
      PlainText: messageInput
    };

    setSelectedChat(prev => ({
      ...prev,
      messages: [...(prev.messages || []), newMsg]
    }));

    setLandlords(prev =>
      prev.map(l => {
        if (l.id === selectedChat.id) {
          return { ...l, messages: [...(l.messages || []), newMsg] };
        }
        return l;
      })
    );

    setMessageInput('');

    try {
      const response = await fetch('http://localhost:5062/api/Message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      if (!response.ok) throw new Error("Send failed");

      if (connection) {
        await connection.invoke("SendMessage", String(dto.SenderId), String(dto.ReceiverId), dto.PlainText);
        console.log("📤 SignalR message sent");
      }
    } catch (err) {
      console.error("❌ Error sending:", err);
      // Rollback UI if failed
      setSelectedChat(prev => ({
        ...prev,
        messages: prev.messages.filter(m => m.SentAt !== newMsg.SentAt)
      }));
    }
  };

  useEffect(() => {
    fetchLandlords();
  }, []);

  const handleBack = () => navigate(-1);

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>
        <h3>Chats</h3>
        {landlords.map(l => (
          <div
            key={l.id}
            className={`chat-user ${selectedChat?.id === l.id ? 'active' : ''}`}
            onClick={() => handleLandlordSelect(l)}
          >
            <div className="chat-name">{l.Name}</div>
          </div>
        ))}
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h4>{selectedChat.Name}</h4>
            </div>
            <div className="chat-body">
              {isLoading ? (
                <div className="loading">Loading messages...</div>
              ) : selectedChat.messages?.length > 0 ? (
                selectedChat.messages.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.senderId === userId ? 'outgoing' : 'incoming'}`}>
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
          <p className="select-chat">Select a landlord to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
