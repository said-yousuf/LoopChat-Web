import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MessageContextMenu } from './MessageContextMenu';

interface Message {
  id: string;
  content: string;
  contentType: 'TEXT' | 'IMAGE' | 'FILE';
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    profile_photo: string | null;
  };
  isSender: boolean;
}

export function MessageBubble({ message }: { message: any }) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }
  );

  return (
    <MessageContextMenu
      onCopy={() => navigator.clipboard.writeText(message.content)}
      onReply={() => {}}
      onDelete={() => {}}
      canDelete={message.isSender}
    >
      <div
        className={cn(
          'flex gap-2 px-4 group',
          message.isSender ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={message.sender?.profile_photo || undefined} />
          <AvatarFallback>
            {message.sender?.username
              ? message.sender?.username[0].toUpperCase()
              : '?'}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            'max-w-[70%] rounded-lg px-4 py-2',
            message.isSender ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          {!message.isSender && (
            <p className="mb-1 text-xs text-muted-foreground">
              {message.sender?.username}
            </p>
          )}
          <p>{message.message || message.content}</p>
          <div
            className={cn(
              'flex items-center gap-2 text-xs mt-1',
              message.isSender
                ? 'text-primary-foreground/70'
                : 'text-muted-foreground'
            )}
          >
            <span>{formattedTime}</span>
            {message.isSender && (
              <span>{message.isRead ? 'Read' : 'Delivered'}</span>
            )}
          </div>
        </div>
      </div>
    </MessageContextMenu>
  );
}
