import React, { useState } from 'react';
import './App.css';
import ChatHistory, { Message } from './components/ChatHistory';
import InputArea from './components/InputArea';

const initialMessages: Message[] = [
  { id: 1, sender: 'bot', text: 'Witaj! Naciśnij mikrofon i zacznij mówić.' },
];

// Deklaracje typów Web Speech API dla TypeScript w przeglądarce
// @ts-ignore
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
}
// @ts-ignore
interface SpeechRecognitionEvent extends Event {
  results: ArrayLike<{
    0: { transcript: string };
  }>;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Inicjalizacja Web Speech API
  React.useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'pl-PL';
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      setRecognition(recog);
    }
  }, []);

  // Mock LLM - prosta symulacja odpowiedzi
  const mockLLM = (userText: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Bot odpowiada na: "${userText}"`);
      }, 1200);
    });
  };

  // Synteza mowy
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    if (synth) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'pl-PL';
      synth.speak(utter);
    }
  };

  // Obsługa mikrofonu
  const handleMicClick = () => {
    if (!recognition) return;
    if (!listening) {
      recognition.start();
      setListening(true);
      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        const userMsg: Message = {
          id: messages.length + 1,
          sender: 'user',
          text: transcript,
        };
        setMessages((prev) => [...prev, userMsg]);
        setListening(false);
        recognition.stop();
        // Odpowiedź bota (mock LLM)
        const botText = await mockLLM(transcript);
        const botMsg: Message = {
          id: messages.length + 2,
          sender: 'bot',
          text: botText,
        };
        setMessages((prev) => [...prev, botMsg]);
        speak(botText);
      };
      recognition.onerror = () => {
        setListening(false);
        recognition.stop();
      };
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <div className="app-container">
      <h2>VideoChat Desktop MVP</h2>
      <ChatHistory messages={messages} />
      <InputArea onMicClick={handleMicClick} listening={listening} />
    </div>
  );
};

export default App;
