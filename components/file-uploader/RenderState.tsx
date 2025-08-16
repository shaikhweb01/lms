import React from "react";
import { Upload, X, CheckCircle, AlertTriangle, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface RenderEmptyStateProps {
  isDragActive: boolean;
}

export function RenderEmptyState({ isDragActive }: RenderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center transition-upload">
      <div className={`rounded-full p-4 transition-upload ${
        isDragActive 
          ? 'bg-upload-bg-active border-2 border-upload-border-active' 
          : 'bg-upload-bg border-2 border-upload-border'
      }`}>
        <Upload className={`h-8 w-8 transition-upload ${
          isDragActive ? 'text-upload-text-active' : 'text-upload-text'
        }`} />
      </div>
      
      <div className="space-y-2">
        <h3 className={`text-lg font-semibold transition-upload ${
          isDragActive ? 'text-upload-text-active' : 'text-foreground'
        }`}>
          {isDragActive ? 'Drop your file here' : 'Upload your files'}
        </h3>
        <p className={`text-sm transition-upload ${
          isDragActive ? 'text-upload-text-active' : 'text-upload-text'
        }`}>
          Drag and drop your images here, or click to browse
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="secondary" className="text-xs">
          <Image className="h-3 w-3 mr-1" />
          Images only
        </Badge>
        <Badge variant="secondary" className="text-xs">
          Max 5MB
        </Badge>
      </div>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="rounded-full p-4 bg-destructive/10 border-2 border-destructive/20">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-destructive">
          Upload Failed
        </h3>
        <p className="text-sm text-muted-foreground">
          Something went wrong while uploading your file. Please try again.
        </p>
      </div>
      
      <Button variant="outline" size="sm">
        <X className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

interface RenderUploadingStateProps {
  progress: number;
  fileName?: string;
}

export function RenderUploadingState({ progress, fileName }: RenderUploadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="rounded-full p-4 bg-primary/10 border-2 border-primary/20">
        <Upload className="h-8 w-8 text-primary animate-pulse" />
      </div>
      
      <div className="space-y-3 w-full max-w-xs">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            Uploading...
          </h3>
          {fileName && (
            <p className="text-sm text-muted-foreground truncate">
              {fileName}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress}% completed
          </p>
        </div>
      </div>
    </div>
  );
}

interface RenderSuccessStateProps {
  fileName?: string;
  fileUrl?: string;
  onRemove?: () => void;
}

export function RenderSuccessState({ fileName, fileUrl, onRemove }: RenderSuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      {fileUrl && (
        <div className="relative group">
          <div className="rounded-lg overflow-hidden border-2 border-success/20 shadow-lg">
            <img
              src={fileUrl}
              alt="Uploaded file"
              className="h-32 w-32 object-cover"
            />
          </div>
          {onRemove && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <CheckCircle className="h-5 w-5 text-success" />
          <h3 className="text-lg font-semibold text-success">
            Upload Complete
          </h3>
        </div>
        {fileName && (
          <p className="text-sm text-muted-foreground">
            {fileName}
          </p>
        )}
      </div>
      
      <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
        <CheckCircle className="h-3 w-3 mr-1" />
        Ready to use
      </Badge>
    </div>
  );
}