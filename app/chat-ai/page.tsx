'use client';

import { useState, useEffect, useRef } from 'react';
import '../globals.css'

interface Message {
  content: any;
  isUser: boolean;
  sender: string;
}

const TYPING_SPEED = 30;
const CHATBOT_NAME = 'AI Assistant';

const Chatbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
  const [animatedText, setAnimatedText] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
   const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchRemainingQuota();
  }, []);

const containsCode = (content: string): boolean => {
  return content.includes('```') || content.includes('"""') || content.trim().startsWith('$') || content.trim().startsWith('> ');
};

const clearChat = () => {
  setMessages([]);
  setAnimatedText('');
};

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, animatedText]);

  const fetchRemainingQuota = async () => {
    try {
      const response = await fetch('/api/chatbot');
      if (response.ok) {
        const data = await response.json();
        setRemainingQuota(data.remainingQuota);
      }
    } catch (error) {
      console.error('Error fetching remaining quota:', error);
    }
  };

  const animateText = (text: string) => {
    let i = 0;
    const interval = setInterval(() => {
      setAnimatedText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setMessages(prev => [...prev.slice(0, -1), { content: text, isUser: false, sender: CHATBOT_NAME }]);
        setAnimatedText('');
      }
    }, TYPING_SPEED);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { content: input, isUser: true, sender: userName || 'You' };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      setRemainingQuota(data.remainingQuota);

      if (typeof data.response === 'string') {
        setMessages(prev => [...prev, { content: '', isUser: false, sender: CHATBOT_NAME }]);
        animateText(data.response);
      } else {
        setMessages(prev => [...prev, { content: data.response, isUser: false, sender: CHATBOT_NAME }]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { content: "Sorry, I couldn't process your request. Please try again.", isUser: false, sender: CHATBOT_NAME };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (index: number, codeContent: string) => {
    navigator.clipboard.writeText(codeContent);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  const renderContent = (content: string) => {
    const codeBlockRegex = /```[\s\S]*?```|"""\s*[\s\S]*?\s*"""/g;
    const parts = content.split(codeBlockRegex);
    const codeBlocks = content.match(codeBlockRegex) || [];

    return (
      <div>
        {parts.map((part, index) => {
          if (index % 2 === 0) {
            return <div key={index}>{part}</div>;
          } else {
            const codeContent = codeBlocks[(index - 1) / 2].replace(/```|"""/g, '').trim();
            const isCopied = copiedIndex === index;

            return (
              <div key={index} className="relative">
                <pre className={`p-4 my-2 rounded-lg overflow-x-auto ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
                  <code>{codeContent}</code>
                </pre>
                <button
                  onClick={() => handleCopy(index, codeContent)}
                  className={`absolute top-2 right-2 p-1 rounded-md ${
                    theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } flex items-center`}
                  title={isCopied ? "Copied!" : "Copy to clipboard"}
                >
                  {isCopied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  )}
                </button>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const renderMessage = (msg: Message) => (
    <div>
      <div className={`font-bold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{msg.sender}</div>
      {typeof msg.content === 'string' ? (
        renderContent(msg.content)
      ) : (
        <div>
          {msg.content.text && renderContent(msg.content.text)}
          {msg.content.image && <img src={msg.content.image} alt="Response image" className="max-w-full h-auto" />}
        </div>
      )}
    </div>
  );
  
return (
    <div className={`w-full max-w-[1200px] p-4 mx-auto rounded-lg shadow-lg ${theme === 'dark' ? 'bg-[#343541] text-white' : 'bg-white text-[#353740]'}`}>
    <div className="flex justify-end mb-4 gap-5">
      <Selector />
      <button
        onClick={clearChat}
        className={`px-4 py-2 rounded-md ${
          theme === 'dark'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        } transition-colors`}
      >
        Clear Chat
      </button>
      <ThemeToggleButton onChange={toggleTheme} checked={theme === 'dark'} />
      </div>
      <div ref={chatBoxRef} className={`custom-scrollbar ${theme} h-[calc(100vh-200px)] overflow-y-auto p-5 rounded mb-4 ${theme === 'dark' ? 'bg-[#444654]' : 'bg-gray-50'}`}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-4 rounded-lg ${
              msg.isUser
                ? `${theme === 'dark' ? 'bg-[#343541]' : 'bg-white'}`
                : `${theme === 'dark' ? 'bg-[#444654]' : 'bg-gray-100'} ${theme === 'dark' ? 'text-[#ececf1]' : 'text-[#353740]'}`
            }`}
          >
            {renderMessage(msg)}
          </div>
        ))}
        {animatedText && (
          <div className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-[#444654] text-[#ececf1]' : 'bg-gray-100 text-[#353740]'}`}>
            <div className={`font-bold mb-1 ${theme === 'dark' ? 'text-[#ececf1]' : 'text-[#353740]'}`}>{CHATBOT_NAME}</div>
            {animatedText}
          </div>
        )}
        {isLoading && (
          <div className={`text-center ${theme === 'dark' ? 'text-[#ececf1]' : 'text-[#353740]'}`}>
            <Loading />
          </div>
        )}
      </div>
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your name (optional)"
          className={`flex-grow hidden p-2 rounded ${theme === 'dark' ? 'bg-[#40414f] text-white' : 'bg-white text-[#353740]'} border ${theme === 'dark' ? 'border-[#565869]' : 'border-gray-300'}`}
        />
      </div>
    <div className={`flex p-2 rounded-full space-x-2 border ${theme === 'dark' ? 'bg-[#40414f] text-white' : 'bg-white text-[#353740]'} ${theme === 'dark' ? 'border-[#565869]' : 'border-gray-300'}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type your message here, ${userName || 'User'}...`}
          className={`flex-grow p-2 rounded bg-transparent focus:outline-none ${
      theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-[#353740] placeholder-gray-500'
    }`}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
        />
        <button
          onClick={sendMessage}
          className={`p-3 rounded-full ${theme === 'dark' ? 'bg-[#19c37d] hover:bg-[#1a7f5a]' : 'bg-[#19c37d] hover:bg-[#1a7f5a]'} text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors`}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chatbox;