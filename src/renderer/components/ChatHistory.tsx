import React from 'react';

export interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <div className="chat-history">
      {messages.map((msg) => (
        <div key={msg.id} className={`chat-message ${msg.sender}`}>
          <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
