import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { UploadedFile, useUploadThing } from "@/services/upload-service"
import { FileIcon } from "lucide-react";
import { useState } from "react"
import { Button } from "../ui/button";
import { X } from "lucide-react";
// import { FileIcon, X } from "lucide-react"

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: UploadedFile[]) => void;
}

export function FileUploadDialog({ isOpen, onClose, onUploadComplete }: FileUploadDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload, isUploading } = useUploadThing("imageUploader"); // Fixed endpoint name and removed progress

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      const uploadedFiles = await startUpload(files);
      if (uploadedFiles) {
        const attachments: UploadedFile[] = uploadedFiles.map(file => ({
          url: file.url,
          name: file.name,
          size: file.size,
          type: file.type,
          thumbnailUrl: file.url // Changed to use url since thumbnailUrl doesn't exist
        }));
        onUploadComplete(attachments);
        onClose();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              </div>
            </label>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {isUploading && <Progress value={null} />} {/* Changed to use indeterminate progress */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0 || isUploading}>
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 