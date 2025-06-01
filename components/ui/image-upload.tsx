"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Link, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = "图片", 
  placeholder = "输入图片URL或上传图片",
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('服务器返回的不是JSON格式')
      }

      const result = await response.json()

      if (result.success) {
        onChange(result.data.url)
        toast.success('图片上传成功')
      } else {
        toast.error(result.error || '上传失败')
      }
    } catch (error) {
      console.error('上传错误:', error)
      if (error instanceof Error) {
        toast.error(`上传失败: ${error.message}`)
      } else {
        toast.error('上传失败')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onChange(urlValue.trim())
      setUrlValue('')
      setShowUrlInput(false)
      toast.success('图片URL已设置')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    } else {
      toast.error('请上传图片文件')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const clearImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>{label}</Label>
      
      {value ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={value}
                  alt="预览图片"
                  fill
                  className="object-cover"
                  onError={() => {
                    toast.error('图片加载失败')
                    clearImage()
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 text-sm text-muted-foreground truncate">
              {value}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className="border-dashed border-2 transition-colors hover:border-primary/50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-muted rounded-full">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  拖拽图片到此处，或点击上传
                </p>
                <p className="text-xs text-muted-foreground">
                  支持 JPEG、PNG、WebP、GIF，最大 5MB
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? '上传中...' : '选择文件'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  <Link className="h-4 w-4 mr-2" />
                  使用URL
                </Button>
              </div>

              {showUrlInput && (
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder={placeholder}
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleUrlSubmit()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleUrlSubmit}
                    disabled={!urlValue.trim()}
                  >
                    确定
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
} 