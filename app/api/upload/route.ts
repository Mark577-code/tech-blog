import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { 
        success: false, 
        error: '文件上传功能暂未实现',
        message: '请联系管理员开启文件上传功能'
      },
      { status: 501 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '文件上传失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 