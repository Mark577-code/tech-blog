interface GitHubConfig {
  owner: string
  repo: string
  token: string
  branch: string
}

interface FileContent {
  path: string
  content: string
  message: string
  sha?: string
}

export class GitHubAPI {
  private config: GitHubConfig

  constructor(config: GitHubConfig) {
    this.config = config
  }

  // 获取文件内容
  async getFile(path: string): Promise<{ content: string; sha: string } | null> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      )

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      const content = Buffer.from(data.content, 'base64').toString('utf-8')
      
      return {
        content,
        sha: data.sha
      }
    } catch (error) {
      console.error('Error getting file from GitHub:', error)
      return null
    }
  }

  // 创建或更新文件
  async updateFile(fileData: FileContent): Promise<boolean> {
    try {
      const body: any = {
        message: fileData.message,
        content: Buffer.from(fileData.content).toString('base64'),
        branch: this.config.branch
      }

      // 如果是更新文件，需要提供SHA
      if (fileData.sha) {
        body.sha = fileData.sha
      }

      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${fileData.path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('GitHub API error:', errorData)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating file on GitHub:', error)
      return false
    }
  }

  // 删除文件
  async deleteFile(path: string, message: string): Promise<boolean> {
    try {
      // 先获取文件的SHA
      const fileInfo = await this.getFile(path)
      if (!fileInfo) {
        return false
      }

      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            sha: fileInfo.sha,
            branch: this.config.branch
          })
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error deleting file from GitHub:', error)
      return false
    }
  }
}

// 工厂函数
export function createGitHubAPI(): GitHubAPI | null {
  const env = process.env
  const owner = env['GITHUB_OWNER'] || 'Mark577-code'
  const repo = env['GITHUB_REPO'] || 'tech-blog'  
  const token = env['GITHUB_TOKEN'] || 'ghp_1234567890'
  const branch = env['GITHUB_BRANCH'] || 'main'

  if (!owner || !repo || !token) {
    console.warn('GitHub API credentials not configured')
    return null
  }

  return new GitHubAPI({ owner, repo, token, branch })
} 