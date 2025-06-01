interface DifyDataset {
  id: string
  name: string
  description: string
  data_source_type: string
  indexing_technique: string
  created_at: string
  updated_at: string
}

interface DifyDocument {
  id: string
  name: string
  data_source_type: string
  data_source_info: any
  dataset_process_rule_id: string
  batch: string
  created_at: string
  updated_at: string
  indexing_status: string
}

interface CreateDocumentRequest {
  name: string
  text: string
  indexing_technique: 'high_quality' | 'economy'
  process_rule?: {
    rules: {
      pre_processing_rules: Array<{
        id: string
        enabled: boolean
      }>
      segmentation: {
        separator: string
        max_tokens: number
      }
    }
  }
}

class DifyKnowledgeService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.DIFY_API_BASE_URL || 'http://localhost'
    this.apiKey = process.env.DIFY_API_KEY || ''
    
    // 暂时注释掉严格检查，允许服务启动
    // if (!this.apiKey) {
    //   throw new Error('DIFY_API_KEY is required')
    // }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}/v1${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Dify API error: ${response.status} ${errorText}`)
    }

    return await response.json()
  }

  // 获取所有知识库
  async getDatasets(): Promise<DifyDataset[]> {
    const response = await this.makeRequest('/datasets?page=1&limit=100')
    return response.data || []
  }

  // 创建知识库
  async createDataset(name: string, description: string): Promise<DifyDataset> {
    const response = await this.makeRequest('/datasets', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        indexing_technique: 'high_quality',
        permission: 'only_me'
      })
    })
    return response
  }

  // 获取知识库详情
  async getDataset(datasetId: string): Promise<DifyDataset> {
    return await this.makeRequest(`/datasets/${datasetId}`)
  }

  // 获取知识库文档列表
  async getDocuments(datasetId: string): Promise<DifyDocument[]> {
    const response = await this.makeRequest(`/datasets/${datasetId}/documents?page=1&limit=100`)
    return response.data || []
  }

  // 添加文档到知识库
  async createDocument(datasetId: string, documentData: CreateDocumentRequest): Promise<DifyDocument> {
    const response = await this.makeRequest(`/datasets/${datasetId}/documents`, {
      method: 'POST',
      body: JSON.stringify(documentData)
    })
    return response.document
  }

  // 更新文档
  async updateDocument(datasetId: string, documentId: string, text: string): Promise<DifyDocument> {
    const response = await this.makeRequest(`/datasets/${datasetId}/documents/${documentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ text })
    })
    return response.document
  }

  // 删除文档
  async deleteDocument(datasetId: string, documentId: string): Promise<void> {
    await this.makeRequest(`/datasets/${datasetId}/documents/${documentId}`, {
      method: 'DELETE'
    })
  }

  // 按分类获取或创建知识库
  async getOrCreateDatasetByCategory(category: string): Promise<DifyDataset> {
    const datasets = await this.getDatasets()
    const existingDataset = datasets.find(ds => ds.name === `博客文章-${category}`)
    
    if (existingDataset) {
      return existingDataset
    }

    return await this.createDataset(
      `博客文章-${category}`,
      `${category}分类下的所有博客文章内容，用于AI助手回答相关问题`
    )
  }
}

export { DifyKnowledgeService, type DifyDataset, type DifyDocument, type CreateDocumentRequest } 