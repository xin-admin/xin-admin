import type {IMenus} from "@/domain/iSysRule.ts";

const defaultRoute: IMenus[] = [
  {
    type: "menu",
    key: "dashboard",
    name: "仪表盘",
    path: "",
    icon: "PieChartOutlined",
    elementPath: "",
    order: 0,
    local: "menu.dashboard",
    hidden: 1,
    link: 0,
    children: [
      {
        type: "route",
        key: "dashboard.analysis",
        name: "分析页",
        path: "/dashboard/analysis",
        icon: "PieChartOutlined",
        elementPath: "/dashboard/analysis",
        order: 0,
        local: "menu.analysis",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "dashboard.monitor",
        name: "监控页",
        path: "/dashboard/monitor",
        icon: "BarChartOutlined",
        elementPath: "/dashboard/monitor",
        order: 1,
        local: "menu.monitor",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "dashboard.workplace",
        name: "工作台",
        path: "/dashboard/workplace",
        icon: "LineChartOutlined",
        elementPath: "/dashboard/workplace",
        order: 1,
        local: "menu.workplace",
        hidden: 1,
        link: 0
      }
    ]
  },
  {
    type: "menu",
    key: "result",
    name: "结果页面",
    path: "",
    icon: "CheckCircleOutlined",
    elementPath: "",
    order: 1,
    local: "menu.result",
    hidden: 1,
    link: 0,
    children: [
      {
        type: "route",
        key: "result.success",
        name: "成功页",
        path: "/result/success",
        icon: "CheckCircleOutlined",
        elementPath: "/result/success",
        order: 0,
        local: "menu.result.success",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "result.fail",
        name: "失败页",
        path: "/result/fail",
        icon: "CloseCircleOutlined",
        elementPath: "/result/fail",
        order: 1,
        local: "menu.result.fail",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "result.warning",
        name: "警告页",
        path: "/result/warning",
        icon: "WarningOutlined",
        elementPath: "/result/warning",
        order: 2,
        local: "menu.result.warning",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "result.info",
        name: "信息页",
        path: "/result/info",
        icon: "ExclamationCircleOutlined",
        elementPath: "/result/info",
        order: 3,
        local: "menu.result.info",
        hidden: 1,
        link: 0
      }
    ]
  },
  {
    type: "menu",
    key: "exception",
    name: "异常页面",
    path: "",
    icon: "AlertOutlined",
    elementPath: "",
    order: 2,
    local: "menu.exception",
    hidden: 1,
    link: 0,
    children: [
      {
        type: "route",
        key: "exception.403",
        name: "403",
        path: "/exception/403",
        icon: "AppstoreOutlined",
        elementPath: "/exception/403",
        order: 0,
        local: "menu.exception.403",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "exception.404",
        name: "404",
        path: "/exception/404",
        icon: "AppstoreOutlined",
        elementPath: "/exception/404",
        order: 1,
        local: "menu.exception.404",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "exception.500",
        name: "500",
        path: "/exception/500",
        icon: "AppstoreOutlined",
        elementPath: "/exception/500",
        order: 2,
        local: "menu.exception.500",
        hidden: 1,
        link: 0
      }
    ]
  },
  {
    type: "menu",
    key: "auth",
    name: "权限管理",
    path: "",
    icon: "SafetyCertificateOutlined",
    elementPath: "",
    order: 3,
    local: "menu.auth",
    hidden: 1,
    link: 0,
    children: [
      {
        type: "route",
        key: "auth.page",
        name: "页面权限",
        path: "/auth/page",
        icon: "AppstoreOutlined",
        elementPath: "/auth/page",
        order: 0,
        local: "menu.auth.page",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "auth.button",
        name: "按钮权限",
        path: "/auth/button",
        icon: "AppstoreOutlined",
        elementPath: "/auth/button",
        order: 1,
        local: "menu.auth.button",
        hidden: 1,
        link: 0
      }
    ]
  },
  {
    type: "menu",
    key: "multi-menu",
    name: "多级菜单",
    path: "",
    icon: "MenuOutlined",
    elementPath: "",
    order: 4,
    local: "menu.multi-menu",
    hidden: 1,
    link: 0,
    children: [
      {
        type: "route",
        key: "multi-menu.first",
        name: "二级页面",
        path: "/multi-menu/first",
        icon: "MenuOutlined",
        elementPath: "/multi-menu/first",
        order: 0,
        local: "menu.multi-menu.first",
        hidden: 1,
        link: 0
      },
      {
        type: "menu",
        key: "multi-menu.two",
        name: "二级菜单",
        path: "",
        icon: "MenuOutlined",
        elementPath: "",
        order: 1,
        local: "menu.multi-menu.two",
        hidden: 1,
        link: 0,
        children: [
          {
            type: "route",
            key: "multi-menu.two.second",
            name: "三级页面",
            path: "/multi-menu/two/second",
            icon: "MenuOutlined",
            elementPath: "/multi-menu/second",
            order: 0,
            local: "menu.multi-menu.two.second",
            hidden: 1,
            link: 0
          },
          {
            type: "menu",
            key: "multi-menu.two.three",
            name: "三级菜单",
            path: "",
            icon: "MenuOutlined",
            elementPath: "",
            order: 1,
            local: "menu.multi-menu.two.three",
            hidden: 1,
            link: 0,
            children: [
              {
                type: "route",
                key: "multi-menu.two.three.third",
                name: "四级页面",
                path: "/multi-menu/two/three/third",
                icon: "MenuOutlined",
                elementPath: "/multi-menu/third",
                order: 0,
                local: "menu.multi-menu.two.three.third",
                hidden: 1,
                link: 0
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: "menu",
    key: "page-layout",
    name: "页面布局",
    path: "",
    icon: "LayoutOutlined",
    elementPath: "",
    order: 5,
    local: "menu.page-layout",
    hidden: 1,
    link: 0,
    children: [
      {
        type: "route",
        key: "page-layout.base-layout",
        name: "基础布局",
        path: "/page-layout/base-layout",
        icon: "AppstoreOutlined",
        elementPath: "/page-layout/base-layout",
        order: 0,
        local: "menu.page-layout.base-layout",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "page-layout.fix-header",
        name: "固定头部",
        path: "/page-layout/fix-header",
        icon: "AppstoreOutlined",
        elementPath: "/page-layout/fix-header",
        order: 1,
        local: "menu.page-layout.fix-header",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "page-layout.descriptions",
        name: "页面描述",
        path: "/page-layout/descriptions",
        icon: "AppstoreOutlined",
        elementPath: "/page-layout/descriptions",
        order: 2,
        local: "menu.page-layout.descriptions",
        hidden: 1,
        link: 0
      }
    ]
  },
  {
    type: "menu",
    key: "user",
    name: "个人中心",
    path: "",
    icon: "UserOutlined",
    elementPath: "",
    order: 6,
    local: "menu.user",
    hidden: 1,
    link: 0,
    children: [
      {
        type: "route",
        key: "user.info",
        name: "个人中心",
        path: "/user/index",
        icon: "UserOutlined",
        elementPath: "/user/index",
        order: 0,
        local: "menu.user.index",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "user.setting",
        name: "用户设置",
        path: "/user/setting",
        icon: "UserSwitchOutlined",
        elementPath: "/user/setting/index",
        order: 1,
        local: "menu.user.setting",
        hidden: 1,
        link: 0,
        children: [
          {
            type: "nested-route",
            key: "user.setting.info",
            name: "基本信息",
            path: "/user/setting",
            icon: "",
            elementPath: "/user/setting/info",
            order: 0,
            local: "",
            hidden: 1,
            link: 0
          },
          {
            type: "nested-route",
            key: "user.setting.security",
            name: "安全设置",
            path: "/user/setting/security",
            icon: "",
            elementPath: "/user/setting/security",
            order: 1,
            local: "",
            hidden: 1,
            link: 0
          },
          {
            type: "nested-route",
            key: "user.setting.verification",
            name: "实名认证",
            path: "/user/setting/verification",
            icon: "",
            elementPath: "/user/setting/verification",
            order: 2,
            local: "",
            hidden: 1,
            link: 0
          }
        ]
      }
    ]
  },
  {
    type: "menu",
    key: "system",
    name: "系统设置",
    path: "",
    icon: "SettingOutlined",
    elementPath: "",
    order: 7,
    local: "menu.system",
    hidden: 1,
    link: 0,
    children: [
      {
        type: "route",
        key: "system.info",
        name: "系统信息",
        path: "/system/info",
        icon: "",
        elementPath: "/system/info",
        order: 0,
        local: "menu.system.info",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "system.monitor",
        name: "系统监控",
        path: "/system/monitor",
        icon: "",
        elementPath: "/system/monitor",
        order: 1,
        local: "menu.system.monitor",
        hidden: 1,
        link: 0
      },
      {
        type: "route",
        key: "system.rule",
        name: "菜单权限",
        path: "/system/rule",
        icon: "",
        elementPath: "/system/rule",
        order: 2,
        local: "menu.system.rule",
        hidden: 1,
        link: 0
      }
    ]
  },
  {
    type: "menu",
    key: "xin-admin",
    name: "XinAdmin",
    path: "https://xinadmin.cn",
    icon: "LinkOutlined",
    elementPath: "",
    order: 8,
    local: "menu.xin-admin",
    hidden: 1,
    link: 1
  }
]

export default defaultRoute
