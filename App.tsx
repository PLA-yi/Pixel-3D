import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { SeasonSelector } from './components/SeasonSelector';
import { generatePixelCharacter } from './services/geminiService';
import { AppStatus, Season } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season>(Season.SUMMER); // Default to Summer
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setGeneratedImage(null);
    setStatus(AppStatus.IDLE);
    setErrorMsg(null);
  }, []);

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);

    try {
      const resultUrl = await generatePixelCharacter(selectedImage, selectedSeason);
      setGeneratedImage(resultUrl);
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("发生了未知错误");
      }
    }
  };

  const isProcessing = status === AppStatus.PROCESSING;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="inline-block p-2 bg-indigo-50 rounded-2xl mb-4">
              <span className="text-indigo-600 font-bold tracking-wider text-xs uppercase px-2">Voxel Engine v2.5</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              打造您的专属 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">3D 像素人偶</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              上传照片，选择季节主题，即可获得可爱的高品质 3D 像素艺术形象。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Configuration */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-8">
              
              {/* Step 1: Upload */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">1</span>
                     上传照片
                   </h3>
                   {selectedImage && (
                     <button 
                      onClick={() => {
                        setSelectedImage(null);
                        setGeneratedImage(null);
                        setStatus(AppStatus.IDLE);
                      }}
                      disabled={isProcessing}
                      className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 font-medium"
                     >
                       重置
                     </button>
                   )}
                </div>
                <ImageUploader 
                  selectedImage={selectedImage} 
                  onImageSelect={handleImageSelect} 
                  disabled={isProcessing}
                />
              </div>

              {/* Step 2: Season Selection */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  选择风格主题
                </h3>
                <SeasonSelector 
                  selectedSeason={selectedSeason} 
                  onSelect={setSelectedSeason} 
                  disabled={isProcessing} 
                />
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleGenerate}
                  disabled={!selectedImage || isProcessing}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform 
                    flex items-center justify-center gap-2 relative overflow-hidden
                    ${!selectedImage || isProcessing
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-[0.98]'
                    }
                  `}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI 正在建模中...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">✨ 生成 3D 像素人偶</span>
                    </>
                  )}
                </button>
                
                {errorMsg && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errorMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Result */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6 min-h-[500px]">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-slate-800">预览模型</h3>
                 {status === AppStatus.SUCCESS && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      渲染完成
                    </span>
                 )}
              </div>
              <ResultViewer status={status} generatedImageUrl={generatedImage} />
              
              {/* Info Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">关于 3D 效果</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  生成的图像采用了体素(Voxel)艺术风格，模拟 3D 建模效果。支持鼠标悬停在图片上进行 3D 视角微调预览。
                  背景已自动处理为纯白，方便后期使用。
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;