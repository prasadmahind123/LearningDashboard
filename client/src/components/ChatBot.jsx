import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContext } from "../context/AppContext.jsx";

const chatVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  exit: { opacity: 0, scale: 0.8, y: 20 }
};

export default function ChatBot() {
  const { axios } = useAppContext();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hi! I'm EduBot, your learning assistant. I can help you with questions about courses, platform features, and your learning journey. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      message: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput("");
    setIsTyping(true);

    try {
      const { data } = await axios.post("/api/ai/chat", { message: currentInput });
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: data.reply || "I'm sorry, I couldn't process that.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: "Sorry, I'm having trouble connecting to the server right now.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-16 right-0 w-80 md:w-96 shadow-2xl rounded-2xl overflow-hidden border border-white/20"
          >
            <Card className="h-[500px] flex flex-col border-0 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center space-x-2">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">EduBot AI</CardTitle>
                    <p className="text-[10px] text-blue-100 font-medium opacity-90 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                {chatMessages.map((message) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                      message.type === "user" 
                        ? "text-white bg-blue-600 rounded-br-none" 
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700"
                    }`}>
                      <p className="leading-relaxed">{message.message}</p>
                      <p className={`text-[10px] mt-1.5 text-right ${message.type === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{message.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                      <div className="flex space-x-1.5 items-center h-4">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </CardContent>

              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleChatSubmit} className="flex gap-2 relative">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 pr-10 rounded-full border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 bg-slate-50 dark:bg-slate-800"
                  />
                  <Button type="submit" size="icon" disabled={!chatInput.trim()} className={`rounded-full absolute right-1 top-1 h-8 w-8 ${!chatInput.trim() ? "opacity-0" : "bg-blue-600"}`}>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!isChatOpen && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
          <Button
            onClick={() => setIsChatOpen(true)}
            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center relative"
          >
            <Bot className="h-8 w-8" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          </Button>
        </motion.div>
      )}
    </div>
  );
}