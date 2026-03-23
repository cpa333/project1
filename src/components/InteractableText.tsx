'use client';

import { useState } from 'react';
import { Volume2, X, Loader2 } from 'lucide-react';
import { saveToVocabulary } from '@/app/actions/vocabulary';

interface InteractableTextProps {
  text: string;
  savedWords?: string[];
}

const playAudio = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("현재 브라우저에서는 음성 합성(TTS)을 지원하지 않습니다.");
  }
};

export default function InteractableText({ text, savedWords = [] }: InteractableTextProps) {
  const [localSavedWords, setLocalSavedWords] = useState<Set<string>>(new Set(savedWords));
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [wordData, setWordData] = useState<{ phonetic: string, meaning: string } | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveWord = async () => {
    if (!selectedWord || !wordData) return;
    setIsSaving(true);
    setSaveMessage('');
    try {
      const res = await saveToVocabulary(selectedWord, wordData.phonetic, wordData.meaning);
      if (res.error) {
        setSaveMessage(res.error);
      } else {
        setSaveMessage('✓ 단어장에 성공적으로 저장되었습니다.');
        setLocalSavedWords(prev => {
          const next = new Set(prev);
          next.add(selectedWord);
          return next;
        });
      }
    } catch (e) {
      setSaveMessage('단어 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleWordClick = async (rawWord: string, contextSentence: string) => {
    // 단어 형태소를 파괴하지 않기 위해 중간에 있는 어포스트로피(')나 하이픈은 보존하고, 양 끝의 특수기호(마침표, 쉼표, 따옴표)만 제거합니다.
    const word = rawWord.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').toLowerCase();
    if (!word) return;

    setSaveMessage('');
    setSelectedWord(word);
    setLoading(true);

    try {
      playAudio(word);
      const res = await fetch(`/api/dictionary?word=${encodeURIComponent(word)}&context=${encodeURIComponent(contextSentence)}`);
      if (res.ok) {
        const data = await res.json();
        setWordData({
          phonetic: data.phonetic || `/${word}/`,
          meaning: data.meaning || "검색 결과 없음"
        });
      } else {
        setTimeout(() => {
          setWordData({
            phonetic: `/${word}/`,
            meaning: "서버 연결 지연 중..."
          });
        }, 500);
      }
    } catch (error) {
      console.error("Dictionary lookup failed", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const closePopover = () => {
    setSelectedWord(null);
    setWordData(null);
  };

  const paragraphs = text.split('\n');
  const isAlreadySaved = localSavedWords.has(selectedWord || '');

  return (
    <div className="relative font-serif">
      {paragraphs.map((para, pIdx) => (
        <p key={pIdx} className="mb-6 last:mb-0 leading-[1.75] md:leading-[2.2] text-xl md:text-lg break-words">
          {para.split(' ').map((wordToken, wIdx) => (
            <span key={wIdx}>
              <span
                onClick={() => handleWordClick(wordToken, para)}
                className="cursor-pointer hover:bg-blue-100/70 hover:text-blue-800 rounded transition-all duration-200 px-0.5"
              >
                {wordToken}
              </span>
              {' '}
            </span>
          ))}
        </p>
      ))}

      {selectedWord && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden animate-in fade-in duration-200" 
            onClick={closePopover}
          />
          
          <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-200/50 p-6 pb-10 z-50 animate-in slide-in-from-bottom-full duration-300 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md sm:bg-white/95 sm:backdrop-blur-xl sm:rounded-2xl sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] sm:border sm:pb-6">
            
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{selectedWord}</h3>
                <button 
                  onClick={() => playAudio(selectedWord)} 
                  className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
                  title="Listen Voice"
                >
                  <Volume2 size={26} strokeWidth={2.5}/>
                </button>
              </div>
              <button 
                onClick={closePopover} 
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors active:bg-gray-200"
              >
                <X size={26} />
              </button>
            </div>

            <div className="min-h-[5rem]">
              {loading ? (
                <div className="flex flex-col gap-3 animate-pulse mt-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              ) : wordData ? (
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-lg text-gray-500 font-medium tracking-wide">{wordData.phonetic}</span>
                  <p className="text-xl font-bold text-gray-800 leading-snug whitespace-pre-wrap">{wordData.meaning}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <button 
                onClick={handleSaveWord}
                disabled={isSaving || loading || !wordData || isAlreadySaved}
                className={`w-full min-h-[56px] py-4 font-extrabold text-lg rounded-2xl transition-colors border shadow-sm flex items-center justify-center gap-2 ${
                  isAlreadySaved 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100 active:bg-blue-200'
                }`}
              >
                {isAlreadySaved ? "이미 저장된 단어입니다" : (isSaving ? <Loader2 className="animate-spin" size={24} /> : "내 단어장에 추가하기")}
              </button>
              {saveMessage && (
                <p className={`text-md font-medium text-center mt-2 ${saveMessage.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>
                  {saveMessage}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
