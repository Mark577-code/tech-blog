import { Github, Mail, MapPin, Calendar, Code, Heart, FileText, Music } from "lucide-react"

export default function About() {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      {/* 个人介绍 */}
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full border-4 border-primary/20 shadow-lg flex items-center justify-center mx-auto">
            <Code className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Mark-李
        </h1>
        
        <p className="text-xl text-muted-foreground mb-6">
          全栈开发工程师 · 技术分享者 · 编程爱好者
        </p>
        
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>中国</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>博客创建于 2024</span>
          </div>
        </div>
      </div>

      {/* 关于博客 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              关于我
            </h2>
            <div className="prose prose-gray dark:prose-invert">
              <p>
                你好！我是 Mark-李，一名编程技术爱好者。我专注于现代web开发技术，
                包括但不限于 React、Next.js、Node.js、TypeScript 等技术栈。
              </p>
              <p>
                我相信技术的力量能够改变世界，也相信知识分享的价值。通过这个博客，
                我希望能够分享我在编程路上的经验、思考和收获。
              </p>
              <p>
                世界很大，不妨去看看 - 这是我对生活的态度，也是我对技术探索的理念。
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">技术栈</h2>
            <div className="flex flex-wrap gap-2">
              {[
                'JavaScript', 'TypeScript', 'Next.js', 
                'Node.js', 'Python', 'Vue.js', 'Tailwind CSS',
                'MongoDB', 'PostgreSQL', 'Docker', 'AWS'
              ].map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 博客特色 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">博客特色</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg bg-card">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">技术文章</h3>
            <p className="text-sm text-muted-foreground">
              分享前端、后端、AI等技术领域的深度文章和实战经验
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">项目展示</h3>
            <p className="text-sm text-muted-foreground">
              展示个人项目作品，包含完整的技术栈介绍和源码链接
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">生活分享</h3>
            <p className="text-sm text-muted-foreground">
              记录编程之外的生活感悟、摄影作品和个人思考
            </p>
          </div>
        </div>
      </div>

      {/* 社交链接 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">社交链接</h2>
        <div className="flex justify-center gap-6">
          <a 
            href="https://music.163.com/#/user/home?id=1857158786" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <Music className="h-5 w-5 text-red-500" />
            <span>网易云音乐</span>
          </a>
          
          <a 
            href="https://github.com/Mark577-code" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/30 rounded-lg transition-colors"
          >
            <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span>GitHub</span>
          </a>
          
          <a 
            href="mailto:a3449322892@gmail.com"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <Mail className="h-5 w-5 text-blue-500" />
            <span>邮箱</span>
          </a>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          欢迎与我交流技术问题，分享编程经验，或者只是简单的打个招呼！
        </p>
      </div>
    </div>
  )
} 