<template>
  <div>
    <button @click="downloadPdf" :disabled="loading">
      {{ loading ? '导出中...' : '导出PDF' }}
    </button>
  </div>
</template>

<script>
import request from '@/utils/request'

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
        const response = await request({
          url: '/two/signature/export',  // 你的后端接口
          method: 'get',
          responseType: 'blob',  // 重要：设置响应类型为blob
          timeout: 30000
        })

        // 注意：因为你的request拦截器返回的是 response.data
        // 所以这里的response已经是blob数据了

        // 检查是否有数据
        if (!response || response.size === 0) {
          throw new Error('文件为空')
        }

        // 创建blob对象
        const blob = new Blob([response], {type: 'application/pdf'})

        // 创建下载链接
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = '用户信息导出.pdf'  // 下载文件名
        document.body.appendChild(link)
        link.click()

        // 清理
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        // 成功提示
        this.$Message?.success('导出成功')

      } catch (error) {
        console.error('导出失败:', error)
        this.$Message?.error(error.message || '导出失败，请重试')
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
