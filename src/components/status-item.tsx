import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StatusItemProps {
  name: string
  time: string
}

export function StatusItem({ name, time }: StatusItemProps) {
  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-sidebar-accent cursor-pointer">
      <Avatar>
        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`} />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-sidebar-foreground truncate">{name}</p>
        <p className="text-xs text-sidebar-foreground/70 truncate">{time}</p>
      </div>
    </div>
  )
}

