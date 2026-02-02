'use client';
import React, { useEffect, useState } from 'react';

export default function RhodesMontage() {
  const [mounted, setMounted] = useState(false);

  // 避免服务端渲染时的水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none font-sans">
      {/* 1. 全局背景底纹：极淡的科技网格 */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 2. 核心装饰：巨大的旋转线框圆环 (模拟图片中的月球/圆环) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] border border-blue-600/10 rounded-full animate-spin-slow opacity-20 pointer-events-none md:w-[60vw] md:h-[60vw]">
        <div className="absolute inset-4 border border-blue-600/10 rounded-full border-dashed" />
        <div className="absolute inset-20 border border-blue-600/5 rounded-full" />
      </div>

      {/* 3. 左上角：标题与故障文字 */}
      <div className="absolute top-4 left-4 md:top-10 md:left-10 z-10">
        <div className="flex flex-col items-start gap-1">
          <div className="h-1 w-12 bg-blue-600 mb-2"></div>
          <h1 className="text-2xl font-bold tracking-tighter text-zinc-900 uppercase italic leading-none opacity-80">
            Memory<span className="text-blue-600">_</span>Folds
          </h1>
          <p className="text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase glitch-text" data-text="THE MONNATAGE PROJECT">
            The Montage Project
          </p>
        </div>
      </div>

      {/* 4. 右上角：数据状态条 (仅桌面端显示复杂版) */}
      <div className="absolute top-10 right-10 hidden md:flex flex-col items-end gap-2 opacity-60">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-blue-600 animate-pulse"></div>
          <div className="w-16 h-2 bg-zinc-200">
            <div className="h-full bg-blue-600 w-2/3"></div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-400">
          SYS.Ver 1.0.4 // <span className="text-blue-500">CONNECTED</span>
        </div>
        {/* 装饰性的波形图模拟 */}
        <div className="flex items-end gap-[2px] h-8">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-blue-600/30" 
              style={{ 
                height: `${Math.random() * 100}%`,
                animation: `equalizer 1s ease-in-out infinite ${i * 0.1}s`
              }} 
            />
          ))}
        </div>
      </div>

      {/* 5. 底部：时间轴刻度 (模拟图片下方的剪辑轴) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-blue-600/20 bg-gradient-to-t from-white/80 to-transparent flex items-end justify-between px-4 pb-2 md:px-10">
        <div className="text-[10px] text-blue-600/60 font-mono mb-1 hidden md:block">
          SEQ_00:01:44:20
        </div>
        {/* 刻度线 */}
        <div className="flex-1 flex justify-center items-end gap-1 md:gap-4 h-4 mx-4 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`w-[1px] bg-zinc-800 ${i % 5 === 0 ? 'h-full' : 'h-1/2'}`} />
          ))}
        </div>
        <div className="text-[10px] text-zinc-400 font-mono mb-1 hidden md:block">
          REC ●
        </div>
      </div>

      {/* 6. 随机散落的装饰块 (模拟拼贴感) */}
      {/* 蓝色色块 */}
      <div className="absolute top-[20%] right-0 w-2 h-16 bg-blue-600 hidden md:block" />
      <div className="absolute bottom-[30%] left-0 w-16 h-24 border-l-2 border-blue-600 opacity-40 hidden md:block" />
      
      {/* 移动端专用边框装饰 */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-600 md:hidden opacity-50 m-2" />
      <div className="absolute bottom-16 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-600 md:hidden opacity-50 m-2" />

      {/* 样式注入 */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes equalizer {
          0%, 100% { height: 20%; opacity: 0.3; }
          50% { height: 100%; opacity: 0.8; }
        }
        .glitch-text {
          position: relative;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fafafa; /* 与背景色一致 */
        }
        .glitch-text::before {
          left: 1px;
          text-shadow: -1px 0 red;
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
          clip-path: inset(0 0 0 0);
        }
        .glitch-text::after {
          left: -1px;
          text-shadow: -1px 0 blue;
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
          clip-path: inset(0 0 0 0);
        }
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); }
          20% { clip-path: inset(60% 0 10% 0); }
          40% { clip-path: inset(40% 0 50% 0); }
          60% { clip-path: inset(80% 0 5% 0); }
          80% { clip-path: inset(10% 0 60% 0); }
          100% { clip-path: inset(30% 0 30% 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); }
          20% { clip-path: inset(30% 0 20% 0); }
          40% { clip-path: inset(70% 0 10% 0); }
          60% { clip-path: inset(20% 0 50% 0); }
          80% { clip-path: inset(50% 0 30% 0); }
          100% { clip-path: inset(5% 0 80% 0); }
        }
      `}</style>
    </div>
  );
}
