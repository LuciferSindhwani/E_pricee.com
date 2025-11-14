import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Send, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AITravelChatProps {
  tripId?: string;
  context?: Record<string, any>;
}

export const AITravelChat: React.FC<AITravelChatProps> = ({ tripId, context }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI travel assistant. Ask me anything about travel planning, destinations, packing, budgeting, or your trip!",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const client = createAIApiClient({ token: token || undefined });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await client.chatWithAI(inputValue, context, tripId);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'What should I pack for tropical weather?',
    'How much should I budget per day?',
    'What are the best local restaurants?',
    'Is there anything else I should know?',
  ];

  return (
    <Card className="w-full h-full max-w-2xl mx-auto flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          AI Travel Assistant
        </CardTitle>
        <CardDescription>Ask me anything about your trip</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 border rounded-lg p-4 bg-slate-50">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2">
            <p className="text-xs font-medium text-gray-600">Suggested questions:</p>
            {suggestedQuestions.map((q, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto"
                onClick={() => {
                  setInputValue(q);
                }}
              >
                {q}
              </Button>
            ))}
          </div>
        )}

        {/* Input Section */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITravelChat;
