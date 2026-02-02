'use client';

export default function ArknightsSkin() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none font-mono">
      {/* --- 1. 背景层：噪点与微网格 --- */}
      <div className="absolute inset-0 bg-slate-50 opacity-100" />
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
      
      {/* --- 2. 顶部装饰：数据流条 --- */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-700 opacity-80" />
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1 opacity-60 hidden md:flex">
        <div className="h-[2px] w-24 bg-slate-800" />
        <div className="h-[2px] w-12 bg-blue-600" />
        <div className="text-[10px] text-slate-500 tracking-widest">THE MONTAGE PROJECT</div>
      </div>

      {/* --- 3. 左侧装饰：波形与纵向UI (桌面端可见) --- */}
      <div className="absolute left-6 top-1/4 bottom-1/4 w-12 border-r border-slate-300 hidden lg:flex flex-col justify-between items-center py-10">
        {/* 模拟音频波形 */}
        <div className="w-1 h-32 flex flex-col gap-1 items-center justify-center">
           {[...Array(12)].map((_, i) => (
             <div 
               key={i} 
               className="w-full bg-blue-600 animate-pulse"
               style={{ 
                 height: `${Math.random() * 100}%`, 
                 animationDelay: `${i * 0.1}s`,
                 opacity: 0.7 
               }} 
             />
           ))}
        </div>
        <div className="vertical-text text-[10px] text-slate-400 tracking-widest uppercase rotate-180">
          Where the memory folds
        </div>
      </div>

      {/* --- 4. 底部装饰：视频剪辑时间轴 --- */}
      <div className="absolute bottom-0 left-0 w-full h-16 border-t border-slate-300 bg-slate-100/50 backdrop-blur-sm flex items-center px-4 overflow-hidden">
        <div className="flex gap-8 opacity-40 w-full">
          {[0, 10, 20, 30, 40, 50, 60, 80].map((num) => (
            <div key={num} className="relative group flex flex-col items-start min-w-[60px]">
              <span className="text-[9px] text-slate-600 font-bold mb-1">{num}</span>
              <div className="h-2 w-[1px] bg-slate-800" />
              {/* 偶尔出现的蓝色关键帧标记 */}
              {num % 30 === 0 && (
                <div className="absolute top-4 left-0 w-4 h-3 bg-blue-600/80 rounded-sm" />
              )}
            </div>
          ))}
        </div>
        {/* 装饰文字 */}
        <div className="absolute bottom-2 right-4 text-[10px] text-blue-600 font-bold hidden sm:block">
          SideStory &lt; 未祝福的遗蜕 &gt; 即将开放
        </div>
      </div>

      {/* --- 5. 几何浮窗与取景框 (动画) --- */}
      <div className="absolute top-1/3 right-[10%] w-64 h-64 border border-blue-600/20 rounded-full hidden xl:block animate-spin-slow opacity-30">
         <div className="absolute inset-2 border border-slate-400/20 rounded-full border-dashed" />
      </div>

      {/* 这是一个模拟图片中那种“错误/Glitch”效果的装饰块 */}
      <div className="absolute top-[20%] right-0 w-2 h-24 bg-blue-600 mix-blend-multiply opacity-60 hidden md:block" />
      <div className="absolute top-[21%] right-1 w-2 h-12 bg-black opacity-10 hidden md:block" />

      {/* --- 样式定义 --- */}
      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
