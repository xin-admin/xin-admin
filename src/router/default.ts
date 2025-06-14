import type {IRule} from "@/domain/iRule.ts";

const defaultRoute: IRule[] = [
    {
        rule_id: 1,
        parent_id: 0,
        type: 'menu',
        name: '仪表盘',
        path: '/dashboard',
        key: "dashboard",
        children: [
            {
                rule_id: 2,
                parent_id: 1,
                type: 'route',
                index: true,
                name: '分析页',
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
                key: 'dashboard.monitor',
                path: '/dashboard/monitor',
                elementPath: '/dashboard/monitor',
            }
        ]
    }
]

export default defaultRoute
