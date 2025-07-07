-- Tech Blog 数据库表结构
-- 在 Supabase SQL 编辑器中执行此脚本

-- 启用行级安全 (RLS)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA PUBLIC REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

-- 1. 分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- hex color code
  icon VARCHAR(50), -- icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- hex color code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 文章表
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}', -- 标签数组
  author VARCHAR(100) DEFAULT 'Mark-李',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured_image TEXT,
  read_time INTEGER, -- 预计阅读时间（分钟）
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title VARCHAR(255),
  seo_description TEXT,
  canonical_url TEXT
);

-- 4. 项目表
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT,
  tech_stack TEXT[] DEFAULT '{}', -- 技术栈数组
  github_url TEXT,
  demo_url TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('planning', 'in_progress', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 图片库表
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

-- 6. 用户表（可选，用于未来的评论或管理功能）
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'reader' CHECK (role IN ('admin', 'editor', 'reader')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 评论表（可选）
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加自动更新 updated_at 的触发器
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

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全 (RLS) 策略
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：所有人可以读取已发布的内容
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

-- 管理员可以进行所有操作（需要配置服务端密钥）
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

CREATE POLICY "Enable all access for service role" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON comments
  FOR ALL USING (auth.role() = 'service_role');

-- 创建一些有用的视图
CREATE OR REPLACE VIEW article_stats AS
SELECT 
  category,
  COUNT(*) as article_count,
  MAX(published_at) as latest_article
FROM articles 
WHERE status = 'published'
GROUP BY category;

CREATE OR REPLACE VIEW popular_tags AS
SELECT 
  tag,
  COUNT(*) as usage_count
FROM (
  SELECT unnest(tags) as tag 
  FROM articles 
  WHERE status = 'published'
) t
GROUP BY tag
ORDER BY usage_count DESC;

-- 插入默认数据
INSERT INTO users (email, name, role) VALUES 
('a3449322892@gmail.com', 'Mark-李', 'admin')
ON CONFLICT (email) DO NOTHING; 