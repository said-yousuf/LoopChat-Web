import { CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface ChatItemProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
}

export function ChatItem({
  id,
  name,
  lastMessage,
  time,
  unread,
  status,
}: ChatItemProps) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center p-3 space-x-4 transition-colors duration-200 cursor-pointer hover:bg-sidebar-accent-hover"
      onClick={() => navigate(`/chat/${id}`)}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/micah/svg?seed=${name}`}
          />
          <AvatarFallback>
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        {status === 'online' && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-2 border-b">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium truncate text-sidebar-foreground">
            {name}
          </p>
          <p className="text-xs text-sidebar-foreground/50 whitespace-nowrap">
            {time}
          </p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-1">
            {unread === 0 && (
              <CheckCheck className="flex-shrink-0 w-4 h-4 text-blue-500" />
            )}
            <p className="text-sm truncate text-sidebar-foreground/70">
              {lastMessage}
            </p>
          </div>
          {unread > 0 && (
            <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 text-xs font-bold text-white rounded-full bg-sidebar-primary">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
