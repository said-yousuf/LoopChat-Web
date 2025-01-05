import { useCallback, useState } from 'react'
import { X, Camera, Edit2, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WhatsAppProfileProps {
    isOpen: boolean
    onClose: () => void
    avatarUrl?: string
    initialName?: string
  }

export function AppProfile({ isOpen, onClose, avatarUrl = "/placeholder.svg", initialName = "John Doe" }: WhatsAppProfileProps) {
  const [name, setName] = useState(initialName)
  const [about, setAbout] = useState("Hey there! I am using WhatsApp.")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [tempName, setTempName] = useState(name)
  const [tempAbout, setTempAbout] = useState(about)
  const [avatar, setAvatar] = useState(avatarUrl)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleNameSave = () => {
    setName(tempName)
    setIsEditingName(false)
  }

  const handleAboutSave = () => {
    setAbout(tempAbout)
    setIsEditingAbout(false)
  }

  const handleNameCancel = () => {
    setTempName(name)
    setIsEditingName(false)
  }

  const handleAboutCancel = () => {
    setTempAbout(about)
    setIsEditingAbout(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative mx-auto w-32 h-32">
            <Avatar className="w-full h-full">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={handleImageUpload}
              />
              <label htmlFor="avatar-upload">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full cursor-pointer"
                  asChild
                >
                  <span>
                    <Camera className="h-4 w-4" />
                  </span>
                </Button>
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <div className="flex items-center space-x-2">
              {isEditingName ? (
                <>
                  <Input 
                    id="name" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={handleNameSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleNameCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Input id="name" value={name} readOnly />
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingName(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            This is not your username or pin. This name will be visible to your WhatsApp contacts.
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <div className="flex items-center space-x-2">
              {isEditingAbout ? (
                <>
                  <Input 
                    id="about" 
                    value={tempAbout}
                    onChange={(e) => setTempAbout(e.target.value)}
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={handleAboutSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleAboutCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Input id="about" value={about} readOnly />
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingAbout(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

