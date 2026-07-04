import React, { useRef, useState } from "react";
import { Button } from "./Button";

interface FileUploadProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ accept, onFileSelect, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <Button type="button" variant="secondary" onClick={handleClick} isLoading={isLoading}>
        Choose File
      </Button>
      {fileName && <span className="text-sm text-gray-600 truncate max-w-[200px]">{fileName}</span>}
    </div>
  );
};
