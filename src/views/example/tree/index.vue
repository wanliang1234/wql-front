<template>
  <div class="layout-container">
    <!-- 左侧树形菜单 -->
    <div class="tree-panel">
      <div class="panel-header">
        <span>功能导航</span>
      </div>
      <div class="tree-wrapper">
        <Tree
            :data="treeData"
            @on-select-change="handleNodeSelect"
        />
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content-panel">
      <div class="panel-header">
        <span>{{ currentTitle }} - 数据列表</span>
      </div>
      <div class="list-wrapper">
        <!-- 列表展示：若无数据则显示空状态 -->
        <div v-if="currentList.length === 0" class="empty-state">
          <span>暂无数据，请点击左侧菜单</span>
        </div>
        <!-- 使用 Card 样式模拟列表项（也可替换为 Table 组件） -->
        <div v-else class="data-list">
          <div
              v-for="(item, idx) in currentList"
              :key="idx"
              class="list-item"
          >
            <div class="item-title">{{ item.name }}</div>
            <div class="item-desc">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'

// ---------- 树形数据（扩展了 id 字段便于区分） ----------
const treeData = ref([
  {
    id: 1,
    title: '用户管理',
    expand: true,
    children: [
      {id: 11, title: '普通用户', expand: false},
      {id: 12, title: 'VIP 用户', expand: false}
    ]
  },
  {
    id: 2,
    title: '商品管理',
    expand: false,
    children: [
      {id: 21, title: '电子产品', expand: false},
      {id: 22, title: '家居用品', expand: false}
    ]
  },
  {
    id: 3,
    title: '订单管理',
    expand: false,
    children: []
  }
])

// ---------- 模拟后端数据：根据节点 id 返回对应的列表数据 ----------
const mockDataMap = {
  // 用户管理 - 普通用户
  11: [
    {name: '张三', description: '注册于 2025-01-01，活跃度 85%'},
    {name: '李四', description: '注册于 2025-02-10，活跃度 92%'},
    {name: '王五', description: '注册于 2025-03-15，活跃度 78%'}
  ],
  // 用户管理 - VIP 用户
  12: [
    {name: '赵六', description: 'VIP 会员，等级 3，累计消费 ¥12,000'},
    {name: '钱七', description: 'VIP 会员，等级 5，累计消费 ¥25,800'}
  ],
  // 商品管理 - 电子产品
  21: [
    {name: '智能手机', description: '最新款旗舰手机，¥3999'},
    {name: '无线耳机', description: '降噪蓝牙耳机，¥899'},
    {name: '平板电脑', description: '10.5英寸娱乐平板，¥2599'}
  ],
  // 商品管理 - 家居用品
  22: [
    {name: '记忆棉枕头', description: '护颈助眠，¥199'},
    {name: 'LED 台灯', description: '智能调光阅读灯，¥129'}
  ],
  // 订单管理（无子节点时直接展示该节点数据）
  3: [
    {name: '订单 #2025001', description: '金额 ¥299，状态：已发货'},
    {name: '订单 #2025002', description: '金额 ¥1,280，状态：已完成'}
  ]
}

// ---------- 当前选中的节点信息 ----------
const selectedNode = ref(null)

// 当前显示的列表数据（计算属性，根据选中节点动态获取）
const currentList = computed(() => {
  if (!selectedNode.value) return []
  const nodeId = selectedNode.value.id
  return mockDataMap[nodeId] || []
})

// 当前标题（用于右侧面板头部）
const currentTitle = computed(() => {
  return selectedNode.value?.title || '请选择菜单'
})

// ---------- 树节点选中事件 ----------
const handleNodeSelect = (selectedNodes) => {
  // selectedNodes 是一个数组，包含当前选中的节点对象（多选模式下会有多个，这里为单选）
  if (selectedNodes && selectedNodes.length > 0) {
    selectedNode.value = selectedNodes[0]
  } else {
    selectedNode.value = null
  }
}
</script>

<style scoped>
/* 整体布局：左右两栏，带内边距和背景 */
.layout-container {
  display: flex;
  gap: 24px;
  padding: 24px;
  min-height: 100vh;
  background: #f0f2f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

/* 左侧面板样式 */
.tree-panel {
  width: 300px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.tree-panel:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

/* 右侧面板样式 */
.content-panel {
  flex: 1;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.content-panel:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

/* 面板头部 */
.panel-header {
  padding: 16px 20px;
  background: #fafbfc;
  border-bottom: 1px solid #edf0f5;
  font-size: 16px;
  font-weight: 600;
  color: #1f2f3d;
  letter-spacing: 0.5px;
}

/* 树区域滚动条 */
.tree-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
}

/* 右侧列表容器 */
.list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #a0aeba;
  font-size: 14px;
  background: #fafbfd;
  border-radius: 12px;
}

/* 数据列表样式（仿卡片列表） */
.data-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  background: #f9fafc;
  border-radius: 12px;
  padding: 16px 20px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.list-item:hover {
  background: #ffffff;
  border-color: #e0e6ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transform: translateY(-1px);
}

.item-title {
  font-weight: 600;
  font-size: 15px;
  color: #1f2f3d;
  margin-bottom: 6px;
}

.item-desc {
  font-size: 13px;
  color: #6b7a8a;
  line-height: 1.4;
}

/* 自定义滚动条（左右通用） */
.tree-wrapper::-webkit-scrollbar,
.list-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.tree-wrapper::-webkit-scrollbar-track,
.list-wrapper::-webkit-scrollbar-track {
  background: #f1f3f7;
  border-radius: 10px;
}

.tree-wrapper::-webkit-scrollbar-thumb,
.list-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.tree-wrapper::-webkit-scrollbar-thumb:hover,
.list-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
