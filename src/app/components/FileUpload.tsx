"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface FileUploadProps {
  fileType: "image" | "video";
  onSuccess: (res: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ fileType, onSuccess }) => {
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const toastConfig = {
    position: "top-right" as const,
    autoClose: 3000,
  };

  const authenticator = async () => {
    const response = await fetch("/api/auth/upload-auth");
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) {
      toast.warning("Please select a file", toastConfig);
      return;
    }

    const file = fileInput.files[0];

    try {
      // Get ImageKit auth credentials
      const { signature, expire, token, publicKey } = await authenticator();

      abortControllerRef.current = new AbortController();

      // Upload to ImageKit
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          if (event.total > 0) {
            setProgress((event.loaded / event.total) * 100);
          }
        },
        abortSignal: abortControllerRef.current.signal,
      });

      toast.success(`${fileType} uploaded successfully!`, toastConfig);

      // Pass uploaded file data back to parent
      onSuccess(uploadResponse);

      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      if (error instanceof ImageKitAbortError) {
        toast.error("Upload aborted", toastConfig);
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid request", toastConfig);
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network error", toastConfig);
      } else if (error instanceof ImageKitServerError) {
        toast.error("Server error", toastConfig);
      } else {
        toast.error("Upload failed", toastConfig);
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow space-y-4">
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        ref={fileInputRef}
        className="block w-full text-sm border rounded p-2"
      />
      <button
        type="button"
        onClick={handleUpload}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Upload {fileType}
      </button>
      {progress > 0 && (
        <div>
          Upload progress:
          <progress value={progress} max={100} className="w-full"></progress>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
