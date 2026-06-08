<template>
  <div class="layout">
    <Sider :style="{ position: 'fixed', height: '100vh', left: 0, overflow: 'auto', width: '200px' }">
      <Menu :active-name="activeMenuName" theme="dark" width="auto" :open-names="openSubmenuNames">
        <Submenu v-for="menu in menuData" :key="menu.SubmenuName" :name="menu.SubmenuName">
          <template #title>
            <Icon :type="menu.SubmenuIconType"></Icon>
            {{ menu.SubmenuContentName }}
          </template>
          <MenuItem v-for="item in menu.routerLink" :key="item.MenuItemName" :name="item.MenuItemName" :to="item.to">
            {{ item.MenuItemContentName }}
          </MenuItem>
        </Submenu>
      </Menu>
    </Sider>

    <Layout :style="{ marginLeft: '200px', minHeight: '100vh' }">
      <Content>
        <router-view/>
      </Content>
    </Layout>
  </div>
</template>

<script>
import {menuInfo} from "@/utils/dataUtils.js"

export default {
  name: 'HomePage',
  data() {
    return {
      menuData: menuInfo,
      activeMenuName: '',
      openSubmenuNames: []
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(to) {
        this.updateMenuState();
      }
    }
  },
  methods: {
    updateMenuState() {
      const currentRoute = this.$route.path;

      // 查找当前路由对应的菜单项
      for (const menu of this.menuData) {
        for (const item of menu.routerLink) {
          if (item.to === currentRoute) {
            this.activeMenuName = item.MenuItemName;
            this.openSubmenuNames = [menu.SubmenuName];
            return;
          }
        }
      }

      // 如果没有匹配的菜单项，设置默认值
      this.activeMenuName = this.activeMenuName || 'encapsulationlist';
      this.openSubmenuNames = this.openSubmenuNames.length ? this.openSubmenuNames : ['encapsulation'];
    }
  }
}
</script>
