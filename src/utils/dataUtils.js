//登录账号和密码
export const loginInfo = [{
    user: "wql_2025",
    password: "123456789"
}, {
    user: "zc_2025",
    password: "123456789"
}, {
    user: "1",
    password: "1"
}]

export const menuInfo = [
    {
        SubmenuName: "car", //一级菜单唯一标识用于展开和收缩菜单
        SubmenuIconType: "ios-navigate", //一级菜单图标
        SubmenuContentName:"车辆管理", //一级菜单名称
        routerLink:[
            {
                to:"/managementcarcard", //点击二级菜单跳转路由
                MenuItemName:"managementcarcard", //二级菜单唯一标识
                MenuItemContentName:"车辆管理", //二级菜单名称
            },
            {
                to:"/analyzecarcard",
                MenuItemName:"analyzecarcard",
                MenuItemContentName:"车辆分析",
            }
        ]
    },
    {
        SubmenuName: "cigarette",
        SubmenuIconType: "ios-navigate",
        SubmenuContentName:"卷烟管理",
        routerLink:[
            {
                to:"/managementcigarettecard",
                MenuItemName:"managementcigarettecard",
                MenuItemContentName:"卷烟管理",
            },
            {
                to:"/analyzecigarettecard",
                MenuItemName:"analyzecigarettecard",
                MenuItemContentName:"卷烟分析",
            }
        ]
    },
]
