import React, { useState, useEffect, useRef } from 'react';
import './ChatPanel.css';

const ChatPanel = ({ roomName, messages = [], onSendMessage, isConnected = true }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let storedName = localStorage.getItem('username');
    if (!storedName) {
      storedName = prompt('Lütfen bir kullanıcı adı girin:');
      if (storedName) {
        localStorage.setItem('username', storedName);
      } else {
        storedName = 'Anonim';
      }
    }
    setUsername(storedName);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected && username) {
      onSendMessage(newMessage.trim(), username);
      setNewMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return '';
    }
  };

  const getMessageTypeClass = (messageType) => {
    switch (messageType) {
      case 'SYSTEM':
        return 'message-system';
      case 'GAME':
        return 'message-game';
      default:
        return 'message-chat';
    }
  };

  const isOwnMessage = (message) => {
    return (message.username && message.username === username) ||
           (message.user?.username && message.user.username === username);
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h5>Sohbet</h5>
        <div className="chat-status">
          <span className="room-name">{roomName}</span>
          <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </div>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Sohbet henüz başlamadı. İlk mesajı siz gönderin!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id || index} 
              className={`message ${getMessageTypeClass(message.message_type)} ${
                isOwnMessage(message) ? 'message-own' : ''
              }`}
            >
              <div className="message-header">
                <span className="message-author">
                  {message.username || (message.user ? message.user.username : 'Sistem')}
                </span>
                <span className="message-time">
                  {formatTime(message.created_at)}
                </span>
              </div>
              <div className="message-content">
                {message.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Mesajınızı yazın..." : "Bağlantı yok..."}
            className="message-input"
            maxLength={500}
            disabled={!isConnected}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!newMessage.trim() || !isConnected}
          >
            Gönder
          </button>
        </div>
        {newMessage.length > 0 && (
          <div className="message-counter">
            {newMessage.length}/500
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatPanel; 