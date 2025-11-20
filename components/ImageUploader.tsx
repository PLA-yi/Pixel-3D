import React, { useRef } from 'react';

interface ImageUploaderProps {
  selectedImage: File | null;
  onImageSelect: (file: File) => void;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ selectedImage, onImageSelect, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const previewUrl = selectedImage ? URL.createObjectURL(selectedImage) : null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div 
        onClick={handleClick}
        className={`
          relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed 
          flex flex-col items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400 hover:bg-indigo-50'}
          ${selectedImage ? 'border-indigo-500 bg-slate-50' : 'border-slate-300 bg-white'}
        `}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                更换图片
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700">点击上传照片</h3>
            <p className="text-sm text-slate-500 mt-1">支持 JPG, PNG (最大 10MB)</p>
          </div>
        )}
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};