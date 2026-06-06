<template>
  <div class="app-container">
    <Layout class="app-layout">
      <!--顶层-->
      <Header class="app-header">
        <!--标题-->
        <h3 class="header-title">{{ headerTitle }}</h3>
        <!--按钮-->
        <div class="header-button" v-if="headerButton">
          <slot name="header-button"></slot>
        </div>
      </Header>
      <!--中间-->
      <Content class="app-main">
        <slot name="content"></slot>
      </Content>
      <!--底部-->
      <Footer class="app-footer" v-if="appFooter">
        <div class="footer-button">
          <!--底部按钮-->
          <slot name="footer-button"></slot>
        </div>
      </Footer>
    </Layout>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import {Col, Content, Footer, Header, Layout, Row} from "view-ui-plus";

export default defineComponent({
  components: {Footer, Content, Row, Col, Header, Layout},
  data() {
    return {}
  },
  props: {
    headerTitle: {
      type: [String],
      required: true
    },
    headerButton: {
      type: [Boolean],
      default: true
    },
    appFooter: {
      type: [Boolean],
      default: true
    }
  }
})
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #ffffff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  padding: 20px;
  margin: 10px 30px 10px 30px;
}

.app-main {
  background: #ffffff;
  flex: 1;
  overflow: auto;
  margin: 10px 30px 10px 30px;
  padding: 20px;
}

.app-footer {
  background: #ffffff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  padding: 0 20px;
  height: 9%;
}

.header-title {
  font-weight: bold;
}

.header-button {
  margin-left: auto;
}

/* 按钮容器：靠右对齐 + 按钮间距优化 */
.footer-button {
  margin-left: auto; /* 关键：抢占左侧剩余空间，实现整体靠右 */
  display: flex; /* 让内部两个按钮横向排列（默认也是横向，但加了更可控） */
  gap: 12px; /* 两个按钮之间的间距（推荐用 gap，比 margin 更优雅） */
}
</style>
