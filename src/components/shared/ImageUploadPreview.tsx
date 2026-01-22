import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@/core/utils";

interface ImageUploadPreviewProps {
    value?: string;
    onChange: (value: string) => void;
    onFileSelect?: (file: File) => void;
    className?: string;
    aspectRatio?: "square" | "video" | "banner";
}

export function ImageUploadPreview({ value, onChange, onFileSelect, className, aspectRatio = "video" }: ImageUploadPreviewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (onFileSelect) {
                onFileSelect(file);
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const aspectRatioClass = {
        square: "aspect-square",
        video: "aspect-video",
        banner: "aspect-[21/9]",
    }[aspectRatio];

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
                "relative rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-all hover:bg-muted/80 cursor-pointer overflow-hidden group flex items-center justify-center",
                aspectRatioClass,
                className
            )}
        >
            {value ? (
                <>
                    <img src={value} alt="Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10">
                            <Upload className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="destructive" className="rounded-full h-10 w-10" onClick={clearImage}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground transition-colors group-hover:text-primary">
                    <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold">Click to Upload</p>
                        <p className="text-[10px] opacity-70">PNG, JPG or WebP</p>
                    </div>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}
