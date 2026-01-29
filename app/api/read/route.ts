import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    // 1. 获取前端发来的 激活码 和 设备ID
    const { code, deviceId } = await request.json();

    if (!code || !deviceId) {
      return NextResponse.json({ error: '请输入激活码' }, { status: 400 });
    }

    // 2. 在数据库查找这个激活码
    const { data: codeData, error: codeError } = await supabase
      .from('codes')
      .select('*')
      .eq('key_code', code)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json({ error: '激活码无效或不存在' }, { status: 400 });
    }

    // 3. 检查这个设备之前是否已经绑定过
    const { data: binding } = await supabase
      .from('device_bindings')
      .select('*')
      .eq('code', code)
      .eq('device_id', deviceId)
      .single();

    // 4. 如果没绑定过，检查是不是超过 3 台了
    if (!binding) {
      const { count } = await supabase
        .from('device_bindings')
        .select('*', { count: 'exact', head: true })
        .eq('code', code);

      if (count !== null && count >= codeData.max_devices) {
        return NextResponse.json({ error: '该激活码已绑定满 3 台设备，无法在当前设备使用。' }, { status: 403 });
      }

      // 没满，绑定当前设备
      const { error: bindError } = await supabase
        .from('device_bindings')
        .insert({
          code: code,
          device_id: deviceId
        });
      
      if (bindError) {
        return NextResponse.json({ error: '绑定设备失败，请重试' }, { status: 500 });
      }
    }

    // 5. 一切验证通过！去拿小说内容
    // (这里默认拿 'prologue' 章节，以后可以根据参数拿不同章节)
    const { data: chapter } = await supabase
      .from('chapters')
      .select('content')
      .eq('novel_id', codeData.novel_id)
      .eq('slug', 'prologue')
      .single();

    if (!chapter) {
      return NextResponse.json({ error: '未找到章节内容' }, { status: 404 });
    }

    // 6. 返回 HTML 给前端
    return NextResponse.json({ html: chapter.content });

  } catch (e) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}