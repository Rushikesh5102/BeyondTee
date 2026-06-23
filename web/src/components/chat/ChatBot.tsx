
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const SUGGESTIONS = [
    "How do I choose my size?",
    "What is the return policy?",
    "How does customization work?",
    "Track my order"
];

const BOT_RESPONSES: Record<string, string> = {
    "size": "For sizing, we recommend checking our Size Chart on the product page. Generally, our 'Oversized' tees run large, so stick to your normal size for a baggy fit, or size down for a regular fit.",
    "return": "We accept returns within 14 days of delivery for unworn items. Customized items are unique to you and cannot be returned unless defective.",
    "customization": "It's easy! Go to 'Customize', choose a product, and use our 3D editor to add Decals, Text, and change colors. Layer them up to create something unique.",
    "track": "You can track your order using the 'Track Order' link in the footer or menu. You'll need your Order ID.",
    "default": "I'm still learning! I can help with Sizing, Returns, or Customization questions. Try asking about one of those."
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showWhatsapp, setShowWhatsapp] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hi! I'm BeyondAI. Design assistant & support. How can I help you today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let responseText = BOT_RESPONSES.default;
            let resolved = false;

            if (lowerText.includes("size") || lowerText.includes("fit")) { responseText = BOT_RESPONSES.size; resolved = true; }
            else if (lowerText.includes("return") || lowerText.includes("refund")) { responseText = BOT_RESPONSES.return; resolved = true; }
            else if (lowerText.includes("custom") || lowerText.includes("design")) { responseText = BOT_RESPONSES.customization; resolved = true; }
            else if (lowerText.includes("track") || lowerText.includes("order")) { responseText = BOT_RESPONSES.track; resolved = true; }

            if (!resolved) {
                setShowWhatsapp(true);
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Conditional WhatsApp Toggle */}
            <AnimatePresence>
                {!isOpen && showWhatsapp && (
                    <motion.a
                        key="whatsapp-btn"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fixed bottom-[110px] right-8 z-50 group transition-transform duration-300 hover:scale-110 active:scale-95 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-none"
                    >
                        <MessageCircle size={28} />

                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 bg-zinc-900 border border-white/10 text-white text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                            Chat on WhatsApp
                        </div>
                    </motion.a>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-50 group transition-transform duration-300 hover:scale-110 active:scale-95 cursor-none"
            >
                <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(204,255,0,0.2)]">
                    {/* SVG Bubble Shape */}
                    <svg
                        viewBox="0 0 24 24"
                        fill="#050505"
                        stroke="rgba(204,255,0,0.3)"
                        strokeWidth="1"
                        className="w-full h-full absolute inset-0 z-0 scale-x-[-1]"
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {/* Inner Accent Glow */}
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-0 clip-chat-bubble" />

                    {/* Content */}
                    <div className="relative z-10">
                        {isOpen ? (
                            <X size={24} className="text-white group-hover:rotate-90 transition-transform" />
                        ) : (
                            <img
                                src="/logo-white.png"
                                alt="Chat"
                                className="w-8 h-8 object-contain group-hover:scale-110 transition-all opacity-90 group-hover:opacity-100"
                            />
                        )}
                    </div>
                </div>

                {/* Ping Effect (Outside) */}
                {!isOpen && (
                    <div className="absolute inset-0 z-[-1] animate-ping opacity-30">
                        <svg viewBox="0 0 24 24" fill="rgba(204,255,0,0.2)" className="w-full h-full scale-x-[-1]">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[350px] h-[500px] bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl flex flex-col font-inter overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-zinc-900 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">BeyondAI</h3>
                                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>

                            <a
                                href="https://wa.me/919876543210"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-green-500 hover:bg-green-500 text-xs hover:text-white rounded-full transition-colors cursor-none border border-green-500/20"
                            >
                                <MessageCircle size={14} />
                                <span className="font-medium">Support</span>
                            </a>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                        max-w-[80%] rounded-2xl px-4 py-2.5 text-sm
                                        ${msg.sender === 'user'
                                            ? 'bg-purple-600 text-white rounded-br-none'
                                            : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                                        }
                                    `}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        {messages.length < 3 && (
                            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
                                {SUGGESTIONS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleSend(s)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded-full transition-colors border border-white/5"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-zinc-900 border-t border-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 bg-black/50 border border-zinc-700 rounded-full px-4 py-2 focus-within:border-purple-500 transition-colors"
                            >
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder-zinc-500"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="text-purple-500 hover:text-purple-400 disabled:opacity-50 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
