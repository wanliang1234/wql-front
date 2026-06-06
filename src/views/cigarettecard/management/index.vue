<template>
  <div>
    <Layout>
      <Header class="app-header">
        顶层
      </Header>
      <Content>
        内容
      </Content>
      <Footer>
        底部
      </Footer>
    </Layout>

  </div>
</template>

<script>

import {defineComponent} from "vue";
import {Content, Layout} from "view-ui-plus";

export default defineComponent({
  components: {Layout, Content}
})
</script>

<style scoped>
.app-header {
  background: #ffffff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  padding: 20px;
  margin: 10px 30px 10px 30px;
}
</style>
