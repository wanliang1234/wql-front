<template>
  <div class="editable-table-wrapper">
    <!-- 新增按钮 -->
    <div class="button-bar">
      <Button type="primary" @click="handleAdd" icon="md-add">新增</Button>
    </div>

    <!-- 可编辑表格 -->
    <Table
        :columns="columns"
        :data="tableData"
        border
        stripe
        highlight-row
    />
  </div>
</template>

<script setup>
import {ref, reactive, h} from 'vue'
import {Input, InputNumber, DatePicker, Select, Option, Message, Button} from 'view-ui-plus'

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    salary: 8000,
    date: '2024-06-01',
    type: '手机'
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    salary: 9500,
    date: '2024-06-05',
    type: '现金'
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    salary: 7200,
    date: '2024-06-10',
    type: '手机'
  }
])

// 编辑临时存储（用于失焦时保存）
const editCache = reactive({})

// 更新缓存
const updateEditCache = () => {
  tableData.value.forEach(row => {
    if (!editCache[row.id]) {
      editCache[row.id] = {...row}
    }
  })
}
updateEditCache()

// 定义表格列
const columns = ref([
  {
    title: '序号',
    type: 'index',
    width: 80,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '姓名',
    key: 'name',
    width: 120,
    render: (row) => {
      const rowData = row.row
      const currentValue = editCache[rowData.id]?.name ?? rowData.name
      return h('div', {class: 'editable-cell'}, [
        h(Input, {
          modelValue: currentValue,
          placeholder: '请输入姓名',
          size: 'small',
          onInput: (val) => {
            if (!editCache[rowData.id]) editCache[rowData.id] = {...rowData}
            editCache[rowData.id].name = val
          },
          onBlur: () => {
            rowData.name = editCache[rowData.id].name
            Message.success('保存成功')
          }
        })
      ])
    }
  },
  {
    title: '年龄',
    key: 'age',
    width: 120,
    render: (row) => {
      const rowData = row.row
      const currentValue = editCache[rowData.id]?.age ?? rowData.age
      return h('div', {class: 'editable-cell'}, [
        h(InputNumber, {
          modelValue: currentValue,
          placeholder: '请输入年龄',
          size: 'small',
          min: 0,
          max: 150,
          style: {width: '100%'},
          onInput: (val) => {
            if (!editCache[rowData.id]) editCache[rowData.id] = {...rowData}
            editCache[rowData.id].age = val
          },
          onBlur: () => {
            rowData.age = editCache[rowData.id].age
            Message.success('保存成功')
          }
        })
      ])
    }
  },
  {
    title: '工资',
    key: 'salary',
    width: 120,
    render: (row) => {
      const rowData = row.row
      const currentValue = editCache[rowData.id]?.salary ?? rowData.salary
      return h('div', {class: 'editable-cell'}, [
        h(InputNumber, {
          modelValue: currentValue,
          placeholder: '请输入工资',
          size: 'small',
          min: 0,
          style: {width: '100%'},
          onInput: (val) => {
            if (!editCache[rowData.id]) editCache[rowData.id] = {...rowData}
            editCache[rowData.id].salary = val
          },
          onBlur: () => {
            rowData.salary = editCache[rowData.id].salary
            Message.success('保存成功')
          }
        })
      ])
    }
  },
  {
    title: '日期',
    key: 'date',
    width: 150,
    render: (row) => {
      const rowData = row.row
      const currentValue = editCache[rowData.id]?.date ?? rowData.date
      return h('div', {class: 'editable-cell'}, [
        h(DatePicker, {
          modelValue: currentValue,
          type: 'date',
          placeholder: '请选择日期',
          size: 'small',
          style: {width: '100%'},
          onUpdate: (val) => {
            if (!editCache[rowData.id]) editCache[rowData.id] = {...rowData}
            // 格式化日期为 YYYY-MM-DD
            const formatted = val ? new Date(val).toISOString().slice(0, 10) : ''
            editCache[rowData.id].date = formatted
          },
          onChange: () => {
            rowData.date = editCache[rowData.id].date
            Message.success('保存成功')
          }
        })
      ])
    }
  },
  {
    title: '类型',
    key: 'type',
    width: 120,
    render: (row) => {
      const rowData = row.row
      const currentValue = editCache[rowData.id]?.type ?? rowData.type
      const typeOptions = ['手机', '现金']
      return h('div', {class: 'editable-cell'}, [
        h(Select, {
          modelValue: currentValue,
          placeholder: '请选择类型',
          size: 'small',
          style: {width: '100%'},
          onUpdate: (val) => {
            if (!editCache[rowData.id]) editCache[rowData.id] = {...rowData}
            editCache[rowData.id].type = val
          },
          onChange: () => {
            rowData.type = editCache[rowData.id].type
            Message.success('保存成功')
          }
        }, () => {
          return typeOptions.map(opt => h(Option, {value: opt, label: opt}))
        })
      ])
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: 'center',
    fixed: 'right',
    render: (row) => {
      const rowData = row.row
      return h('div', [
        h(Button, {
          type: 'text',
          size: 'small',
          onClick: () => handleDelete(rowData.id)
        }, () => '删除')
      ])
    }
  }
])

// 生成新 ID
const generateNewId = () => {
  const maxId = Math.max(...tableData.value.map(item => item.id), 0)
  return maxId + 1
}

// 新增数据
const handleAdd = () => {
  const newId = generateNewId()
  const newRow = {
    id: newId,
    name: '',
    age: null,
    salary: null,
    date: '',
    type: ''   // 类型默认为空，用户需手动选择
  }
  tableData.value.push(newRow)
  editCache[newId] = {...newRow}
  Message.success('新增成功，请填写数据')
}

// 删除数据
const handleDelete = (id) => {
  tableData.value = tableData.value.filter(item => item.id !== id)
  delete editCache[id]
  Message.success('删除成功')
}
</script>

<style scoped>
.editable-table-wrapper {
  padding: 20px;
  background: #f5f7f9;
  min-height: 100vh;
}

.button-bar {
  margin-bottom: 20px;
  text-align: right;
}

:deep(.editable-cell) {
  min-width: 100px;
}

:deep(.ivu-table-cell) {
  padding: 8px 0;
}

:deep(.ivu-input-wrapper) {
  width: 100%;
}

:deep(.ivu-input-number) {
  width: 100%;
}
</style>
