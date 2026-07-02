import React, { useRef } from "react";
import { Button } from "./Button";

interface FileUploadProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ accept, onFileSelect, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = "";
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <Button type="button" variant="secondary" onClick={handleClick} isLoading={isLoading}>
        Choose File
      </Button>
    </div>
  );
};
