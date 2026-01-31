import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 查询 codes 表，找到绑定了该 userId 的所有记录
    // 同时关联查询 novels 表，把书名拿出来
    const { data, error } = await supabase
      .from('codes')
      .select(`
        key_code,
        novels (
          title,
          description,
          cover_url
        )
      `)
      .eq('bound_user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ books: data });
  } catch (e) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}