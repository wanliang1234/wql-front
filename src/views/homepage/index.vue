<template>
  <div class="layout">
    <!-- 固定侧边栏 -->
    <Sider :style="{ position: 'fixed', height: '100vh', left: 0, overflow: 'auto', width: '200px' }">
      <!-- 使用 key 强制菜单在数据加载后重新渲染 -->
      <Menu
          :key="menuData.length"
          :active-name="activeMenuName"
          theme="dark"
          width="auto"
          :open-names="openSubmenuNames"
      >
        <Submenu
            v-for="menu in menuData"
            :key="menu.submenuName"
            :name="menu.submenuName"
        >
          <template #title>
            <Icon :type="menu.submenuIconType"/>
            {{ menu.submenuContentName }}
          </template>
          <MenuItem
              v-for="item in menu.routerLink"
              :key="item.menuItemName"
              :name="item.menuItemName"
              :to="item.to"
              @click.native="handleMenuClick(item.to)"
          >
            {{ item.menuItemContentName }}
          </MenuItem>
        </Submenu>
      </Menu>
    </Sider>

    <!-- 右侧内容区域 -->
    <Layout :style="{ marginLeft: '200px', minHeight: '100vh' }">
      <Content>
        <router-view/>
      </Content>
    </Layout>
  </div>
</template>

<script>
import {twoServer} from "@/utils/dataUtils.js"
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      menuData: [],              // 菜单数据（后端返回小写驼峰格式）
      activeMenuName: '',       // 当前激活的菜单项 name
      openSubmenuNames: [],     // 需要展开的子菜单 name 数组
      menuLoaded: false,        // 菜单是否加载完成标志
    };
  },
  watch: {
    // 监听路由变化，更新菜单高亮（仅在菜单加载完成后执行）
    $route: {
      immediate: true,
      handler() {
        if (this.menuLoaded) {
          this.updateMenuState();
        }
      },
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 获取后端菜单数据
    initData() {
      axios({
        url: twoServer + '/menu/tree',
        method: 'get',
        headers: {},
        params: {},
      }).then((resp) => {
        this.menuData = resp.data || [];
        this.menuLoaded = true;
        // 数据加载完成后立即更新高亮
        this.updateMenuState();
        // 如果当前路由没有匹配到任何菜单项，则自动跳转到第一个有效菜单路径
        this.checkAndRedirectToFirstMenu();
      }).catch((err) => {
        console.error('菜单获取失败', err);
      });
    },

    // 根据当前路由更新菜单高亮和展开状态
    updateMenuState() {
      if (!this.menuData.length) return;

      const currentPath = this.$route.path;
      let matched = false;

      // 遍历菜单查找匹配项
      for (const menu of this.menuData) {
        for (const item of menu.routerLink) {
          if (item.to === currentPath) {
            this.activeMenuName = item.menuItemName;
            this.openSubmenuNames = [menu.submenuName];
            matched = true;
            break;
          }
        }
        if (matched) break;
      }

      // 如果没有匹配的菜单项，默认激活第一个菜单项并展开其父菜单
      if (!matched && this.menuData[0] && this.menuData[0].routerLink.length) {
        const firstMenuItem = this.menuData[0].routerLink[0];
        this.activeMenuName = firstMenuItem.menuItemName;
        this.openSubmenuNames = [this.menuData[0].submenuName];
      }
    },

    // 如果当前路由没有匹配任何菜单项，则跳转到第一个菜单路径
    checkAndRedirectToFirstMenu() {
      if (!this.menuData.length) return;
      const currentPath = this.$route.path;
      let hasMatch = false;

      for (const menu of this.menuData) {
        for (const item of menu.routerLink) {
          if (item.to === currentPath) {
            hasMatch = true;
            break;
          }
        }
        if (hasMatch) break;
      }

      if (!hasMatch && this.menuData[0] && this.menuData[0].routerLink.length) {
        const firstPath = this.menuData[0].routerLink[0].to;
        this.$router.replace(firstPath).catch((err) => {
          // 避免重复跳转报错
          if (err.name !== 'NavigationDuplicated') console.error(err);
        });
      }
    },

    // 菜单项点击时手动执行路由跳转（防止 a 标签默认行为导致页面刷新）
    handleMenuClick(toPath) {
      if (this.$route.path !== toPath) {
        this.$router.push(toPath).catch((err) => {
          if (err.name !== 'NavigationDuplicated') console.error(err);
        });
      }
    },
  },
};
</script>

<style scoped>
/* 可根据需要添加样式，例如移除滚动条等 */
.layout {
  height: 100%;
  overflow: hidden;
}
</style>
