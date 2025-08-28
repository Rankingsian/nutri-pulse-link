import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Home, 
  Heart, 
  Stethoscope, 
  MoreVertical, 
  Phone, 
  Video,
  Paperclip,
  Smile
} from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: number;
  sender: "nurse" | "patient";
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
}

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "nurse",
      content: "Good morning, Sarah! How are you feeling today?",
      timestamp: "9:15 AM",
      type: "text"
    },
    {
      id: 2,
      sender: "patient",
      content: "Good morning! I'm feeling much better, thank you. I took all my morning medications.",
      timestamp: "9:18 AM",
      type: "text"
    },
    {
      id: 3,
      sender: "nurse",
      content: "That's wonderful to hear! I can see in your records that you've been very consistent with your medication schedule. How did you sleep last night?",
      timestamp: "9:20 AM",
      type: "text"
    },
    {
      id: 4,
      sender: "patient",
      content: "I slept about 7 hours, which is much better than last week. The new sleep schedule is really helping.",
      timestamp: "9:22 AM",
      type: "text"
    },
    {
      id: 5,
      sender: "nurse",
      content: "Excellent! Good sleep is crucial for your recovery. Have you had a chance to log your breakfast yet?",
      timestamp: "9:25 AM",
      type: "text"
    },
    {
      id: 6,
      sender: "patient",
      content: "Yes, I had oatmeal with berries and a cup of green tea. I logged it in the app about an hour ago.",
      timestamp: "9:27 AM",
      type: "text"
    },
    {
      id: 7,
      sender: "nurse",
      content: "Perfect choice! The antioxidants in berries are great for your overall health. I'll check in with you again this afternoon to see how you're doing.",
      timestamp: "9:30 AM",
      type: "text"
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "patient", // Simulating patient sending
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Simulate nurse typing response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: messages.length + 2,
          sender: "nurse",
          content: "Thank you for the update! I've noted this in your health record. Keep up the great work!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "text"
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder-nurse.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary-glow text-white">
                    NJ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Nurse Johnson</h1>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                    <span className="text-sm text-secondary">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col h-[calc(100vh-200px)]">
          {/* Chat Header Info */}
          <Card className="mb-4 shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Sarah Chen</h3>
                    <p className="text-sm text-muted-foreground">Patient ID: #PC-2024-001</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-secondary">
                    <Stethoscope className="w-3 h-3 mr-1" />
                    Stable
                  </Badge>
                  <Badge variant="outline">
                    Last visit: Yesterday
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages Container */}
          <Card className="flex-1 shadow-lg border-0 bg-gradient-to-br from-card to-muted/30 flex flex-col">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg">Secure Message Thread</CardTitle>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${message.sender === "patient" ? "flex-row-reverse space-x-reverse" : ""}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`${
                        message.sender === "nurse" 
                          ? "bg-gradient-to-br from-secondary to-secondary-glow text-white" 
                          : "bg-gradient-to-br from-primary to-primary-glow text-white"
                      }`}>
                        {message.sender === "nurse" ? "NJ" : "SC"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.sender === "nurse"
                        ? "bg-secondary text-secondary-foreground rounded-bl-sm"
                        : "bg-primary text-primary-foreground rounded-br-sm"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === "nurse" 
                          ? "text-secondary-foreground/70" 
                          : "text-primary-foreground/70"
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end space-x-2 max-w-[70%]">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary-glow text-white">
                        NJ
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="border-t border-border/50 p-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="px-2">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="px-2">
                  <Smile className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  className="px-4"
                  variant="healthcare"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                <span>🔒 End-to-end encrypted • HIPAA compliant</span>
                <span>Press Enter to send</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;