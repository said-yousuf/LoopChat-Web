import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ReactNode } from 'react'


interface EmojiPickerProps {
  onEmojiSelect: (emoji: { native: string }) => void;
  children: ReactNode;
}

export function EmojiPicker({ onEmojiSelect, children }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="end">
        <Picker 
          data={data} 
          onEmojiSelect={onEmojiSelect}
          theme="light"
        />
      </PopoverContent>
    </Popover>
  )
} 