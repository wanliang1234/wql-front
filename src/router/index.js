import {createRouter, createWebHistory} from 'vue-router'
import Login from '@/views/loginpage/index.vue'
import HomePage from '@/views/homepage/index.vue'
import EncapsulationList from '@/views/encapsulation/list/index.vue'
import EncapsulationListDetail from '@/views/encapsulation/list/detail.vue'
import ListAddCard from '@/views/example/list-add/index.vue'
import TreeCard from '@/views/example/tree/index.vue'
import EditorCard from '@/views/example/editor/index.vue'
import PdfCard from '@/views/example/pdf/index.vue'


const routes = [
    //默认login页面
    {
        path: '/',
        redirect: '/login',
    },
    //login页面
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    //菜单页面
    {
        path: '/homepage',
        name: 'HomePage',
        redirect: '/encapsulationlist',
        component: HomePage,
        children: [ // 子路由：仅渲染在 HomePage 的 <router-view> 里
            //车辆管理----------
            {
                path: '/encapsulationlist',
                name: 'EncapsulationList',
                component: EncapsulationList,
                meta: {title: '列表封装'}
            },
            {
                path: '/encapsulationlistdetail',
                name: 'EncapsulationListDetail',
                component: EncapsulationListDetail,
                meta: {title: '列表封装明细'}
            },
            //示例-------------------
            {
                path: '/listaddcard',
                name: 'ListAddCard',
                component: ListAddCard,
                meta: {title: '编辑列表示例'}
            },
            {
                path: '/treecard',
                name: 'TreeCard',
                component: TreeCard,
                meta: {title: '树状结构示例'}
            },
            {
                path: '/editorcard',
                name: 'EditorCard',
                component: EditorCard,
                meta: {title: '编辑器示例'}
            },
            {
                path: '/pdfcard',
                name: 'PdfCard',
                component: PdfCard,
                meta: {title: '编辑器示例'}
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
