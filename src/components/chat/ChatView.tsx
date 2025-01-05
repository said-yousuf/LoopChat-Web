import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatConnection } from '@/hooks/use-chat-connection';
import { UploadedFile } from '@/services/upload-service';
import { useChatStore } from '@/store/chat-store';
import {
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EmojiPicker } from './EmojiPicker';
import { FileUploadDialog } from './FileUploadDialog';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatViewProps {
  chat: {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline';
    lastSeen?: Date;
  };
}

export function ChatView({ chat }: ChatViewProps) {
  const { messages, typingUsers } = useChatStore();
  const chatMessages = messages[chat.id] || [];
  const [newMessage, setNewMessage] = useState('');
  const { isConnected, sendMessage, sendTypingStatus } = useChatConnection(
    chat.id
  );
  const typingTimeout = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, typingUsers]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
        sendTypingStatus(false);
      }
    };
  }, [sendTypingStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    sendTypingStatus(true);
    typingTimeout.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUploadComplete = async (files: UploadedFile[]) => {
    if (files.length === 0) return;

    await sendMessage('', files);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{chat.name}</h2>
            <p className="text-sm text-muted-foreground">
              {chat.status === 'online' ? 'online' : 'offline'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1 py-4">
        <div className="flex flex-col gap-4">
          {chatMessages.map((message) => (
            <MessageBubble
              key={message.id || `${message.id}-${message.createdAt}`}
              message={message}
            />
          ))}
          {typingUsers[chat.id] && (
            <TypingIndicator userName={typingUsers[chat.id].name} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <footer className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Type a message"
            className="flex-1"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <EmojiPicker
            onEmojiSelect={(emoji) => {
              setNewMessage((prev) => prev + emoji.native);
            }}
          >
            <Button variant="ghost" size="icon">
              <Smile className="w-5 h-5" />
            </Button>
          </EmojiPicker>
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>

      <FileUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadComplete={handleFileUploadComplete}
      />
    </div>
  );
}
