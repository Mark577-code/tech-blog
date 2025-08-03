import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const usageType = formData.get('usage_type') as string || 'general'

    if (!file) {
      return NextResponse.json(
        { success: false, error: '没有找到上传的文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: '只支持图片文件' },
        { status: 400 }
      )
    }

    // 验证文件大小 (5MB限制)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: '文件大小不能超过5MB' },
        { status: 400 }
      )
    }

    // 获取文件扩展名
    const fileExtension = file.name.split('.').pop() || 'jpg'
    
    // 生成唯一文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    const filename = `${timestamp}-${randomString}.${fileExtension}`

    // 创建上传目录结构
    const uploadDir = join(process.cwd(), 'public', 'uploads', usageType)
    
    // 确保目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 文件路径
    const filePath = join(uploadDir, filename)
    
    // 将文件转换为Buffer并保存
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    // 生成可访问的URL
    const fileUrl = `/uploads/${usageType}/${filename}`

    // 获取图片信息
    const imageInfo = {
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
      uploadedAt: new Date().toISOString()
    }

    console.log('✅ 图片上传成功:', imageInfo)

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      message: '图片上传成功'
    })

  } catch (error) {
    console.error('❌ 图片上传失败:', error)
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