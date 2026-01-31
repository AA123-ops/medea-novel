import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    // 接收参数：code(激活码), deviceId(设备), userId(用户ID, 可选), targetSlug(想看的章节ID, 可选)
    const { code, deviceId, userId, targetSlug } = await request.json();

    if (!code || !deviceId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 1. 查找激活码信息
    const { data: codeData, error: codeError } = await supabase
      .from('codes')
      .select('*, novels(title)') // 同时把书名查出来
      .eq('key_code', code)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json({ error: '激活码无效' }, { status: 400 });
    }

    // --- 账号绑定逻辑 START ---
    // 如果前端传来了 userId，且这个码还没被绑定，就绑上去
    if (userId && !codeData.bound_user_id) {
      await supabase.from('codes').update({ bound_user_id: userId }).eq('key_code', code);
    }
    // 如果这个码已经被别人绑了，且不是当前用户，报错
    if (codeData.bound_user_id && userId && codeData.bound_user_id !== userId) {
      return NextResponse.json({ error: '此激活码已被其他账号绑定' }, { status: 403 });
    }
    // --- 账号绑定逻辑 END ---

    // 2. 检查设备绑定 (逻辑不变)
    const { data: binding } = await supabase
      .from('device_bindings')
      .select('*')
      .eq('code', code)
      .eq('device_id', deviceId)
      .single();

    if (!binding) {
      const { count } = await supabase
        .from('device_bindings')
        .select('*', { count: 'exact', head: true })
        .eq('code', code);

      if (count !== null && count >= codeData.max_devices) {
        return NextResponse.json({ error: '设备数已满 (Max 3)' }, { status: 403 });
      }

      await supabase.from('device_bindings').insert({ code: code, device_id: deviceId });
    }

    // 3. 获取目录列表 (只查ID和标题，按ID排序)
    const { data: menu } = await supabase
      .from('chapters')
      .select('slug, title')
      .eq('novel_id', codeData.novel_id)
      .order('id', { ascending: true });

    // 4. 确定要看哪一章
    // 如果前端没传 targetSlug，默认看第一章
    const currentSlug = targetSlug || (menu && menu.length > 0 ? menu[0].slug : null);

    if (!currentSlug) {
      return NextResponse.json({ error: '这本书还没有章节' }, { status: 404 });
    }

    // 5. 获取具体章节内容
    const { data: chapter } = await supabase
      .from('chapters')
      .select('content, title, slug')
      .eq('novel_id', codeData.novel_id)
      .eq('slug', currentSlug)
      .single();

    if (!chapter) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 });
    }

    // 6. 返回：内容 + 目录 + 书名
    return NextResponse.json({ 
      html: chapter.content,
      title: chapter.title,
      currentSlug: chapter.slug,
      bookTitle: codeData.novels?.title,
      menu: menu // 把目录发给前端
    });

  } catch (e) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}