<template>
  <div class="editable-table-wrapper">
    <div class="button-bar">
      <Button type="primary" @click="handleAdd" icon="md-add">新增</Button>
    </div>

    <Table
        class="custom-table"
        :columns="tableColumns"
        :data="tableData"
        border
        stripe
        highlight-row
    />
  </div>
</template>

<script>
import {h} from "vue";
import {
  Input,
  InputNumber,
  DatePicker,
  Select,
  Option,
  Button,
  Message,
} from "view-ui-plus";

export default {
  name: "EditableTable",
  components: {
    Input,
    InputNumber,
    DatePicker,
    Select,
    Option,
    Button,
  },
  data() {
    return {
      tableData: [],
      editCache: {},
      typeOptions: ["手机", "现金", "银行卡"],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    //数据初始化
    initData() {
      this.tableData = [
        {id: 1, name: "张三", age: 25, salary: 8000, date: "2024-06-01", type: "手机"},
        {id: 2, name: "李四", age: 30, salary: 9500, date: "2024-06-05", type: "现金"},
        {id: 3, name: "王五", age: 28, salary: 7200, date: "2024-06-10", type: "手机"},
      ];
    },
    //新增按钮
    handleAdd() {
      const newId = this.generateNewId();
      const newRow = {
        id: newId,
        name: "",
        age: null,
        salary: null,
        date: "",
        type: "",
      };
      this.tableData.push(newRow);
      Message.success("新增成功，请填写数据");
    },
    //获取序号
    generateNewId() {
      if (this.tableData.length === 0) return 1;
      const maxId = Math.max(...this.tableData.map((item) => item.id));
      return maxId + 1;
    },
    //删除
    handleDelete(id) {
      const index = this.tableData.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.tableData.splice(index, 1);
        delete this.editCache[id];
        Message.success("删除成功");
      } else {
        Message.warning("未找到要删除的行");
      }
    },
    // 姓名 年龄
    renderEditableCell(params, field, Component, extraProps = {}) {
      const row = params.row;
      const cache = this.editCache[row.id];
      let currentValue = cache?.[field] !== undefined ? cache[field] : row[field];

      if (Component === InputNumber) {
        if (currentValue !== undefined && currentValue !== null && !isNaN(Number(currentValue))) {
          currentValue = Number(currentValue);
        } else {
          currentValue = null;
        }
      }

      const getActualValue = (val, comp) => {
        if (comp === Input) {
          return val?.target?.value ?? val;
        }
        if (comp === InputNumber) {
          let raw;
          if (val && typeof val === 'object' && 'target' in val) {
            raw = val.target.value;
          } else {
            raw = val;
          }
          if (raw === undefined || raw === null || raw === '') {
            return null;
          }
          const num = Number(raw);
          return isNaN(num) ? null : num;
        }
        return val;
      };

      const onInput = (val) => {
        if (!this.editCache[row.id]) {
          this.editCache[row.id] = {...row};
        }
        const actualValue = getActualValue(val, Component);
        this.editCache[row.id][field] = actualValue;
      };

      const onBlur = () => {
        this.saveCell(row, field);
      };

      return h("div", {class: "editable-cell"}, [
        h(Component, {
          modelValue: currentValue,
          size: "small",
          style: {width: "100%"},
          ...extraProps,
          onInput,
          onBlur,
        }),
      ]);
    },
    // 工资
    renderSalaryCell(params) {
      const row = params.row;
      const cache = this.editCache[row.id];

      // 获取当前值（优先缓存，其次行数据）
      let currentValue = cache?.salary !== undefined ? cache.salary : row.salary;

      // 用于存储输入框的 DOM 引用，以便直接操作值
      let inputRef = null;

      const handleInput = (e) => {
        const raw = e.target.value;
        // 过滤：只允许数字和一个小数点
        let filtered = raw.replace(/[^\d.]/g, '');
        // 确保只有一个小数点
        const dotIndex = filtered.indexOf('.');
        if (dotIndex !== -1) {
          filtered = filtered.slice(0, dotIndex + 1) + filtered.slice(dotIndex + 1).replace(/\./g, '');
        }
        // 限制小数点后最多两位（实时限制）
        if (filtered.includes('.')) {
          const parts = filtered.split('.');
          if (parts[1] && parts[1].length > 2) {
            filtered = parts[0] + '.' + parts[1].slice(0, 2);
          }
        }
        // 更新缓存和输入框显示
        if (!this.editCache[row.id]) {
          this.editCache[row.id] = {...row};
        }
        this.editCache[row.id].salary = filtered;
        // 强制刷新输入框显示
        if (inputRef) {
          inputRef.value = filtered;
        }
      };

      const handleBlur = () => {
        let raw = this.editCache[row.id]?.salary;
        if (!raw || raw === '') {
          this.editCache[row.id].salary = null;
          this.saveCell(row, 'salary');
          return;
        }
        let num = parseFloat(raw);
        if (isNaN(num)) {
          this.editCache[row.id].salary = null;
          this.saveCell(row, 'salary');
          return;
        }
        // 四舍五入保留两位小数
        const formatted = Math.round(num * 100) / 100;
        this.editCache[row.id].salary = formatted;
        this.saveCell(row, 'salary');
        // 更新显示为格式化后的两位小数
        if (inputRef) {
          inputRef.value = formatted.toFixed(2);
        }
      };

      // 显示值：如果是数字则格式化为两位小数，否则显示原始字符串（空值显示空）
      let displayValue = '';
      if (typeof currentValue === 'number' && !isNaN(currentValue)) {
        displayValue = currentValue.toFixed(2);
      } else if (typeof currentValue === 'string') {
        displayValue = currentValue;
      } else {
        displayValue = '';
      }

      // 使用原生 input 并通过 onVnodeMounted 获取 DOM 引用
      return h("div", {class: "editable-cell"}, [
        h("input", {
          type: "text",
          value: displayValue,
          placeholder: "请输入工资",
          class: "salary-input",
          style: {
            width: "100%",
            height: "32px",
            lineHeight: "32px",
            textAlign: "center",
            borderRadius: "6px",
            border: "1px solid #dcdfe6",
            padding: "0 8px",
            fontSize: "13px"
          },
          onInput: handleInput,
          onBlur: handleBlur,
          onVnodeMounted: (vnode) => {
            inputRef = vnode.el;
          },
          onVnodeBeforeUpdate: (vnode) => {
            inputRef = vnode.el;
          }
        })
      ]);
    },
    /**
     * 取出缓存中的新值和行中的旧值。
     *
     * 对年龄（age）和工资（salary）字段做类型标准化：
     *
     * 将有效的输入转换为数字（Number），无效值（空、非数字）设为 null。
     *
     * 工资字段额外进行四舍五入保留两位小数。
     *
     * 比较新旧值，如果相同则直接返回，避免无意义的更新。
     *
     * 将处理后的新值写回 row[field]（触发视图更新），并同步更新缓存，确保下次编辑时状态一致。
     */
    saveCell(row, field) {
      const cache = this.editCache[row.id];
      if (cache && cache[field] !== undefined) {
        let oldValue = row[field];
        let newValue = cache[field];

        if (field === 'age') {
          if (newValue !== undefined && newValue !== null && !isNaN(Number(newValue))) {
            newValue = Number(newValue);
          } else {
            newValue = null;
          }
          if (oldValue !== undefined && oldValue !== null && !isNaN(Number(oldValue))) {
            oldValue = Number(oldValue);
          } else {
            oldValue = null;
          }
        } else if (field === 'salary') {
          // 工资字段：确保数字且保留两位小数
          if (newValue !== undefined && newValue !== null && !isNaN(Number(newValue))) {
            newValue = Number(newValue);
            newValue = Math.round(newValue * 100) / 100;
          } else {
            newValue = null;
          }
          if (oldValue !== undefined && oldValue !== null && !isNaN(Number(oldValue))) {
            oldValue = Number(oldValue);
          } else {
            oldValue = null;
          }
        }

        if (oldValue === newValue) return;
        row[field] = newValue;
        // 同步缓存
        cache[field] = newValue;
      }
    },
  },
  computed: {
    tableColumns() {
      return [
        {
          title: "序号",
          width: 90,
          align: "center",
          render: (h, params) => h("span", params.index + 1),
        },
        {
          title: "姓名",
          key: "name",
          minWidth: 120,
          align: "center",
          render: (h, params) => this.renderEditableCell(params, "name", Input, {
            placeholder: "请输入姓名",
            maxlength: 20,
          }),
        },
        {
          title: "年龄",
          key: "age",
          minWidth: 120,
          align: "center",
          render: (h, params) => this.renderEditableCell(params, "age", InputNumber, {
            placeholder: "请输入年龄",
            min: 0,
            max: 150,
            style: {width: "100%"},
          }),
        },
        {
          title: "工资",
          key: "salary",
          minWidth: 150,
          align: "center",
          render: (h, params) => this.renderSalaryCell(params),
        },
        {
          title: "入职日期",
          key: "date",
          minWidth: 170,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const cache = this.editCache[row.id];
            const currentValue = cache?.date !== undefined ? cache.date : row.date;
            return h("div", {class: "editable-cell"}, [
              h(DatePicker, {
                modelValue: currentValue,
                type: "date",
                placeholder: "请选择日期",
                size: "small",
                style: {width: "100%"},
                "on-update:modelValue": (val) => {
                  if (!this.editCache[row.id]) {
                    this.editCache[row.id] = {...row};
                  }
                  const formatted = val ? new Date(val).toISOString().slice(0, 10) : "";
                  this.editCache[row.id].date = formatted;
                  this.saveCell(row, "date");
                },
              }),
            ]);
          },
        },
        {
          title: "结算方式",
          key: "type",
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const cache = this.editCache[row.id];
            const currentValue = cache?.type !== undefined ? cache.type : row.type;
            return h("div", {class: "editable-cell"}, [
              h(
                  Select,
                  {
                    modelValue: currentValue,
                    placeholder: "请选择方式",
                    size: "small",
                    style: {width: "100%"},
                    "on-update:modelValue": (val) => {
                      if (!this.editCache[row.id]) {
                        this.editCache[row.id] = {...row};
                      }
                      this.editCache[row.id].type = val;
                      this.saveCell(row, "type");
                    },
                  },
                  {
                    default: () =>
                        this.typeOptions.map((opt) =>
                            h(Option, {value: opt, label: opt})
                        ),
                  }
              ),
            ]);
          },
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            return h(
                Button,
                {
                  type: "error",
                  size: "small",
                  class: "delete-btn",
                  onClick: () => this.handleDelete(row.id),
                },
                {default: () => "删除"}
            );
          },
        },
      ];
    },
  },
};
</script>

<style scoped>
/* 原有样式保持不变，增加工资输入框样式 */
.editable-table-wrapper {
  padding: 24px;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%);
  min-height: 100vh;
}

.button-bar {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
}

.custom-table {
  border-radius: 16px;
  overflow-x: auto;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.12);
}

.custom-table :deep(.ivu-table th) {
  background: linear-gradient(135deg, #7ab3e0 0%, #5a9bd5 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  text-align: center !important;
  padding: 16px 8px;
}

.custom-table :deep(.ivu-table td) {
  text-align: center !important;
  vertical-align: middle;
  border-bottom: 1px solid #e1f0fe;
  padding: 12px 8px;
  color: #2c3e50;
}

.editable-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.editable-cell :deep(.ivu-input),
.editable-cell :deep(.ivu-input-number-input) {
  text-align: center;
}

.editable-cell :deep(.ivu-select-selected-value) {
  text-align: center;
  display: block;
}

.editable-cell :deep(.ivu-date-picker .ivu-input) {
  text-align: center;
}

/* 工资输入框自定义样式 */
.salary-input {
  text-align: center;
  transition: all 0.2s;
}

.salary-input:focus {
  border-color: #5a9bd5;
  box-shadow: 0 0 0 3px rgba(90, 155, 213, 0.2);
  outline: none;
}

.custom-table :deep(.delete-btn) {
  background: rgba(255, 107, 107, 0.85);
  border: none;
  border-radius: 20px;
  padding: 4px 16px;
  font-weight: 500;
  font-size: 13px;
  color: white;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.2);
  transition: all 0.2s ease;
}

.custom-table :deep(.delete-btn:hover) {
  background: #ff6b6b;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
}

.button-bar :deep(.ivu-btn-primary) {
  background: linear-gradient(135deg, #5a9bd5 0%, #3b82b6 100%);
  border: none;
  border-radius: 10px;
  padding: 8px 24px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(59, 130, 182, 0.3);
  transition: all 0.3s ease;
}

.button-bar :deep(.ivu-btn-primary:hover) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #4a8bc9 0%, #2c6e9e 100%);
  box-shadow: 0 6px 16px rgba(59, 130, 182, 0.4);
}

.custom-table :deep(.ivu-table tr.ivu-table-row-stripe td) {
  background-color: #f8fcff;
}

.custom-table :deep(.ivu-table tr:hover td) {
  background-color: #f0f8ff;
}

.custom-table :deep(.ivu-table-wrapper) {
  border-radius: 16px;
  border: 1px solid rgba(90, 155, 213, 0.2);
}

.custom-table :deep(.ivu-table-body::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

.custom-table :deep(.ivu-table-body::-webkit-scrollbar-track) {
  background: #eef2fa;
  border-radius: 10px;
}

.custom-table :deep(.ivu-table-body::-webkit-scrollbar-thumb) {
  background: #b9d4f0;
  border-radius: 10px;
}

.custom-table :deep(.ivu-table-body::-webkit-scrollbar-thumb:hover) {
  background: #5a9bd5;
}
</style>
