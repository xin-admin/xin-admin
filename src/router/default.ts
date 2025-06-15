import type {IRule} from "@/domain/iRule.ts";

const defaultRoute: IRule[] = [
    {
        rule_id: 1,
        parent_id: 0,
        type: 'menu',
        name: '仪表盘',
        path: '/dashboard',
        key: "dashboard",
        icon: "HeatMapOutlined",
        children: [
            {
                rule_id: 2,
                parent_id: 1,
                type: 'route',
                index: true,
                name: '分析页',
                icon: "BarChartOutlined",
                key: 'dashboard.index',
                path: '/dashboard/index',
                elementPath: '/dashboard/index',
            },
            {
                rule_id: 3,
                parent_id: 1,
                type: 'route',
                index: false,
                name: '仪表盘',
                icon: "PieChartOutlined",
                key: 'dashboard.analysis',
                path: '/dashboard/analysis',
                elementPath: '/dashboard/analysis',
            },
            {
                rule_id: 4,
                parent_id: 1,
                type: 'route',
                index: false,
                name: '工作台',
                icon: "LineChartOutlined",
                key: 'dashboard.monitor',
                path: '/dashboard/monitor',
                elementPath: '/dashboard/monitor',
            }
        ]
    },
    {
        rule_id: 5,
        parent_id: 0,
        type: 'menu',
        name: '仪表盘2',
        path: '/dashboard',
        key: "dashboard1",
        icon: "HeatMapOutlined",
        children: [
            {
                rule_id: 6,
                parent_id: 1,
                type: 'route',
                index: true,
                name: '分析页2',
                icon: "BarChartOutlined",
                key: 'dashboard.index1',
                path: '/dashboard/index',
                elementPath: '/dashboard/index',
            },
            {
                rule_id: 7,
                parent_id: 1,
                type: 'route',
                index: false,
                name: '仪表盘2',
                icon: "PieChartOutlined",
                key: 'dashboard.analysis1',
                path: '/dashboard/analysis',
                elementPath: '/dashboard/analysis',
            },
            {
                rule_id: 8,
                parent_id: 1,
                type: 'route',
                index: false,
                name: '工作台2',
                icon: "LineChartOutlined",
                key: 'dashboard.monitor1',
                path: '/dashboard/monitor',
                elementPath: '/dashboard/monitor',
            }
        ]
    }
]

export default defaultRoute
