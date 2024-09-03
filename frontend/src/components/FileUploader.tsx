import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, FileIcon } from "lucide-react";
import { BACKEND_URL } from "../../config";
import { useToast } from "@/hooks/use-toast";

export interface UploaderProps {
  onUploadSuccess: (success: boolean) => void;
}

export default function FileUploader({onUploadSuccess}:UploaderProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newFiles = Array.from(event.target.files || []);
  const validFiles = newFiles.filter(
    (file) =>
      (file.type === "image/png" || file.type === "application/pdf") &&
      files.length + newFiles.length <= 3
  );
  setFiles((prevFiles) => [...prevFiles, ...validFiles]);
};

const removeFile = (index: number) => {
  setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
};

const openFileDialog = () => {
  fileInputRef.current?.click();
};

const uploadFiles = async () => {
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status === 200) {
          onUploadSuccess(true); 
          toast({
            title: "File uploaded successfully",
          })
        }
      console.log(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      toast({
        title:"Error Occured , Please Try Again",
        variant: "destructive",
      })
      onUploadSuccess(false);
    }
  }
};

return (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 2: Upload Files</h2>
      <p className="text-muted-foreground mb-4">
        Upload up to 3 files (PNG or PDF only)
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
            <p className="text-xs text-muted-foreground">PNG or PDF (MAX. 3 files)</p>
          </div>
          <Input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center space-x-2">
                <FileIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length < 3 && (
        <Button onClick={openFileDialog} className="w-full">
          Add {files.length === 0 ? "Files" : "More Files"}
        </Button>
      )}

      {files.length > 0 && (
        <Button onClick={uploadFiles} className="w-full mt-4">
          Upload Files
        </Button>
      )}
    </div>
  </div>
);
}
