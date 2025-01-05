'use client';

import {
  Archive,
  Filter,
  MessageCircle,
  MoreVertical,
  Search,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';
import { Sidebar, SidebarContent, SidebarHeader } from './ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

import { getUsers } from '@/services/chat';
import { useEffect, useState } from 'react';
import { AppProfile } from '../pages/(profile)/app-profile';
import { ChatItem } from './chat-item';

interface User {
  id: string;
  username: string;
  email: string;
  profile_photo: string | null;
  lastMessage?: {
    content: string;
    createdAt: string;
    isRead: boolean;
    isSender: boolean;
  };
  roomId: string;
}

export function AppSidebar() {
  const [users, setUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter chats based on search query
  const filteredChats = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };

    loadUsers();
  }, []);

  return (
    <Sidebar
      className={`border-r flex flex-col bg-sidebar transition-all duration-300 ease-in-out`}
    >
      <SidebarHeader className="flex flex-col p-3 space-y-3 border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsProfileOpen(true)}
          >
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="User"
              />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </Button>
          {!isSearching && (
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>New chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>New group</DropdownMenuItem>
                  <DropdownMenuItem>Starred messages</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-sidebar-foreground/50" />
          <Input
            placeholder="Search or start new chat"
            className="pl-8 bg-sidebar-accent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-0">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-sidebar-foreground/50">
            <Search className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No chats found</p>
            <p className="text-sm">Try a different search</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 border-b bg-sidebar-accent">
              <Button
                variant="ghost"
                className="text-sidebar-foreground hover:bg-sidebar-accent-hover"
              >
                <Archive className="w-5 h-5 mr-2" />
                Archived
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-sidebar-foreground hover:bg-sidebar-accent-hover"
                    >
                      <Filter className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unread chats filter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ScrollArea className="h-[calc(100vh-10.5rem)]">
              {filteredChats.map((user) => (
                <ChatItem
                  key={user.roomId}
                  id={user.id}
                  name={user.username}
                  lastMessage={user.lastMessage?.content || 'No messages yet'}
                  time={
                    user.lastMessage?.createdAt
                      ? new Date(
                          user.lastMessage.createdAt
                        ).toLocaleTimeString()
                      : ''
                  }
                  unread={user.lastMessage?.isRead ? 0 : 1}
                  status="offline"
                />
              ))}
            </ScrollArea>
          </>
        )}
      </SidebarContent>
      <AppProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </Sidebar>
  );
}
