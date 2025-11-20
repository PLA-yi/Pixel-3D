import React, { useRef, useState } from 'react';
import { AppStatus } from '../types';

interface ResultViewerProps {
  status: AppStatus;
  generatedImageUrl: string | null;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ status, generatedImageUrl }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('');

  // 3D Tilt Effect Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !generatedImageUrl) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation degrees
    const maxRotation = 15;
    
    const rotateX = ((y - centerY) / centerY) * -maxRotation; // Invert Y for natural tilt
    const rotateY = ((x - centerX) / centerX) * maxRotation;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  if (status === AppStatus.IDLE) {
    return (
      <div className="w-full aspect-[4/3] bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
        <div className="text-center p-8 max-w-xs">
          <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium text-sm">
            生成的 3D 像素小人将显示在这里<br/>
            <span className="text-xs mt-1 block opacity-70">支持鼠标悬停 3D 旋转查看</span>
          </p>
        </div>
      </div>
    );
  }

  if (status === AppStatus.PROCESSING) {
    return (
      <div className="w-full aspect-[4/3] bg-slate-900 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
        {/* Animated Grid Background Effect */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', 
               backgroundSize: '24px 24px',
               transform: 'perspective(500px) rotateX(60deg) translateY(0px) translateZ(-100px)',
               transformOrigin: 'center top',
               animation: 'gridMove 3s linear infinite'
             }}>
        </div>
        <style>{`
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 0 24px; }
          }
        `}</style>
        
        <div className="z-10 text-center relative">
          <div className="inline-block animate-bounce mb-4">
             <div className="w-16 h-16 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/50 flex items-center justify-center ring-4 ring-indigo-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
             </div>
          </div>
          <h3 className="text-white text-lg font-bold tracking-wide">正在构建 3D 模型...</h3>
          <p className="text-indigo-300 text-sm mt-2 font-mono">Processing voxels...</p>
        </div>
      </div>
    );
  }

  if (status === AppStatus.ERROR) {
    return (
      <div className="w-full aspect-[4/3] bg-red-50 rounded-2xl flex items-center justify-center border border-red-200">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium">生成失败，请重试</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-in">
      <div 
        className="relative w-full aspect-[4/3] perspective-container" 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '1000px' }}
      >
        <div 
          ref={cardRef}
          className="w-full h-full rounded-2xl shadow-2xl bg-white transition-transform duration-100 ease-out transform-style-3d overflow-hidden border border-slate-100 cursor-move"
          style={{ 
            transform: transformStyle || 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            boxShadow: transformStyle 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}
        >
          {generatedImageUrl && (
            <img 
              src={generatedImageUrl} 
              alt="Generated 3D Pixel Character" 
              className="w-full h-full object-contain p-4 bg-white" // object-contain to show full character on white bg
              draggable={false}
            />
          )}
          
          {/* Interactive Hint */}
          <div className={`absolute bottom-4 left-0 right-0 text-center transition-opacity duration-500 ${transformStyle ? 'opacity-0' : 'opacity-60'}`}>
            <span className="text-xs font-medium bg-black/10 px-3 py-1 rounded-full text-slate-500">
              🖱️ 移动鼠标旋转视角
            </span>
          </div>
        </div>
      </div>
      
      {generatedImageUrl && (
        <a 
          href={generatedImageUrl} 
          download="pixel-persona-3d.png"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-center transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载 3D 像素图
        </a>
      )}
    </div>
  );
};