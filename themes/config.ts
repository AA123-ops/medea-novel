// themes/config.ts

// 1. 引入刚才我们写的那个特殊皮肤组件 (如果没有这个文件，请确保你完成了上一步的 themes/skins/Monnatage.tsx)
import MonnatageSkin from './skins/Monnatage';

// 2. 定义一个标准：规定每个皮肤必须有哪些属性
export interface ThemeConfig {
  key: string;
  name: string;
  bg: string;
  fg: string;
  panel: string;
  border: string;
  accent: string;
  accentBtn: string;
  input: string;
  iframeCss: string;
  highlight: string;
  // 👇 这是一个新属性：允许皮肤带有一个额外的 React 组件（就是那个飘来飘去的装饰层）
  component?: React.ComponentType; 
  // 👇 新增这个属性：定义右上角切换按钮的颜色
  switcherColor: string; 
}

// 3. 这里是你所有的皮肤列表
export const THEMES: Record<string, ThemeConfig> = {
  // --- 搬运过来的旧皮肤 (原样保留) ---
  dark: {
    key: 'dark',
    name: '暗夜',
    bg: 'bg-[#1a1a1a]',
    fg: 'text-gray-300',
    panel: 'bg-[#242424]',
    border: 'border-gray-800',
    accent: 'text-red-500',
    accentBtn: 'bg-red-800 hover:bg-red-700 text-white',
    input: 'bg-[#0f0f0f] border-gray-700 focus:border-red-800 text-gray-300',
    iframeCss: 'background: #1a1a1a; color: #ccc;',
    highlight: 'bg-red-900/30 text-red-400 border-l-4 border-red-500', 
    switcherColor: '#333333' // 暗色模式的按钮颜色
  },
  light: {
    key: 'light',
    name: '明亮',
    bg: 'bg-gray-50',
    fg: 'text-gray-800',
    panel: 'bg-white',
    border: 'border-gray-200',
    accent: 'text-blue-600',
    accentBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
    input: 'bg-white border-gray-300 focus:border-blue-500 text-gray-900',
    iframeCss: 'background: #f9fafb; color: #333;',
    highlight: 'bg-blue-50 text-blue-700 border-l-4 border-blue-500', 
    switcherColor: '#eeeeee' // 明亮模式的按钮颜色
  },
  sepia: {
    key: 'sepia',
    name: '羊皮',
    bg: 'bg-[#f4ecd8]',
    fg: 'text-[#5b4636]',
    panel: 'bg-[#e9e0c9]',
    border: 'border-[#d3c6a6]',
    accent: 'text-[#8b5e3c]',
    accentBtn: 'bg-[#8b5e3c] hover:bg-[#6d4a2f] text-[#f4ecd8]',
    input: 'bg-[#fdf6e3] border-[#d3c6a6] focus:border-[#8b5e3c] text-[#5b4636]',
    iframeCss: 'background: #f4ecd8; color: #5b4636;',
    highlight: 'bg-[#d3c6a6]/40 text-[#5b4636] font-bold border-l-4 border-[#8b5e3c]', 
    switcherColor: '#f4ecd8' // 羊皮纸模式的按钮颜色
  },

  // --- 🔥 新增的“拆痕”皮肤 ---
  monnatage: {
    key: 'monnatage',
    name: '拆痕',
    // 整体配色改为冷灰色/科技感
    bg: 'bg-[#f0f0f0]', 
    fg: 'text-[#1a1a1a]',
    panel: 'bg-white/80 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,51,255,0.2)]', // 玻璃拟态+蓝色硬阴影
    border: 'border-[#0033ff]', // 这种高饱和蓝色是这个皮肤的灵魂
    accent: 'text-[#0033ff]',
    accentBtn: 'bg-[#0033ff] text-white hover:bg-[#0022aa] border border-black font-mono', 
    input: 'bg-white border-2 border-[#0033ff] text-black font-mono focus:shadow-[4px_4px_0px_0px_#0033ff] transition-shadow',
    iframeCss: `
      background: transparent; 
      color: #111111; 
      font-family: "Courier New", monospace; 
      /* 给文字背景加一点网格点缀 */
      background-image: radial-gradient(#0033ff 0.5px, transparent 0.5px);
      background-size: 20px 20px;
    `,
    highlight: 'bg-[#0033ff]/10 text-[#0033ff] border-l-4 border-[#0033ff]',
    
    // 👇 关键：这里把之前写的 Monnatage.tsx 组件挂载进去了
    component: MonnatageSkin , 
    // 👇 这里设置你想要的颜色！比如你的主题色蓝色
    switcherColor: '#0033ff' 
  }
  
};
