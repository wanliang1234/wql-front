<template>
  <div>
    <button @click="downloadPdf" :disabled="loading">
      {{ loading ? '导出中...' : '导出PDF' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loading: false
    }
  },

  methods: {
    async downloadPdf() {
      this.loading = true
      try {
        const response = await axios({
          url: 'http://localhost:8012/two/signature/export',
          method: 'get',
          responseType: 'blob',  // 重要：设置响应类型为blob
          timeout: 30000
        })

        // 检查HTTP状态码
        if (response.status !== 200) {
          throw new Error(`请求失败: ${response.status}`)
        }

        // 获取blob数据（关键：response.data才是blob）
        const blob = response.data

        // 检查blob类型，如果是text/html说明后端返回了错误页面
        if (blob.type === 'text/html') {
          // 读取错误信息
          const text = await blob.text()
          console.error('后端返回错误:', text)
          throw new Error('后端生成PDF失败，请检查后端日志')
        }

        // 检查是否有数据
        if (!blob || blob.size === 0) {
          throw new Error('文件为空')
        }

        // 验证PDF文件头（PDF文件以 %PDF 开头）
        if (blob.size > 0) {
          const header = await blob.slice(0, 4).text()
          if (!header.startsWith('%PDF')) {
            console.error('文件头:', header)
            throw new Error('生成的文件不是有效的PDF格式')
          }
        }

        // 创建下载链接（注意：使用blob，不需要再包装一次）
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `用户信息导出_${new Date().getTime()}.pdf`
        document.body.appendChild(link)
        link.click()

        // 清理
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)

        // 成功提示
        this.$message?.success('导出成功')

      } catch (error) {
        console.error('导出失败:', error)
        this.$message?.error(error.message || '导出失败，请重试')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
button {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #66b1ff;
}

button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}
</style>
