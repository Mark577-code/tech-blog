-- 博客网站 Supabase 数据库表创建脚本
-- 请将以下 SQL 代码复制到 Supabase SQL Editor 中执行

-- 1. 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author VARCHAR(100) DEFAULT 'Mark-李',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured_image TEXT,
  read_time INTEGER,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title VARCHAR(255),
  seo_description TEXT,
  canonical_url TEXT
);

-- 4. 创建项目表
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('planning', 'in_progress', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建图片库表
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  alt_text TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建索引（优化查询性能）
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- 7. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. 为表添加自动更新 updated_at 的触发器
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. 启用行级安全 (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 10. 创建 RLS 策略：所有人可以读取已发布的内容
CREATE POLICY "Enable read access for published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Enable read access for all categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for completed projects" ON projects
  FOR SELECT USING (status = 'completed');

CREATE POLICY "Enable read access for all gallery images" ON gallery_images
  FOR SELECT USING (true);

-- 11. 管理员可以进行所有操作（Service Role）
CREATE POLICY "Enable all access for service role" ON articles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON categories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON tags
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON projects
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON gallery_images
  FOR ALL USING (auth.role() = 'service_role');

-- 12. 插入默认分类数据
INSERT INTO categories (name, slug, description, color, icon) VALUES 
('编程技术', 'programming', '编程、开发、技术相关文章', '#3b82f6', 'Code'),
('摄影分享', 'photography', '摄影作品、技巧分享', '#10b981', 'Camera'),
('文字教程', 'tutorial', '各种教程和指南', '#f59e0b', 'BookOpen'),
('项目展示', 'project', '项目开发、经验分享', '#ef4444', 'Folder')
ON CONFLICT (slug) DO NOTHING;

-- 完成！现在您可以使用博客系统了。 