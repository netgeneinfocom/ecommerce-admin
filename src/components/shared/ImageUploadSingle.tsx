import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

interface ImageUploadSingleProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  alt?: string;
}

export function ImageUploadSingle({ label, value, onChange, onFileChange, alt = "Uploaded image" }: ImageUploadSingleProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onChange(previewUrl);
      onFileChange?.(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    onFileChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {value ? (
          <div
            onClick={handleClick}
            className="relative w-32 h-32 border-2 rounded-lg overflow-hidden bg-gray-100 cursor-pointer group hover:border-primary transition-colors"
          >
            <img src={value} alt={alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
              <Upload className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-2">Upload</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
