'use client';
import React, { useEffect, useState } from 'react';

export default function RhodesMontage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none font-sans">
      {/* =================================================================
         1. 全局通用背景
         ================================================================= */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 核心装饰：旋转圆环 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] md:w-[60vw] md:h-[60vw] border border-blue-600/10 rounded-full animate-spin-slow opacity-20 pointer-events-none">
        <div className="absolute inset-4 border border-blue-600/10 rounded-full border-dashed" />
        <div className="absolute inset-20 border border-blue-600/5 rounded-full" />
      </div>

      {/* =================================================================
         2. 手机端专属布局 (保持优化后的版本)
         ================================================================= */}
      <div className="md:hidden absolute inset-0">
        {/* 右侧大标题背景水印 */}
        <div className="absolute top-[180px] right-0 p-4 opacity-10 z-0 flex flex-col items-end">
          <h1 className="text-5xl font-black text-zinc-900 leading-none tracking-tighter text-right">
            MEM<br/>ORY
          </h1>
          <div className="h-1 w-12 bg-blue-600 mt-2"></div>
        </div>

        {/* 右侧边缘装饰 */}
        <div className="absolute top-[40%] right-2 flex flex-col gap-1 items-end opacity-40">
           <div className="w-[1px] h-12 bg-blue-600"></div>
           <div className="text-[9px] font-mono text-blue-600 rotate-90 origin-right translate-x-2 my-4">
             SYS.MONITOR
           </div>
           <div className="w-[1px] h-8 bg-zinc-400"></div>
           <div className="w-[1px] h-4 bg-zinc-300"></div>
        </div>

        {/* 避让 Header 的角落装饰 */}
        <div className="absolute top-32 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-600/30"></div>
        <div className="absolute bottom-20 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-600/30"></div>
      </div>

      {/* =================================================================
         3. 电脑端专属布局
         ================================================================= */}
      <div className="hidden md:block absolute inset-0">
        {/* 左上角标题区域 */}
        <div className="absolute top-10 left-10 z-10">
          <div className="flex flex-col items-start gap-1">
            <div className="h-1 w-12 bg-blue-600 mb-2"></div>
            <h1 className="text-2xl font-bold tracking-tighter text-zinc-900 uppercase italic leading-none opacity-80">
              Memory<span className="text-blue-600">_</span>Folds
            </h1>
            {/* 这里使用了 glitch-text 类，对应下方还原的 CSS */}
            <p className="text-xs text-zinc-500 tracking-widest uppercase glitch-text" data-text="THE MONNATAGE PROJECT">
              The Montage Project
            </p>
          </div>
        </div>

        {/* 右上角数据块 */}
        <div className="absolute top-10 right-10 flex flex-col items-end gap-2 opacity-60">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 animate-pulse"></div>
            <div className="w-16 h-2 bg-zinc-200">
              <div className="h-full bg-blue-600 w-2/3"></div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-400">
            SYS.Ver 1.0.4 // <span className="text-blue-500">CONNECTED</span>
          </div>
        </div>
      </div>

      {/* =================================================================
         4. 底部时间轴
         ================================================================= */}
      <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 border-t border-blue-600/10 bg-gradient-to-t from-white/90 to-transparent flex items-end justify-between px-4 pb-2 md:px-10 z-0">
        <div className="text-[10px] text-blue-600/60 font-mono mb-1 hidden md:block">
          SEQ_00:01:44:20
        </div>
        <div className="flex-1 flex justify-center items-end gap-2 md:gap-4 h-4 mx-4 opacity-30">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={`w-[1px] bg-zinc-800 ${i % 5 === 0 ? 'h-full' : 'h-1/2'} ${i > 10 ? 'hidden md:block' : ''}`} 
            />
          ))}
        </div>
        <div className="text-[10px] text-zinc-400 font-mono mb-1">
          REC ●
        </div>
      </div>

      {/* =================================================================
         CSS 样式定义 (此处已还原第一版的高级 Glitch 效果)
         ================================================================= */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* 第一版复杂的 Glitch 效果 */
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
          /* 
            注意：这里背景色设为 #fafafa (即 zinc-50)，
            这是为了遮挡住原始文字，实现"切割"效果。
            如果你的背景色变了，这里也要跟着变。
          */
          background: #fafafa; 
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
