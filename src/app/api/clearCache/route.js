import { NextResponse } from 'next/server';
import { cache } from '../getPublicSheetData/route';

export async function POST(request) {
  // 可選：添加一個簡單的身份驗證機制
  const authorization = request.headers.get('authorization');
  if (authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return NextResponse.json({ error: '未授權' }, { status: 401 });
  }

  // 清除快取
  cache.data = null;
  cache.lastFetched = null;

  return NextResponse.json({ message: '快取已清除' }, { status: 200 });
}