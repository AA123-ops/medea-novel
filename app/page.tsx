'use client';

import { useState, useEffect } from 'react';
import { getDeviceId } from '@/utils/device';

export default function Home() {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 尝试加载小说
  const loadChapter = async (code: string) => {
    if (!code) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const deviceId = getDeviceId();
      
      const res = await fetch('/api/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, deviceId }),
      });

      const data = await res.json();

      if (res.ok) {
        setHtmlContent(data.html);
        localStorage.setItem('my_book_code', code);
      } else {
        setErrorMsg(data.error || '出错了');
      }
    } catch (err) {
      setErrorMsg('网络连接失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCode = localStorage.getItem('my_book_code');
    if (savedCode) {
      setInputCode(savedCode);
      loadChapter(savedCode);
    }
  }, []);

  if (htmlContent) {
    return (
      <div className="w-full h-screen bg-black">
        <iframe 
          srcDoc={htmlContent}
          className="w-full h-full border-none"
          title="Reader"
          sandbox="allow-scripts allow-same-origin" 
        />
        <button 
          onClick={() => {
            setHtmlContent('');
            localStorage.removeItem('my_book_code');
            window.location.reload();
          }}
          className="fixed bottom-4 right-4 text-xs text-gray-500 hover:text-white bg-black/50 px-2 py-1 rounded"
        >
          退出阅读
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-serif text-gray-300">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-[0.2em] text-red-900" style={{ textShadow: '0 0 20px rgba(139,0,0,0.5)' }}>
            MEDEA'S CURSE
          </h1>
          <p className="text-xs text-gray-600 tracking-widest uppercase">The Oath of the Betrayed</p>
        </div>

        <div className="bg-gray-900/50 p-8 border border-red-900/30 rounded-lg backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-900 to-transparent"></div>
          <div className="space-y-6">
            <input 
              type="text" 
              placeholder="输入誓约之码 (TEST-9999)" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full bg-black border border-gray-800 text-center p-3 text-red-500 tracking-widest focus:outline-none focus:border-red-800 transition-colors placeholder-gray-800"
            />
            <button 
              onClick={() => loadChapter(inputCode)}
              disabled={loading}
              className="w-full border border-red-900/50 text-red-700 hover:bg-red-900/20 hover:text-red-500 py-3 px-6 tracking-[0.3em] transition-all duration-500 uppercase text-sm"
            >
              {loading ? 'Verifying...' : 'Unlock Seal'}
            </button>
            {errorMsg && (
              <p className="text-red-500 text-xs mt-4 animate-pulse">{errorMsg}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}