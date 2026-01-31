'use client';

import { useState, useEffect } from 'react';
import { getDeviceId } from '@/utils/device';
import { supabase } from '@/utils/supabase';

// --- 🎨 皮肤配置系统 ---
const THEMES: Record<string, any> = {
  dark: {
    name: '暗黑',
    bg: 'bg-black',              // 整体背景
    fg: 'text-gray-300',         // 主要文字
    panel: 'bg-gray-900',        // 卡片/侧边栏背景
    border: 'border-gray-800',   // 边框颜色
    accent: 'text-red-900',      // 强调色(标题)
    accentBtn: 'bg-red-900 hover:bg-red-800 text-white', // 按钮样式
    accentLight: 'text-red-500', // 浅色强调(小字)
    input: 'bg-black border-gray-700 focus:border-red-800', // 输入框
    // Iframe 内部样式 (必须是真实 CSS 颜色值)
    iframeCss: 'background: #000; color: #ccc;',
    highlight: 'bg-red-900/30 text-red-400' // 选中目录项
  },
  light: {
    name: '明亮',
    bg: 'bg-gray-50',
    fg: 'text-gray-800',
    panel: 'bg-white',
    border: 'border-gray-200',
    accent: 'text-blue-700',
    accentBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
    accentLight: 'text-blue-600',
    input: 'bg-white border-gray-300 focus:border-blue-500 text-gray-900',
    iframeCss: 'background: #fff; color: #333;',
    highlight: 'bg-blue-100 text-blue-700'
  },
  sepia: {
    name: '羊皮',
    bg: 'bg-[#f4ecd8]', // 羊皮纸色
    fg: 'text-[#5b4636]', // 深褐色文字
    panel: 'bg-[#e9e0c9]',
    border: 'border-[#d3c6a6]',
    accent: 'text-[#8b5e3c]',
    accentBtn: 'bg-[#8b5e3c] hover:bg-[#6d4a2f] text-[#f4ecd8]',
    accentLight: 'text-[#8b5e3c]',
    input: 'bg-[#f4ecd8] border-[#d3c6a6] focus:border-[#8b5e3c] text-[#5b4636]',
    iframeCss: 'background: #f4ecd8; color: #5b4636;',
    highlight: 'bg-[#d3c6a6]/50 text-[#5b4636] font-bold'
  }
};

export default function Home() {
  // --- 状态管理 ---
  const [view, setView] = useState<'HOME' | 'BOOKSHELF' | 'READ'>('HOME');
  const [themeMode, setThemeMode] = useState('dark'); // 当前皮肤 key

  // 简化的当前皮肤对象，方便调用
  const t = THEMES[themeMode];

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [inputCode, setInputCode] = useState('');

  const [bookData, setBookData] = useState<any>(null);
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authForm, setAuthForm] = useState({ user: '', pass: '', mode: 'SIGNUP' as 'SIGNUP' | 'SIGNIN' });

  // --- 初始化 ---
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        fetchBookshelf(data.user.id);
      }
    });

    // 读取本地存储
    const savedCode = localStorage.getItem('my_book_code');
    if (savedCode) setInputCode(savedCode);

    // 读取皮肤设置
    const savedTheme = localStorage.getItem('novel_theme');
    if (savedTheme && THEMES[savedTheme]) setThemeMode(savedTheme);
  }, []);

  // --- 切换皮肤函数 ---
  const switchTheme = (mode: string) => {
    setThemeMode(mode);
    localStorage.setItem('novel_theme', mode);
  };

  const fetchBookshelf = async (userId: string) => {
    const res = await fetch('/api/bookshelf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (res.ok) setMyBooks(data.books || []);
  };

  const loadChapter = async (code: string, targetSlug?: string) => {
    if (!code) return;
    setLoading(true);
    setMsg('');

    try {
      const deviceId = getDeviceId();
      const userId = user?.id;

      const res = await fetch('/api/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, deviceId, userId, targetSlug }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookData(data);
        setView('READ');
        localStorage.setItem('my_book_code', code);
        if (window.innerWidth < 768) setShowMenu(false);
        if (userId) fetchBookshelf(userId);
      } else {
        setMsg(data.error);
      }
    } catch (e) {
      setMsg('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleSideAuth = async () => {
    if (!authForm.user || !authForm.pass) return alert('请填写账号密码');
    setLoading(true);
    const email = `${authForm.user}@medea.local`;

    let res;
    if (authForm.mode === 'SIGNUP') {
      res = await supabase.auth.signUp({ email, password: authForm.pass });
    } else {
      res = await supabase.auth.signInWithPassword({ email, password: authForm.pass });
    }

    if (res.error) {
      alert(res.error.message);
    } else if (res.data.user) {
      setUser(res.data.user);
      alert('登录/注册成功');
      if (inputCode) await loadChapter(inputCode, bookData?.currentSlug);
      fetchBookshelf(res.data.user.id);
    }
    setLoading(false);
  };

  // --- 悬浮的皮肤切换器 (在所有界面可见) ---
  const ThemeSwitcher = () => (
    <div className={`fixed top-4 right-4 z-50 flex gap-2 p-1 rounded-full border shadow-xl backdrop-blur-md ${t.panel} ${t.border}`}>
      {Object.keys(THEMES).map((key) => (
        <button
          key={key}
          onClick={() => switchTheme(key)}
          className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center transition-all ${themeMode === key ? 'ring-2 ring-offset-1 ring-offset-transparent ring-current scale-110 font-bold' : 'opacity-50 hover:opacity-100'
            }`}
          style={{ backgroundColor: key === 'light' ? '#eee' : key === 'sepia' ? '#f4ecd8' : '#333', color: key === 'light' ? '#000' : '#fff' }}
          title={THEMES[key].name}
        >
          {key[0].toUpperCase()}
        </button>
      ))}
    </div>
  );

  // ================= 视图: 阅读模式 =================
  if (view === 'READ' && bookData) {
    const currentIndex = bookData.menu.findIndex((m: any) => m.slug === bookData.currentSlug);
    const prevChapter = bookData.menu[currentIndex - 1];
    const nextChapter = bookData.menu[currentIndex + 1];

    return (
      <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${t.bg} ${t.fg}`}>
        <ThemeSwitcher />

        {/* 左侧目录栏 (已修复遮挡问题) */}
        <div className={`${showMenu ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} overflow-hidden transition-all duration-300 ${t.panel} border-r ${t.border} flex flex-col fixed md:relative z-20 h-full`}>
          <div className={`p-4 border-b ${t.border} ${t.panel} sticky top-0`}>
            <h2 className={`${t.accent} font-bold text-lg truncate`}>{bookData.bookTitle}</h2>
            {/* 用户状态小卡片 */}
            {user ? (
              <div className={`mt-2 p-2 rounded border ${t.border} bg-opacity-50`}>
                <div className="text-xs opacity-70">账号: {user.email.split('@')[0]}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setView('BOOKSHELF')} className={`text-xs px-2 py-1 rounded border ${t.border} hover:opacity-80`}>书架</button>
                  <button onClick={() => { supabase.auth.signOut(); setUser(null); setView('HOME'); }} className={`text-xs px-2 py-1 rounded border ${t.border} hover:opacity-80`}>注销</button>
                </div>
              </div>
            ) : (
              <div className={`mt-2 p-3 rounded border ${t.border} bg-opacity-20`}>
                <p className={`text-xs font-bold mb-2 ${t.accentLight}`}>⚠️ 游客模式 (未绑定)</p>
                <div className="space-y-2">
                  <input className={`w-full text-xs p-1 px-2 rounded outline-none ${t.input}`}
                    placeholder="用户名" value={authForm.user} onChange={e => setAuthForm({ ...authForm, user: e.target.value })} />
                  <input className={`w-full text-xs p-1 px-2 rounded outline-none ${t.input}`}
                    type="password" placeholder="密码" value={authForm.pass} onChange={e => setAuthForm({ ...authForm, pass: e.target.value })} />
                  <button onClick={handleSideAuth} disabled={loading} className={`w-full text-xs py-1 rounded ${t.accentBtn}`}>
                    {loading ? '...' : (authForm.mode === 'SIGNUP' ? '注册并绑定' : '登录并绑定')}
                  </button>
                  <div className="text-center text-[10px] opacity-60 cursor-pointer underline" onClick={() => setAuthForm({ ...authForm, mode: authForm.mode === 'SIGNUP' ? 'SIGNIN' : 'SIGNUP' })}>
                    {authForm.mode === 'SIGNUP' ? '已有账号? 登录' : '去注册'}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="text-xs opacity-50 px-2 py-1">目录</div>
            {bookData.menu.map((chapter: any) => (
              <button key={chapter.slug} onClick={() => loadChapter(inputCode, chapter.slug)}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${chapter.slug === bookData.currentSlug ? t.highlight : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                {chapter.title}
              </button>
            ))}
          </div>
        </div>

        {/* 右侧阅读区 */}
        <div className="flex-1 flex flex-col h-full relative">
          <div className={`h-12 border-b ${t.border} flex items-center px-4 backdrop-blur sticky top-0 z-10 ${t.bg} bg-opacity-80`}>
            <button onClick={() => setShowMenu(!showMenu)} className="mr-4 opacity-60 hover:opacity-100">
              {showMenu ? '◀' : '▶'}
            </button>
            <span className="text-sm opacity-70">{bookData.title}</span>
          </div>
          <div className={`flex-1 relative ${t.bg}`}>
            {/* ★★★ Iframe 动态注入 CSS 变量 ★★★ */}
            <iframe srcDoc={`
                <style>
                  html { display: flex; justify-content: center; min-height: 100%; ${t.iframeCss} }
                  body { margin: 0; padding: 40px 20px; width: 100%; max-width: 900px; font-family: "Microsoft YaHei", serif; line-height: 2.0; font-size: 18px; box-sizing: border-box; }
                  img { max-width: 100% !important; height: auto; display: block; margin: 20px auto; }
                </style>
                ${bookData.html}
              `} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
          </div>
          <div className={`h-14 border-t ${t.border} ${t.panel} flex justify-between items-center px-6`}>
            <button disabled={!prevChapter} onClick={() => prevChapter && loadChapter(inputCode, prevChapter.slug)} className={`text-sm px-4 py-2 rounded border ${t.border} disabled:opacity-30 hover:opacity-80`}>上一章</button>
            <button disabled={!nextChapter} onClick={() => nextChapter && loadChapter(inputCode, nextChapter.slug)} className={`text-sm px-4 py-2 rounded ${t.accentBtn} disabled:opacity-30`}>下一章</button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 视图: 书架 =================
  if (view === 'BOOKSHELF') {
    return (
      <main className={`min-h-screen p-8 font-sans transition-colors duration-300 ${t.bg} ${t.fg}`}>
        <ThemeSwitcher />
        <div className="max-w-6xl mx-auto">
          <header className={`flex justify-between items-end mb-12 border-b ${t.border} pb-6`}>
            <div>
              <h1 className={`text-3xl font-bold tracking-widest ${t.accent}`}>我的图书馆</h1>
              <p className="text-xs opacity-60 mt-2 font-mono">账号: {user?.email?.split('@')[0]}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setView('HOME')} className={`text-xs border ${t.border} px-4 py-2 rounded hover:opacity-70 transition-all`}>+ 激活新书</button>
              <button onClick={() => { supabase.auth.signOut(); setUser(null); setMyBooks([]); setView('HOME'); }} className={`text-xs hover:opacity-70 py-2 px-2 transition-colors ${t.accentLight}`}>退出登录</button>
            </div>
          </header>

          {loading && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"><div className={`${t.accentLight} font-bold animate-pulse`}>打开书籍...</div></div>}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
            {myBooks.map((book: any, index: number) => (
              <div key={index} onClick={async () => { setInputCode(book.key_code); await loadChapter(book.key_code); }}
                className="group cursor-pointer flex flex-col items-center">
                <div className={`relative w-full aspect-[2/3] rounded-sm shadow-xl transition-all duration-300 group-hover:-translate-y-2 overflow-hidden ${t.panel} ${t.border} border`}>
                  {book.novels?.cover_url ? (
                    <img src={book.novels.cover_url} alt={book.novels.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center opacity-50"><span className="text-4xl mb-3">📖</span><span className="text-[10px] uppercase">No Cover</span></div>
                  )}
                  {/* 书脊阴影 */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>
                <div className="mt-4 text-center w-full px-1">
                  <h3 className={`font-bold text-sm truncate group-hover:${t.accentLight} transition-colors ${t.fg}`}>{book.novels?.title}</h3>
                </div>
              </div>
            ))}
          </div>
          {myBooks.length === 0 && <div className={`text-center py-32 rounded-xl mt-8 border-2 border-dashed ${t.border} opacity-60`}><p>书架是空的</p><button onClick={() => setView('HOME')} className={`text-sm underline mt-2 ${t.accentLight}`}>去激活一本?</button></div>}
        </div>
      </main>
    );
  }

  // ================= 视图: 首页 =================
  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300 ${t.bg} ${t.fg} relative`}>
      <ThemeSwitcher />

      <div className="w-full max-w-md text-center space-y-8">
        <div>
          <h1 className={`text-4xl font-bold tracking-widest ${t.accent}`} style={{ textShadow: themeMode === 'dark' ? '0 0 20px rgba(139,0,0,0.5)' : 'none' }}>MEDEA'S CURSE</h1>
          <p className="text-xs opacity-60 mt-2">沉浸式阅读系统</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <input type="text" placeholder="在此粘贴激活码" value={inputCode} onChange={(e) => setInputCode(e.target.value)}
              className={`w-full border p-4 text-center text-xl outline-none rounded-lg tracking-widest transition-colors ${t.input} ${t.accentLight} placeholder-opacity-50`} />
            <button onClick={() => loadChapter(inputCode)} disabled={loading} className={`w-full py-3 rounded-lg tracking-[0.2em] transition-all shadow-lg ${t.accentBtn}`}>
              {loading ? '...' : '立即阅读'}
            </button>
          </div>

          <div>
            {!user ? (
              <p className="text-sm opacity-70">
                已有账号？ <button onClick={() => setView('LOGIN_MODAL' as any)} className={`underline underline-offset-4 ml-2 hover:opacity-100 ${t.accentLight}`}>老用户登录</button>
              </p>
            ) : (
              <div className={`p-4 rounded border ${t.panel} ${t.border}`}>
                <p className="text-xs text-green-600 mb-2">欢迎回来: {user.email.split('@')[0]}</p>
                <button onClick={() => setView('BOOKSHELF')} className={`text-sm border px-6 py-2 rounded w-full transition-colors ${t.border} hover:bg-black/5`}>进入书架 →</button>
              </div>
            )}
          </div>
        </div>
        {msg && <div className="text-red-500 text-sm animate-pulse">{msg}</div>}
      </div>

      {(view as any) === 'LOGIN_MODAL' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`border p-8 rounded-lg w-full max-w-sm relative shadow-2xl ${t.panel} ${t.border}`}>
            <button onClick={() => { setView('HOME'); setMsg(''); }} className="absolute top-4 right-4 opacity-50 hover:opacity-100">✕</button>
            <h2 className={`text-xl font-bold mb-6 text-center tracking-widest ${t.fg}`}>账号登录</h2>
            <div className="space-y-4">
              <input className={`w-full border p-3 rounded outline-none ${t.input}`} placeholder="用户名" value={authForm.user} onChange={e => setAuthForm({ ...authForm, user: e.target.value })} />
              <input className={`w-full border p-3 rounded outline-none ${t.input}`} type="password" placeholder="密码" value={authForm.pass} onChange={e => setAuthForm({ ...authForm, pass: e.target.value })} />
              <button onClick={async () => {
                if (!authForm.user || !authForm.pass) return alert('请填写完整');
                setLoading(true);
                const { data, error } = await supabase.auth.signInWithPassword({ email: `${authForm.user}@medea.local`, password: authForm.pass });
                setLoading(false);
                if (error) { alert('登录失败'); } else if (data.user) { setUser(data.user); fetchBookshelf(data.user.id); setTimeout(() => setView('BOOKSHELF'), 500); }
              }} disabled={loading} className={`w-full py-3 rounded font-bold tracking-widest shadow-lg bg-blue-600 text-white hover:bg-blue-700`}>登 录</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}