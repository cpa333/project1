'use client';

import { useState } from 'react';
import InteractableText from './InteractableText';
import { BookOpen, Languages, Layers } from 'lucide-react';

interface ScriptTabsProps {
  rawText: string;
  translation: string;
  grammarAnalysis: any[] | string;
  savedWords: string[];
}

export default function ScriptTabs({ rawText, translation, grammarAnalysis, savedWords }: ScriptTabsProps) {
  const [activeTab, setActiveTab] = useState<'script' | 'translation' | 'grammar'>('script');

  const btnBase = "flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 transition-colors flex items-center justify-center gap-1.5 sm:gap-2";
  const btnActive = "border-blue-600 text-blue-700 bg-blue-50/40";
  const btnInactive = "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50/50";

  return (
    <div className="flex flex-col w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex w-full border-b border-gray-100 bg-white">
        <button 
          onClick={() => setActiveTab('script')}
          className={`${btnBase} ${activeTab === 'script' ? btnActive : btnInactive}`}
        >
          <BookOpen size={18} />
          <span className="hidden sm:inline">영어 스크립트</span>
          <span className="sm:hidden">스크립트</span>
        </button>
        <button 
          onClick={() => setActiveTab('translation')}
          className={`${btnBase} ${activeTab === 'translation' ? btnActive : btnInactive}`}
        >
          <Languages size={18} />
          <span className="hidden sm:inline">번역 스크립트</span>
          <span className="sm:hidden">번역</span>
        </button>
        <button 
          onClick={() => setActiveTab('grammar')}
          className={`${btnBase} ${activeTab === 'grammar' ? btnActive : btnInactive}`}
        >
          <Layers size={18} />
          <span className="hidden sm:inline">주요 문법 및 구문 해석</span>
          <span className="sm:hidden">문법·구문</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8 min-h-[500px] w-full max-w-full overflow-hidden">
        {activeTab === 'script' && (
          <div className="w-full">
            <InteractableText text={rawText} savedWords={savedWords} />
          </div>
        )}
        
        {activeTab === 'translation' && (
          <div className="leading-relaxed text-[1.15rem] md:text-lg text-gray-800 whitespace-pre-wrap break-words w-full">
            {translation || "오늘의 전문 번역본이 아직 준비되지 않았습니다."}
          </div>
        )}
        
        {activeTab === 'grammar' && (
          <div className="w-full">
            {Array.isArray(grammarAnalysis) ? (
              <div className="flex flex-col gap-5 md:gap-7 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                {grammarAnalysis.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border-b border-indigo-100/60 px-5 md:px-7 py-5 md:py-6">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs md:text-sm font-extrabold px-3 py-1 rounded-full tracking-wide shadow-sm">
                          핵심 포인트 0{idx + 1}
                        </span>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 leading-snug font-serif tracking-tight ml-1">
                        &quot;{item.sentence_or_phrase}&quot;
                      </p>
                    </div>
                    <div className="px-5 md:px-7 py-5 md:py-7 text-gray-700 text-[1.1rem] md:text-[1.2rem] leading-relaxed bg-white">
                      {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="leading-relaxed text-[1.15rem] md:text-lg text-gray-800 whitespace-pre-wrap break-words w-full font-serif md:font-sans">
                {grammarAnalysis || "오늘의 주요 문법 및 구문 해석본이 아직 준비되지 않았습니다."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
