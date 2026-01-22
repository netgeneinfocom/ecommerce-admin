import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

interface ImageUploadMultipleProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  onFilesChange?: (files: File[]) => void;
}

export function ImageUploadMultiple({ label, values, onChange, onFilesChange }: ImageUploadMultipleProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = files.map(file => URL.createObjectURL(file));
      onChange([...values, ...newImages]);
      onFilesChange?.(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-4">
        {values.map((img, idx) => (
          <div
            key={idx}
            className="relative w-24 h-24 border-2 rounded-lg overflow-hidden bg-gray-100 group"
          >
            <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleClick}
          className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mt-1">Add</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />
      </div>
    </div>
  );
}
