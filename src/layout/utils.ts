import type {IRule} from "@/domain/iRule.ts";
import IconFont from "@/components/IconFont";
import type {MenuProps} from "antd";
type MenuItem = Required<MenuProps>['items'][number];

export const transformMenus = (rules: IRule[], pid: number = 0): MenuItem[] => {
    const menus: MenuItem[] = []

    rules.forEach((item) => {
        if (item.type === 'rule') return;
        if (item.parent_id !== pid) return;
        if (item.type === 'route') {
            menus.push({
                label: item.name,
                icon: IconFont({name: item.icon}),
                key: item.key!,
            })
            return;
        }
        const children = transformMenus(rules, item.rule_id);
        if(children &&  children.length > 0) {
            menus.push({
                label: item.name,
                icon: IconFont({name: item.icon}),
                key: item.key!,
                children
            })
        }
    })
    return menus;
}