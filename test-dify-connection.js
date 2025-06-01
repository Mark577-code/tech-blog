// 测试Dify API连接
const DIFY_API_KEY = "app-VgehRhENF80ypB3ogmhneojk"
const DIFY_BASE_URL = "http://localhost"

async function testDifyConnection() {
  console.log('🔄 开始测试Dify API连接...')
  
  // 测试不同的端点
  const endpoints = [
    '/v1/datasets',
    '/api/datasets', 
    '/v1/completion-messages',
    '/console/api/datasets'
  ]
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 测试端点: ${DIFY_BASE_URL}${endpoint}`)
    
    try {
      const response = await fetch(`${DIFY_BASE_URL}${endpoint}?page=1&limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      console.log(`📊 状态码: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ 连接成功!')
        console.log('📋 数据:', JSON.stringify(data, null, 2))
        break
      } else {
        const error = await response.text()
        console.log('❌ 失败:', error)
      }
    } catch (error) {
      console.log('💥 连接错误:', error.message)
    }
  }
}

// 运行测试
testDifyConnection() 