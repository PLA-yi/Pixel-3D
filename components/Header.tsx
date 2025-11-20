import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PixelPersona 3D</h1>
            <p className="text-xs text-slate-500 font-medium">Gemini AI 驱动的 3D 像素艺术转换</p>
          </div>
        </div>
      </div>
    </header>
  );
};