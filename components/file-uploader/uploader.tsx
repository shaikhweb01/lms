"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadingState, RenderSuccessState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export function Uploader() {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      // Simulate upload progress for demo purposes
      const progressInterval = setInterval(() => {
        setFileState((prev) => {
          const newProgress = Math.min(prev.progress + Math.random() * 20, 90);
          return { ...prev, progress: Math.round(newProgress) };
        });
      }, 200);

      // Simulate upload time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);

      // Simulate successful upload
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 100,
        key: `uploaded-${file.name}`,
      }));
      
      toast.success("File uploaded successfully!");

    } catch (error) {
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false,
      }));
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });
      uploadFile(file);
    }
  }, []);

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      if (fileRejection.some(r => r.errors[0].code === "too-many-files")) {
        toast.error("Too many files selected");
      }
      if (fileRejection.some(r => r.errors[0].code === "file-too-large")) {
        toast.error("File size exceeds the limit (5MB max)");
      }
      if (fileRejection.some(r => r.errors[0].code === "file-invalid-type")) {
        toast.error("Invalid file type. Please select an image file.");
      }
    }
  }

  function handleRemove() {
    setFileState({
      error: false,
      file: null,
      id: null,
      uploading: false,
      progress: 0,
      isDeleting: false,
      fileType: "image",
    });
    toast.success("File removed");
  }

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState 
          progress={fileState.progress} 
          fileName={fileState.file?.name}
        />
      );
    }
    
    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl && fileState.progress === 100) {
      return (
        <RenderSuccessState
          fileName={fileState.file?.name}
          fileUrl={fileState.objectUrl}
          onRemove={handleRemove}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropRejected: rejectedFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-upload cursor-pointer w-full h-80",
        "hover:shadow-upload",
        isDragActive
          ? "border-upload-border-active bg-upload-bg-active border-solid shadow-upload-active"
          : "border-upload-border bg-upload-bg hover:border-upload-border-active",
        fileState.uploading && "pointer-events-none",
        fileState.progress === 100 && "cursor-default"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-0">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}