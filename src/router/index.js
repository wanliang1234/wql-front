import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '@/views/loginpage/index.vue'
import HomePage from '@/views/homepage/index.vue'
import ManagementCarCard from '@/views/carcard/management/index.vue'
import AnalyzeCarCard from '@/views/carcard/analyze/index.vue'
import AnalyzeCarCardDetail from '@/views/carcard/analyze/detail.vue'
import ManagementCigaretteCard from '@/views/cigarettecard/management/index.vue'
import AnalyzeCigaretteCard from '@/views/cigarettecard/analyze/index.vue'


const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/homepage',
    name: 'HomePage',
    component: HomePage,
    children: [ // 子路由：仅渲染在 HomePage 的 <router-view> 里
      {
        path: '/managementcarcard',
        name: 'ManagementCarCard',
        component: ManagementCarCard,
        meta: {title: '车辆管理'}
      },
      {
        path: '/analyzecarcard',
        name: 'AnalyzeCarCard',
        component: AnalyzeCarCard,
        meta: {title: '车辆分析'}
      },
      {
        path: '/analyzecarcarddetail',
        name: 'AnalyzeCarCardDetail',
        component: AnalyzeCarCardDetail,
        meta: {title: '车辆分析明细'}
      },
      {
        path: '/managementcigarettecard',
        name: 'ManagementCigaretteCard',
        component: ManagementCigaretteCard,
        meta: {title: '卷烟管理'}
      },
      {
        path: '/analyzecigarettecard',
        name: 'AnalyzeCigaretteCard',
        component: AnalyzeCigaretteCard,
        meta: {title: '卷烟分析'}
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
