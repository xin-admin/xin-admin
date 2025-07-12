import type {IRule} from "@/domain/iRule.ts";
import IconFont from "@/components/IconFont";
import type {MenuProps} from "antd";

type MenuItem = Required<MenuProps>['items'][number];

const transformMenus = (rules: IRule[], pid: number = 0): MenuItem[] => {
  const menus: MenuItem[] = []

  rules.forEach((item) => {
    if (item.type === 'rule') return;
    if (item.pid !== pid) return;
    if (item.type === 'route') {
      menus.push({
        label: item.name,
        icon: <IconFont name={item.icon}/>,
        key: item.key!,
      })
      return;
    }
    const children = transformMenus(rules, item.id);
    if (children && children.length > 0) {
      menus.push({
        label: item.name,
        icon: <IconFont name={item.icon}/>,
        key: item.key!,
        children
      })
    } else {
      menus.push({
        label: item.name,
        icon: <IconFont name={item.icon}/>,
        key: item.key!,
      })
    }
  })
  return menus;
}

export default transformMenus;