'use client';

import { useState, useEffect, useRef } from 'react';
import { getDeviceId } from '@/utils/device';
import { supabase } from '@/utils/supabase';

// ==================== 🎨 主题配置 ====================
const THEMES: Record<string, any> = {
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
    highlight: 'bg-red-900/30 text-red-400 border-l-4 border-red-500'
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
    highlight: 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
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
    highlight: 'bg-[#d3c6a6]/40 text-[#5b4636] font-bold border-l-4 border-[#8b5e3c]'
  }
};

// ==================== 📦 图标组件 ====================
const IconMenu = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const IconX = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconChevronLeft = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconLibrary = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const IconWarning = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconPlay = ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconPause = ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconSpeed = ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
// 👇👇👇 新增这两个图标 👇👇👇
const IconEye = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IconEyeOff = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

// ==================== 🎯 主组件 ====================
export default function Home() {
  const [view, setView] = useState<'HOME' | 'BOOKSHELF' | 'READ' | 'LOGIN_MODAL'>('HOME');
  const [themeMode, setThemeMode] = useState('light');
  const t = THEMES[themeMode];

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [bookData, setBookData] = useState<any>(null);
  const [myBooks, setMyBooks] = useState<any[]>([]);

  const [showMenu, setShowMenu] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [authForm, setAuthForm] = useState({
    username: '',
    password: '',
    mode: 'login' as 'login' | 'register'
  });
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [registeredCredentials, setRegisteredCredentials] = useState({ username: '', password: '' });
  // 👇👇👇 新增这个状态 👇👇👇
  const [showPassword, setShowPassword] = useState(false);
  // ==================== 📜 自动滚动逻辑 (新增) ====================
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(3); // 1-10, 默认为3

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoScroll && iframeRef.current && iframeRef.current.contentWindow) {
      const win = iframeRef.current.contentWindow;
      // 速度算法：数值越大，间隔越短 (滚得越快)
      // 1级 = 50ms滚1px, 10级 = 5ms滚1px
      const delay = Math.max(5, 55 - (scrollSpeed * 5));

      interval = setInterval(() => {
        // 检测是否到底
        if (win.scrollY + win.innerHeight >= win.document.body.scrollHeight - 2) {
          // 可选：到底后自动翻页，这里先设为停止
          setAutoScroll(false);
        } else {
          win.scrollBy(0, 1);
        }
      }, delay);
    }
    return () => clearInterval(interval);
  }, [autoScroll, scrollSpeed, view]); // view 变化时也要重置

  // 翻页时停止自动滚动
  useEffect(() => {
    setAutoScroll(false);
  }, [bookData?.currentSlug]);


  // ==================== 🚀 初始化 ====================
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    handleResize();

    if (window.innerWidth >= 768) setShowMenu(true);
    else setShowMenu(false);

    window.addEventListener('resize', handleResize);

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        fetchBookshelf(data.user.id);
      }
    });

    const savedCode = localStorage.getItem('my_book_code');
    if (savedCode) setInputCode(savedCode);

    const savedTheme = localStorage.getItem('novel_theme');
    if (savedTheme && THEMES[savedTheme]) setThemeMode(savedTheme);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ==================== 🎨 主题切换 ====================
  const switchTheme = (mode: string) => {
    setThemeMode(mode);
    localStorage.setItem('novel_theme', mode);
  };

  // ==================== 📚 获取书架 ====================
  const fetchBookshelf = async (userId: string) => {
    try {
      const res = await fetch('/api/bookshelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) setMyBooks(data.books || []);
    } catch (e) {
      console.error('获取书架失败', e);
    }
  };

  // ==================== 📖 核心：加载章节 ====================
  const loadChapter = async (code: string, targetSlug?: string) => {
    if (!code.trim()) {
      setMsg('请输入激活码');
      return;
    }

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
        setMsg(data.error || '加载失败，请检查激活码');
      }
    } catch (e) {
      setMsg('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // ==================== 🏠 首页登录认证 ====================
  const handleHomeLogin = async () => {
    const { username, password } = authForm;

    if (!username.trim() || !password.trim()) {
      setMsg('请填写账号和密码');
      return;
    }

    setLoading(true);

    try {
      const email = `${username}@medea.local`;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMsg('登录失败：' + error.message);
      } else if (data.user) {
        setUser(data.user);
        await fetchBookshelf(data.user.id);

        // 500ms 后自动跳转书架（静默）
        setTimeout(() => {
          setView('BOOKSHELF');
        }, 500);
      }
    } catch (e) {
      setMsg('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  // ==================== 🏠 首页注册认证 ====================
  const handleHomeRegister = async () => {
    const { username, password } = authForm;

    if (!username.trim() || !password.trim()) {
      setMsg('请填写账号和密码');
      return;
    }

    setLoading(true);

    try {
      const email = `${username}@medea.local`;
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMsg('注册失败：' + error.message);
      } else if (data.user) {
        setUser(data.user);

        // 🔥 保存注册信息并显示提醒弹窗
        setRegisteredCredentials({ username, password });
        setShowRegisterSuccess(true);
        setMsg(''); // 清空错误信息

        await fetchBookshelf(data.user.id);

        // ⚠️ 移除这段代码，改为在确认弹窗后执行
        // if (inputCode && bookData) {
        //   await loadChapter(inputCode, bookData.currentSlug);
        // }
      }
    } catch (e) {
      setMsg('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };




  // ==================== 🎨 主题切换器组件 ====================
  const ThemeSwitcher = ({ className }: { className?: string }) => (
    <div className={`flex gap-1.5 p-1 rounded-full border shadow-lg backdrop-blur-md ${t.panel} ${t.border} ${className}`}>
      {Object.values(THEMES).map((theme) => (
        <button
          key={theme.key}
          onClick={() => switchTheme(theme.key)}
          title={theme.name}
          className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-transform ${themeMode === theme.key ? 'scale-110 ring-2 ring-current' : 'opacity-40 hover:opacity-100'
            }`}
          style={{
            backgroundColor: theme.key === 'light' ? '#eee' : theme.key === 'sepia' ? '#f4ecd8' : '#333',
            color: theme.key === 'light' ? '#000' : '#fff'
          }}
        />
      ))}
    </div>
  );

  // ==================== 📖 阅读视图 ====================
  if (view === 'READ' && bookData) {
    const currentIndex = bookData.menu.findIndex((m: any) => m.slug === bookData.currentSlug);
    const prevChapter = bookData.menu[currentIndex - 1];
    const nextChapter = bookData.menu[currentIndex + 1];

    const responsiveIframeCss = `
      html { min-height: 100%; display: flex; justify-content: center; ${t.iframeCss} }
      body { margin: 0; padding: 40px 60px; width: 100%; max-width: 800px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; font-size: 18px; box-sizing: border-box; }
      img { max-width: 100%; height: auto; display: block; margin: 20px auto; }
      @media (max-width: 768px) { body { padding: 20px 16px; font-size: 17px; } }
    `;

    return (
      <div className={`flex h-[100dvh] overflow-hidden font-sans ${t.bg} ${t.fg}`}>
        {isMobile && showMenu && (
          <div className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm" onClick={() => setShowMenu(false)} />
        )}

        {/* ==================== 侧边栏 ==================== */}
        <aside className={`
          flex flex-col h-full border-r ${t.border} ${t.panel}
          transition-all duration-300 ease-in-out z-40 overflow-hidden
          fixed md:relative
          ${isMobile
            ? (showMenu ? 'translate-x-0 w-[80vw]' : '-translate-x-full w-[80vw]')
            : (showMenu ? 'w-80 translate-x-0 opacity-100' : 'w-0 border-none opacity-0')
          }
        `}>
          <div className="w-full md:w-80 flex flex-col h-full min-w-[200px]">
            {/* 书名标题 */}
            <div className={`p-4 border-b ${t.border} flex justify-between items-center h-14`}>
              <h2 className={`font-bold truncate flex-1 pr-2 ${t.accent}`}>{bookData.bookTitle}</h2>
              {isMobile && (
                <button onClick={() => setShowMenu(false)} className="opacity-60 hover:opacity-100">
                  <IconX />
                </button>
              )}
            </div>

            {/* 章节目录 */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              {bookData.menu.map((chapter: any) => (
                <button
                  key={chapter.slug}
                  onClick={() => loadChapter(inputCode, chapter.slug)}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded mb-1 truncate transition-colors ${chapter.slug === bookData.currentSlug
                    ? t.highlight
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                    }`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>

            {/* 底部账号区 */}
            <div className={`p-4 border-t ${t.border} text-xs`}>
              {user ? (
                // 已登录状态
                <div>
                  <div className="opacity-60 mb-2 truncate">
                    当前账号：{user.email.split('@')[0]}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setView('BOOKSHELF')}
                      className={`flex-1 py-1.5 border rounded ${t.border} hover:opacity-80 md:hidden`}
                    >
                      我的书架
                    </button>
                    <button
                      onClick={() => {
                        supabase.auth.signOut();
                        setUser(null);
                        setMyBooks([]);
                      }}
                      className={`px-2 py-1.5 border rounded ${t.border} hover:opacity-80 flex-1 md:flex-none`}
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              ) : (
                // 游客模式 - 空状态或简单提示
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-1 text-yellow-600 dark:text-yellow-500 opacity-80">
                    <IconWarning />
                    <span>游客模式 (记录不保存)</span>
                  </div>
                  <button
                    onClick={() => setView('LOGIN_MODAL')}
                    className={`w-full py-2.5 rounded font-bold border ${t.border} ${t.panel} active:scale-95 transition-transform`}
                  >
                    立即登录 / 注册
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ==================== 主阅读区 ==================== */}
        <div className="flex-1 flex flex-col h-full relative min-w-0">
          {/* 顶部栏 */}
          <header className={`h-14 flex items-center justify-between px-4 border-b ${t.border} ${t.bg} sticky top-0 z-20`}>
            <div className="flex items-center gap-4 overflow-hidden">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1.5 rounded-md transition-colors hover:bg-black/5 active:scale-95 flex-shrink-0 ${!showMenu && !isMobile ? t.accent : ''
                  }`}
                title={showMenu ? '收起目录' : '展开目录'}
              >
                <IconMenu />
              </button>

              <h1 className="text-sm md:text-base font-medium truncate opacity-90">
                {bookData.title}
              </h1>

              {/* 电脑端书架按钮 */}
              {user && (
                <button
                  onClick={() => setView('BOOKSHELF')}
                  className={`hidden md:flex items-center gap-1.5 text-xs px-2 py-1 ml-2 rounded border hover:bg-black/5 transition-all flex-shrink-0 ${t.border} opacity-70 hover:opacity-100`}
                  title="返回我的书架"
                >
                  <IconLibrary />
                  <span>书架</span>
                </button>
              )}
            </div>
            {/* 🆕 游客警告（仅在未登录时显示） */}
            {!user && (
              <div className="hidden md:flex items-center gap-2 text-xs opacity-70 mr-4">
                <IconWarning />
                <span>游客模式，阅读记录不会保存。</span>
                <button
                  onClick={() => setView('LOGIN_MODAL')}
                  className="text-blue-500 underline hover:text-blue-600"
                >
                  登录
                </button>
              </div>
            )}
            <ThemeSwitcher />
          </header>
          {/* 👇👇👇 新增代码开始：手机端游客警告条 👇👇👇 */}
          {isMobile && !user && (
            <div className={`flex-none px-4 py-2 text-xs flex items-center justify-between border-b ${t.border} bg-yellow-500/10`}>
              <div className="flex items-center gap-2 opacity-90 text-yellow-600 dark:text-yellow-500">
                <IconWarning />
                <span>游客模式，进度无法保存</span>
              </div>
              <button
                onClick={() => setView('LOGIN_MODAL')}
                className={`px-3 py-1 rounded border shadow-sm ${t.panel} ${t.border} hover:opacity-80`}
              >
                登录
              </button>
            </div>
          )}
          {/* 👆👆👆 新增代码结束 👆👆👆 */}

          {/* 内容区 */}
          <div className="flex-1 relative w-full h-full">
            {loading && (
              <div className={`absolute inset-0 z-10 flex items-center justify-center ${t.bg} bg-opacity-80`}>
                <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full border-current opacity-50"></div>
              </div>
            )}
            <iframe
              ref={iframeRef} // 👈 新增这一行
              srcDoc={`<style>${responsiveIframeCss}</style>${bookData.html}`}
              className="w-full h-full border-none block"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>

          {/* 底部导航 */}
          <footer className={`flex-none border-t ${t.border} ${t.panel}`}>

            {/* 👇👇👇 这里增加了一个限制宽度的容器，让按钮向中间靠拢 👇👇👇 */}
            <div className="w-full max-w-4xl mx-auto flex justify-between items-center py-2 px-3 md:py-3 md:px-4 gap-2">

              {/* 上一章按钮 */}
              <button
                disabled={!prevChapter}
                onClick={() => prevChapter && loadChapter(inputCode, prevChapter.slug)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border ${t.border} disabled:opacity-30 hover:bg-black/5 transition-all`}
              >
                <IconChevronLeft /> <span className="hidden md:inline">上一章</span>
              </button>

              {/* 自动滚动控制条 */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${t.border} bg-opacity-50`}>
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`${autoScroll ? t.accent : 'opacity-60 hover:opacity-100'} transition-colors`}
                  title={autoScroll ? "停止滚动" : "自动滚动"}
                >
                  {autoScroll ? <IconPause /> : <IconPlay />}
                </button>

                {/* 速度滑块 */}
                <div className="flex items-center gap-1 w-20 md:w-32">
                  <IconSpeed className="opacity-40 w-3 h-3 flex-shrink-0" />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(Number(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-current opacity-80 hover:opacity-100"
                    style={{ accentColor: themeMode === 'dark' ? '#ef4444' : themeMode === 'sepia' ? '#8b5e3c' : '#2563eb' }}
                  />
                </div>
              </div>

              {/* 下一章按钮 */}
              <button
                disabled={!nextChapter}
                onClick={() => nextChapter && loadChapter(inputCode, nextChapter.slug)}
                className={`px-4 md:px-6 py-2 rounded-lg text-sm shadow-md active:scale-95 disabled:opacity-30 transition-all ${t.accentBtn}`}
              >
                <span className="hidden md:inline">下一章</span>
                <span className="md:hidden">下章</span>
              </button>

            </div>
          </footer>
        </div>
      </div>
    );
  }

  // ==================== 📚 书架视图 ====================
  if (view === 'BOOKSHELF') {
    return (
      <main className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-300 ${t.bg} ${t.fg}`}>
        <div className="max-w-6xl mx-auto">
          {/* 顶部栏 */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b pb-6 border-current border-opacity-10">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${t.accent}`}>我的书架</h1>
              <p className="text-xs opacity-50 mt-1">共 {myBooks.length} 本书籍</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setView('HOME')}
                className={`text-xs md:text-sm border ${t.border} px-4 py-2 rounded hover:bg-black/5 transition-all`}
              >
                + 激活新书
              </button>
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  setUser(null);
                  setMyBooks([]);
                  setView('HOME');
                }}
                className={`text-xs md:text-sm text-red-500/80 px-2 py-2 hover:text-red-500 transition-all`}
              >
                退出登录
              </button>
            </div>
            <div className="absolute top-4 right-4 md:static">
              <ThemeSwitcher />
            </div>
          </header>

          {/* 书籍网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {myBooks.map((book: any, idx: number) => (
              <div
                key={idx}
                onClick={() => {
                  setInputCode(book.key_code);
                  loadChapter(book.key_code);
                }}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className={`relative w-full aspect-[2/3] rounded shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden ${t.panel} border ${t.border}`}>
                  {book.novels?.cover_url ? (
                    <img src={book.novels.cover_url} className="w-full h-full object-cover" alt={book.novels.title} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                      <span className="text-4xl">📖</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center w-full px-1">
                  <h3 className="font-medium text-xs md:text-sm truncate opacity-90">
                    {book.novels?.title || '未命名书籍'}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {myBooks.length === 0 && !loading && (
            <div className="text-center py-20 opacity-50 border-2 border-dashed rounded-xl border-current">
              <p className="text-lg mb-2">📚</p>
              <p>书架空空如也</p>
              <p className="text-xs mt-2 opacity-70">去首页激活您的第一本书吧</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // ==================== 🏠 首页视图 ====================
  return (
    <main className={`min-h-[100dvh] flex flex-col items-center justify-center p-6 font-sans transition-colors duration-300 ${t.bg} ${t.fg} relative`}>
      {/* 主题切换器 */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-sm md:max-w-md space-y-10">
        {/* Logo */}
        <div className="text-center">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-[0.2em] ${t.accent} mb-2`}>
            DREAM
          </h1>
          <p className="text-xs uppercase tracking-[0.5em] opacity-50">
            沉浸式阅读器
          </p>
        </div>

        {/* 主功能区 */}
        <div className="space-y-6">
          {/* 激活码输入 */}
          <div className="space-y-3 relative">
            <input
              type="text"
              placeholder="输入激活码"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadChapter(inputCode)}
              className={`w-full border-2 p-4 text-center text-lg outline-none rounded-xl transition-all ${t.input}`}
            />
            <button
              onClick={() => loadChapter(inputCode)}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase shadow-lg active:scale-95 transition-all ${t.accentBtn}`}
            >
              {loading ? '加载中...' : '立即阅读'}
            </button>
          </div>

          {/* 登录入口 */}
          <div className="text-center pt-4">
            {!user ? (
              <button
                onClick={() => setView('LOGIN_MODAL')}
                className="text-xs underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity"
              >
                老用户登录
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm opacity-70">
                  欢迎回来，{user.email.split('@')[0]}
                </p>
                <button
                  onClick={() => setView('BOOKSHELF')}
                  className={`text-sm border px-6 py-2 rounded hover:bg-black/5 transition-all ${t.border}`}
                >
                  进入我的书架
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 错误提示 */}
        {msg && (
          <div className="text-red-500 text-center text-sm animate-pulse bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {msg}
          </div>
        )}
      </div>

      {/* ==================== 登录弹窗 ==================== */}
      {view === 'LOGIN_MODAL' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`border p-8 rounded-2xl w-full max-w-md relative shadow-2xl ${t.panel} ${t.border}`}>
            <button
              onClick={() => {
                setView('HOME');
                setMsg('');
                setShowPassword(false); // 👈 建议加上这一行：关闭弹窗时，把密码重新藏起来
              }}
              className="absolute top-4 right-4 opacity-50 hover:opacity-100"
            >
              <IconX />
            </button>
            <h2 className="text-2xl font-bold mb-8 text-center tracking-widest">
              账号登录
            </h2>
            {/* 🆕 错误提示 */}
            {msg && (
              <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 mb-4">
                {msg}
              </div>
            )}
            <div className="space-y-5">
              <input
                className={`w-full border-2 p-4 rounded-lg outline-none ${t.input}`}
                placeholder="账号"
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleHomeLogin()}
              />
              <div className="relative">
                <input
                  // 注意：这里添加了 pr-12 (padding-right) 防止文字被图标遮挡
                  className={`w-full border-2 p-4 rounded-lg outline-none pr-12 ${t.input}`}
                  // 注意：type 变成了动态的
                  type={showPassword ? "text" : "password"}
                  placeholder="密码"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleHomeLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {/* 🆕 登录/注册双按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={handleHomeLogin}
                  disabled={loading}
                  className={`flex-1 py-4 rounded-lg font-bold shadow-lg transition-all active:scale-95 ${t.accentBtn}`}
                >
                  {loading ? '登录中...' : '登录'}
                </button>
                <button
                  onClick={handleHomeRegister}
                  disabled={loading}
                  className={`flex-1 py-4 rounded-lg font-bold border-2 transition-all active:scale-95 ${t.border} hover:bg-black/5`}
                >
                  {loading ? '注册中...' : '注册'}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs opacity-60">
              <p>提示：登录后可在多设备同步阅读进度</p>
            </div>
          </div>
        </div>
      )}
      {/* ==================== 注册成功提醒弹窗 ==================== */}
      {showRegisterSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className={`border-2 p-8 rounded-2xl w-full max-w-md relative shadow-2xl ${t.panel} ${t.border}`}>
            {/* 警告图标 */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <IconWarning />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-500">
              注册成功！请牢记账号信息
            </h2>

            {/* 账号信息展示 */}
            <div className={`space-y-3 mb-6 p-4 rounded-lg border-2 ${t.border} bg-yellow-500/5`}>
              <div>
                <p className="text-xs opacity-60 mb-1">账号名</p>
                <p className="font-mono text-lg font-bold">{registeredCredentials.username}</p>
              </div>
              <div>
                <p className="text-xs opacity-60 mb-1">密码</p>
                <p className="font-mono text-lg font-bold">{registeredCredentials.password}</p>
              </div>
            </div>

            {/* 重要提示 */}
            <div className="text-sm opacity-80 mb-6 space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">⚠️</span>
                <span>请务必记住您的账号和密码，系统不提供找回功能</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-500 flex-shrink-0">💡</span>
                <span>建议截图保存或手动记录在安全的地方</span>
              </p>
            </div>

            {/* 确认按钮 */}
            <button
              onClick={async () => {
                setShowRegisterSuccess(false);

                // 🔥 如果在阅读页注册，重新加载当前章节（绑定用户）
                if (inputCode && bookData) {
                  await loadChapter(inputCode, bookData.currentSlug);
                } else {
                  // 否则跳转到书架
                  setView('BOOKSHELF');
                }
              }}
              className={`w-full py-4 rounded-lg font-bold shadow-lg transition-all active:scale-95 ${t.accentBtn}`}
            >
              我已记住，进入书架
            </button>

          </div>
        </div>
      )}
    </main>
  );
}

