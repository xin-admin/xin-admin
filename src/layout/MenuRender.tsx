import type {IRule} from "@/domain/iRule.ts";
import IconFont from "@/components/IconFont";
import {useTranslation} from "react-i18next";
import useAuthStore from "@/stores/user.ts";
import {Menu, type MenuProps} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useGlobalStore} from "@/stores";
import {useNavigate} from "react-router";
type MenuItem = Required<MenuProps>['items'][number];

const MenuRender = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const rules = useAuthStore(state => state.rules);
  const layout = useGlobalStore(state => state.layout);
  // 菜单栏相关状态
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
  const setMenuSelectedKeys = useGlobalStore(state => state.setMenuSelectedKeys);

  const transformMenus = useCallback((rules: IRule[], pid: number = 0): MenuItem[] => {
    const menus: MenuItem[] = []
    rules.forEach((item) => {
      if (item.type === 'rule') return;
      if (item.pid !== pid) return;
      if (item.hidden) return;
      if (item.type === 'route') {
        menus.push({
          label: item.local ? t(item.local) : item.name,
          icon: item.icon ? <IconFont name={item.icon}/> : false,
          key: item.key!,
        })
        return;
      }
      const children = transformMenus(rules, item.id);
      if (children && children.length > 0) {
        menus.push({
          label: item.local ? t(item.local) : item.name,
          icon: item.icon ? <IconFont name={item.icon}/> : false,
          key: item.key!,
          children
        })
      } else {
        menus.push({
          label: item.local ? t(item.local) : item.name,
          icon: item.icon ? <IconFont name={item.icon}/> : false,
          key: item.key!,
        })
      }
    })
    return menus;
  }, [t])

  const menuClick: MenuProps['onClick'] = (data) => {
    // 记录选中的菜单项 key 数组
    if(layout === 'top' || layout === 'side') {
      setMenuSelectedKeys(data.keyPath)
    } else {
      setMenuSelectedKeys([...data.keyPath, menuSelectedKeys[menuSelectedKeys.length - 1]])
    }
    // 跳转路由
    const rule = rules.find(item => item.key === data.key)
    if (rule && rule.path) {
      if (rule.link) {
        window.open(rule.path, '_blank')
      } else {
        navigate(rule.path!)
      }
    }
  }

  useEffect(() => {
    if(layout === 'mix' || layout === 'columns') {
      const rule = rules.find(item => item.key === menuSelectedKeys.at(-1))
      if (rule) {
        setMenu(transformMenus(rules, rule.id))
      }
    } else {
      setMenu(transformMenus(rules))
    }
  }, [rules, transformMenus, layout, menuSelectedKeys]);

  return (
    <Menu
      selectedKeys={menuSelectedKeys}
      defaultOpenKeys={menuSelectedKeys}
      mode={ layout === 'top' ? 'horizontal' : 'inline' }
      items={menu}
      onClick={menuClick}
    />
  )
}

export default MenuRender;