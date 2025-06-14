import type {IRule} from "@/domain/iRule.ts";
import IconFont from "@/components/IconFont";
import type {MenuProps} from "antd";
type MenuItem = Required<MenuProps>['items'][number];

export const buildMenu = (rule: IRule): MenuItem | undefined => {
    if (rule.type === 'rule') return;
    const menu: MenuItem = {
        label: rule.name,
        icon: IconFont({name: rule.icon}),
        key: rule.key!,
    }
    if (rule.type === 'route') {
        return menu;
    }
    if(rule.children && rule.children.length) {
        const childMenu: MenuItem[] = rule.children.map(item => buildMenu(item)!)
        return {
            label: rule.name,
            icon: IconFont({name: rule.icon}),
            key: rule.key!,
            children: childMenu,
        }
    }
    return menu;
}