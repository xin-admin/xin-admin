import type {IRule} from "@/domain/iRule.ts";

const defaultRoute: IRule[] = [
    {
        name: '仪表盘',
        path: '/dashboard',
        children: [
            {
                name: '分析页',
                path: '/dashboard/analysis',
                elementPath: '/dashboard/analysis',
            }
        ]
    }
]

export default defaultRoute
