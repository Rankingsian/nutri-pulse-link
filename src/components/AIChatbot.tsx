import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Bot, User, Settings, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem('openai_api_key', apiKey);
    setShowApiKeyInput(false);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !apiKey) {
      if (!apiKey) {
        toast({
          title: "Error",
          description: "Please set your OpenAI API key first",
          variant: "destructive"
        });
        setShowApiKeyInput(true);
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant for a healthcare and nutrition system. Provide general health awareness, nutrition advice, and preventive care recommendations. Always recommend consulting healthcare professionals for medical concerns.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage.content
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle>AI Health Assistant</CardTitle>
            {apiKey && (
              <Badge variant="secondary" className="text-xs">
                Connected
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearChat}>
                Clear Chat
              </Button>
            )}
          </div>
        </CardHeader>

        {showApiKeyInput && (
          <div className="mx-6 mb-4">
            <Alert>
              <AlertDescription>
                <div className="space-y-3">
                  <p className="text-sm">
                    Enter your OpenAI API key to start chatting. Your key is stored locally in your browser.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        placeholder="sk-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button onClick={saveApiKey}>
                      Save
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Start a conversation with the AI health assistant!</p>
                  <p className="text-sm mt-2">Ask about nutrition, wellness tips, or general health questions.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] space-y-1 ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}>
                      <div className={`rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="max-w-[70%]">
                    <div className="rounded-lg px-4 py-2 bg-muted">
                      <p className="text-sm text-muted-foreground">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-6 pt-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about nutrition, health tips, or wellness advice..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="min-h-[44px] max-h-32 resize-none"
                disabled={isLoading || !apiKey}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim() || !apiKey}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}