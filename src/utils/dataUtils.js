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
        SubmenuContentName: "车辆管理", //一级菜单名称
        routerLink: [
            {
                to: "/analyzecarcard", //点击二级菜单跳转路由
                MenuItemName: "analyzecarcard", //二级菜单唯一标识
                MenuItemContentName: "车辆维护", //二级菜单名称
            }
        ]
    },
    {
        SubmenuName: "example",
        SubmenuIconType: "ios-keypad",
        SubmenuContentName: "示例菜单",
        routerLink: [
            {
                to: "/listaddcard",
                MenuItemName: "listaddcard",
                MenuItemContentName: "编辑列表示例",
            },
            {
                to: "/treecard",
                MenuItemName: "treecard",
                MenuItemContentName: "树状结构示例",
            },
            {
                to: "/editorcard",
                MenuItemName: "editorcard",
                MenuItemContentName: "编辑器示例",
            }
        ]
    },
]
