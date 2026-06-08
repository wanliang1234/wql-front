<template>
  <layout-util :header-title="title" :headerButton="false" :appFooter="false">
    <template #content>
      <Row>
        <Col span="24">
          <Form ref="form" :model="form" :label-width="120">
            <Row>
              <Col :span="8">
                <FormItem label="车牌号">
                  <Input class="query" v-model="form.value1" placeholder="请输入"/>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="车辆名称">
                  <Input class="query" v-model="form.value2" placeholder="请输入"/>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="购车时间">
                  <DatePicker type="date" v-model="form.value3" placeholder="请选择"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8" style="display: flex; align-items: center;">
                <FormItem label="车主名称" style="width: 100%;">
                  <Input class="query" v-model="form.value4" placeholder="请输入"/>
                </FormItem>
              </Col>
              <Col span="16" class="button-container">
                <Button type="primary" @click="onReset">重置</Button>
                <Button type="primary" @click="doSearch">搜索</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Table class="custom-table" border :columns="tableColumn" :data="pageData"></Table>
          <Page class="custom-pagination" :total="pageQuery.total" @on-change="pageChange" show-total/>
        </Col>
      </Row>
    </template>
  </layout-util>
</template>

<script>
import LayoutUtil from "@/components/layout/layout-util.vue";
import {h} from 'vue'
import {Col} from "view-ui-plus";

export default {
  components: {Col, LayoutUtil},
  data() {
    return {
      title: this.$route.meta.title + "",
      pageQuery: {
        total: 0,
      },
      form: {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
      },
      data: [],
      pageData: []
    }
  },
  mounted() {
    this.data = [
      {
        name: 'John Brown',
        age: 18,
      },
      {
        name: 'Jim Green',
        age: 24
      },
      {
        name: 'Joe Black',
        age: 30
      },
      {
        name: 'Jon Snow',
        age: 26
      }, {
        name: 'John Brown',
        age: 18
      },
      {
        name: 'Jim Green',
        age: 24
      },
      {
        name: 'Joe Black',
        age: 30
      },
      {
        name: 'Jon Snow',
        age: 26
      }, {
        name: 'John Brown',
        age: 18
      },
      {
        name: 'Jim Green',
        age: 24
      },
      {
        name: 'Joe Black',
        age: 30
      },
      {
        name: 'Jon Snow',
        age: 26
      }, {
        name: 'John Brown',
        age: 18
      },
      {
        name: 'Jim Green',
        age: 24
      },
      {
        name: 'Joe Black',
        age: 30
      },
      {
        name: 'Jon Snow',
        age: 26
      }
    ]
    this.pageQuery.total = this.data.length;
    this.pageDataUtil(1);
  },
  methods: {
    pageChange(pageValue) {
      this.pageDataUtil(pageValue);
    },
    pageDataUtil(pageValue) {
      this.pageData = this.data.slice((pageValue - 1) !== 0 ? (pageValue - 1) * 10 : 1, pageValue * 10);
    },
    goLayout(name) {
      this.$router.push({
        path: "/analyzecarcarddetail",
        query: {
          name: name
        }
      });
    },
    onReset() {
      this.form = {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
      };
    },
    doSearch() {
      console.log(this.form)
    },
  },
  computed: {
    tableColumn() {
      return [
        {
          title: '车辆名称',
          key: 'name',
          render: (...args) => { //...args就是(h,data)  但有时这个不行(无法跳转)所以h直接import {h} from 'vue'不用(h,data)里面的args[1]就相当于data
            return h('a', {
              onClick: () => {
                this.goLayout(args[1].row.name)
              },
              style: {
                cursor: 'pointer',
                color: '#1890ff'
              }
            }, args[1].row.name)
          }
        },
        {
          title: '车辆岁数',
          key: 'age'
        }
      ]
    }
  }
}
</script>


<style scoped>
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.custom-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border: none;
  padding: 16px;
}

.custom-table td {
  border-color: #f0f2f5 !important;
  padding: 14px 16px;
  transition: all 0.3s ease;
}

.custom-table tr:hover td {
  background-color: #fafbfc;
  transform: translateY(-1px);
}

.custom-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.custom-pagination .ivu-page-item {
  border-radius: 6px;
  margin: 0 4px;
  border: 1px solid #e8eaec;
  transition: all 0.3s ease;
}

.custom-pagination .ivu-page-item:hover {
  border-color: #1890ff;
  transform: translateY(-1px);
}

.custom-pagination .ivu-page-item-active {
  background: #1890ff;
  border-color: #1890ff;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.4);
}

.custom-pagination .ivu-page-item-active a {
  color: white;
}

.query {
  width: 200px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  height: 100%; /* 确保高度充满 */
}
</style>

