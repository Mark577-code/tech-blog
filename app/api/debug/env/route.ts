import { NextResponse } from 'next/server'

export async function GET() {
  // 注意：这个 API 仅用于调试，请在生产环境中删除
  const envStatus = {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME ? '✅ 已设置' : '❌ 未设置',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ 已设置' : '❌ 未设置',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ 已设置' : '❌ 未设置',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL ? '✅ 在 Vercel 环境' : '❌ 不在 Vercel 环境'
  }

  return NextResponse.json({
    message: '环境变量状态检查',
    environment: envStatus,
    timestamp: new Date().toISOString()
  })
}