// import { cn } from "@/lib/utils"

interface TypingIndicatorProps {
  userName: string;
}

export function TypingIndicator({ userName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="flex space-x-1">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0.2s]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0.4s]" />
      </div>
      <span className="text-sm text-muted-foreground">{userName} is typing...</span>
    </div>
  )
} 