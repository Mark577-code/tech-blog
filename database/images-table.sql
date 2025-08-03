-- 图片存储表创建脚本
-- 在 Supabase SQL Editor 中执行

-- 创建图片存储表
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- 文件大小（字节）
  width INTEGER, -- 图片宽度
  height INTEGER, -- 图片高度
  mime_type VARCHAR(100) NOT NULL, -- 文件类型
  alt_text TEXT, -- 替代文字
  title VARCHAR(255), -- 图片标题
  description TEXT, -- 图片描述
  tags TEXT[] DEFAULT '{}', -- 标签数组
  category VARCHAR(100) DEFAULT 'general', -- 分类
  usage_type VARCHAR(50) DEFAULT 'general', -- 使用类型: avatar, featured, gallery, content
  is_public BOOLEAN DEFAULT true, -- 是否公开
  uploaded_by VARCHAR(100) DEFAULT 'admin', -- 上传者
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 添加约束
  CONSTRAINT valid_mime_type CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml')),
  CONSTRAINT valid_usage_type CHECK (usage_type IN ('avatar', 'featured', 'gallery', 'content', 'general'))
);

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_usage_type ON images(usage_type);
CREATE INDEX IF NOT EXISTS idx_images_is_public ON images(is_public);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_file_path ON images(file_path);

-- 创建更新时间触发器
CREATE TRIGGER update_images_updated_at 
  BEFORE UPDATE ON images
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- RLS 策略：公开图片所有人可读
CREATE POLICY "Enable read access for public images" ON images
  FOR SELECT USING (is_public = true);

-- RLS 策略：管理员可以进行所有操作
CREATE POLICY "Enable all access for service role on images" ON images
  FOR ALL USING (auth.role() = 'service_role');

-- 插入一些示例数据
INSERT INTO images (
  filename, 
  original_name, 
  file_path, 
  file_url, 
  file_size, 
  width, 
  height, 
  mime_type, 
  alt_text, 
  title, 
  category, 
  usage_type
) VALUES 
(
  'placeholder.png',
  'placeholder.png', 
  '/images/placeholder.png',
  '/images/placeholder.png',
  1024,
  400,
  300,
  'image/png',
  '占位图片',
  '默认占位图',
  'system',
  'general'
) ON CONFLICT DO NOTHING;

-- 创建图片统计视图
CREATE OR REPLACE VIEW image_stats AS
SELECT 
  category,
  usage_type,
  COUNT(*) as image_count,
  SUM(file_size) as total_size,
  AVG(file_size) as avg_size
FROM images 
WHERE is_public = true
GROUP BY category, usage_type;

COMMENT ON TABLE images IS '图片文件存储表';
COMMENT ON COLUMN images.filename IS '存储的文件名';
COMMENT ON COLUMN images.original_name IS '原始文件名';
COMMENT ON COLUMN images.file_path IS '文件存储路径';
COMMENT ON COLUMN images.file_url IS '文件访问URL';
COMMENT ON COLUMN images.usage_type IS '使用类型：头像/特色图/画廊/内容/通用'; 