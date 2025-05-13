import React from 'react';

interface InputAreaProps {
  onMicClick: () => void;
  listening: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onMicClick, listening }) => {
  return (
    <div className="input-area">
      <button className={`mic-btn${listening ? ' listening' : ''}`} onClick={onMicClick}>
        {listening ? '🎙️ Nagrywanie...' : '🎤 Start'}
      </button>
    </div>
  );
};

export default InputArea;
