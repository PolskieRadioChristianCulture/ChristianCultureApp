import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  storageKey: string;
  defaultSrc: string;
  containerClassName?: string;
  onImageChange?: (newSrc: string) => void;
}

export const EditableImage: React.FC<EditableImageProps> = ({ 
  storageKey, 
  defaultSrc, 
  containerClassName,
  className,
  onImageChange,
  ...props 
}) => {
  const [src, setSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const customSrc = localStorage.getItem(`custom_image_${storageKey}`);
    if (customSrc) {
      setSrc(customSrc);
    } else {
      setSrc(defaultSrc);
    }
  }, [storageKey, defaultSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSrc(result);
        try {
          localStorage.setItem(`custom_image_${storageKey}`, result);
        } catch (e) {
          console.error("Local storage quota exceeded, unable to save image:", e);
        }
        if (onImageChange) {
          onImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative group w-full h-full ${containerClassName || ''}`}>
      <img 
        src={src} 
        className={className} 
        onError={(e) => {
          if (!localStorage.getItem(`custom_image_${storageKey}`)) {
              (e.currentTarget as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Image&background=18181b&color=D4AF37";
          }
        }} 
        {...props} 
      />
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        className="absolute top-1 right-1 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-[#C5A059] transition-all z-10 shadow-lg border border-white/20 hover:scale-110"
        title="Zmień grafikę (Zapis automatyczny)"
      >
        <Camera className="w-4 h-4" />
      </button>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />
    </div>
  );
};
