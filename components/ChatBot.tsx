
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatSession, sendMessageToBot } from '../services/geminiService';

declare const lucide: any;

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Hello! I'm your friendly helper. Ask me anything about creating coloring books!", sender: 'bot' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const session = useRef(getChatSession()).current;

    useEffect(() => {
        if (isOpen && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        lucide.createIcons();
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newUserMessage: ChatMessage = {
            id: Date.now(),
            text: userInput,
            sender: 'user',
        };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const botResponseText = await sendMessageToBot(userInput);
        
        const newBotMessage: ChatMessage = {
            id: Date.now() + 1,
            text: botResponseText,
            sender: 'bot',
        };
        setMessages(prev => [...prev, newBotMessage]);
        setIsLoading(false);
    };

    return (
        <>
            <div className={`fixed bottom-5 right-5 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Open Chat"
                >
                    <i data-lucide="message-circle" className="w-8 h-8"></i>
                </button>
            </div>
            
            <div className={`fixed bottom-5 right-5 w-[calc(100%-2.5rem)] max-w-sm h-[70vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-2xl">
                    <h3 className="font-bold text-lg">Friendly Helper</h3>
                    <button onClick={() => setIsOpen(false)} className="hover:opacity-75" aria-label="Close chat">
                        <i data-lucide="x" className="w-6 h-6"></i>
                    </button>
                </header>

                <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white"><i data-lucide="bot" className="w-5 h-5"/></div>}
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-gray-200 text-gray-800 rounded-br-none' : 'bg-blue-100 text-blue-900 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                             <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white"><i data-lucide="bot" className="w-5 h-5"/></div>
                             <div className="max-w-[80%] p-3 rounded-2xl bg-blue-100 text-blue-900 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex items-center bg-gray-100 rounded-full px-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent p-2 text-sm border-0 focus:ring-0"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading} className="p-2 rounded-full text-blue-500 hover:bg-blue-100 disabled:text-gray-400">
                            <i data-lucide="send" className="w-5 h-5"></i>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChatBot;
