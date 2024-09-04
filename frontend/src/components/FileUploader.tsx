"use client"

import { useState, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { X, Upload, FileIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BACKEND_URL } from "../../config"


export interface UploaderProps {
  onUploadSuccess: (success: boolean) => void
}

export default function FileUploader({ onUploadSuccess }: UploaderProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || [])
    const validFiles = newFiles.filter(
      (file) =>
        (file.type === "image/png" || file.type === "application/pdf") &&
        file.size <= 3 * 1024 * 1024 && 
        files.length + newFiles.length <= 3
    )

    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file(s) detected",
        description: "Please upload only PNG or PDF files, max 3MB each.",
        variant: "destructive",
      })
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles])
    setUploadProgress((prevProgress) => [...prevProgress, ...validFiles.map(() => 0)])
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setUploadProgress((prevProgress) => prevProgress.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const uploadFiles = async () => {
    setUploading(true)
    let allUploadsSuccessful = true

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await axios.post(`${BACKEND_URL}/v1/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": localStorage.getItem("auth-token")
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
            setUploadProgress((prevProgress) => {
              const newProgress = [...prevProgress]
              newProgress[i] = percentCompleted
              return newProgress
            })
          },
        })

        if (res.status === 200) {
          toast({
            title: `${file.name} uploaded successfully`,
          })
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        toast({
          title: `Error uploading ${file.name}`,
          description: "Please try again",
          variant: "destructive",
        })
        allUploadsSuccessful = false
      }
    }

    setUploading(false)
    onUploadSuccess(allUploadsSuccessful)
    if (allUploadsSuccessful) {
      setFiles([])
      setUploadProgress([])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Step 2: Upload Files</h2>
        <p className="text-muted-foreground mb-4">
          Upload up to 3 files (PNG or PDF only, max 3MB each)
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <Label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/70 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG or PDF (MAX. 3 files, 3MB each)</p>
            </div>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              multiple
              accept=".png,.pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </Label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center space-x-2 flex-grow">
                  <FileIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <div className="w-24 mr-2">
                  <Progress value={uploadProgress[index]} className="w-full" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {files.length < 3 && (
          <Button onClick={openFileDialog} className="w-full" disabled={uploading}>
            Add {files.length === 0 ? "Files" : "More Files"}
          </Button>
        )}

        {files.length > 0 && (
          <Button onClick={uploadFiles} className="w-full mt-4" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        )}
      </div>
    </div>
  )
}