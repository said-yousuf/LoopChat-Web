import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Smile } from "lucide-react"

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡']

interface MessageReactionsProps {
  reactions?: Record<string, string[]>
  onReact: (emoji: string) => void
}

export function MessageReactions({ reactions = {}, onReact }: MessageReactionsProps) {
  return (
    <div className="flex items-center gap-1">
      {Object.entries(reactions).map(([emoji, users]) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => onReact(emoji)}
        >
          {emoji} {users.length}
        </Button>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex gap-1">
            {REACTIONS.map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onReact(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 