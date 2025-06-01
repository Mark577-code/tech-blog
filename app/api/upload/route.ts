import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await requireAdmin()
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '需要管理员权限'
      }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({
        success: false,
        error: '没有找到上传的文件'
      }, { status: 400 })
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: '不支持的文件类型。请上传 JPEG、PNG、GIF 或 WebP 格式的图片'
      }, { status: 400 })
    }

    // 检查文件大小 (5MB限制)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: '文件大小不能超过5MB'
      }, { status: 400 })
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // 目录可能已存在，忽略错误
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}-${randomString}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // 将文件转换为Buffer并写入
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    // 返回文件URL
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        filename: fileName,
        size: file.size,
        type: file.type
      },
      message: '文件上传成功'
    })

  } catch (error) {
    console.error('文件上传错误:', error)
    return NextResponse.json({
      success: false,
      error: '文件上传失败'
    }, { status: 500 })
  }
}

// 获取上传的文件列表（可选功能）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await requireAdmin()
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '需要管理员权限'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: '上传API正常工作'
    })

  } catch (error) {
    console.error('获取上传信息错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取上传信息失败'
    }, { status: 500 })
  }
} 