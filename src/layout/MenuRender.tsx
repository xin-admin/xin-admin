import type {IMenus} from "@/domain/iSysRule.ts";
import IconFont from "@/components/IconFont";
import {useTranslation} from "react-i18next";
import useAuthStore from "@/stores/user.ts";
import {Menu, type MenuProps} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useGlobalStore} from "@/stores";
import {useNavigate} from "react-router";
import {usePageTitle} from "@/hooks/usePageTitle";
type MenuItem = Required<MenuProps>['items'][number];

const MenuRender = () => {
  const {t} = useTranslation();
  const menus = useAuthStore(state => state.menus);
  const menuMap = useAuthStore(state => state.menuMap);
  const breadcrumbMap = useAuthStore(state => state.breadcrumbMap);
  const layout = useGlobalStore(state => state.layout);
  const menuParentKey = useGlobalStore(state => state.menuParentKey);
  const setBreadcrumb = useGlobalStore(state => state.setBreadcrumb);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const isMobile = useGlobalStore(state => state.isMobile);
  const navigate = useNavigate();
  const { setPageTitle } = usePageTitle();

  const transformMenus = useCallback((nodes: IMenus[]): MenuItem[] => {
    const menusItems: MenuItem[] = [];
    nodes.forEach(node => {
      if (!['route', 'menu'].includes(node.type!)) return;
      if (!node.hidden) return;
      if (node.type === 'route') {
        menusItems.push({
          label: node.local ? t(node.local) : node.name,
          icon: node.icon ? <IconFont name={node.icon}/> : false,
          key: node.key!,
        })
      } else {
        if (node.children) {
          const children = transformMenus(node.children);
          menusItems.push({
            label: node.local ? t(node.local) : node.name,
            icon: node.icon ? <IconFont name={node.icon}/> : false,
            key: node.key!,
            children
          })
        } else {
          menusItems.push({
            label: node.local ? t(node.local) : node.name,
            icon: node.icon ? <IconFont name={node.icon}/> : false,
            key: node.key!,
          })
        }
      }
    })
    return menusItems;
  }, [t])

  const menuClick: MenuProps['onClick'] = (info) => {
    const menu = menuMap[info.key];
    setBreadcrumb(breadcrumbMap[info.key]);
    const headTitle = menu.local ? t(menu.local) : menu.name;
    setPageTitle(headTitle || '');
    if(! menu.path) return;
    if (menu.link) {
      window.open(menu.path, '_blank');
    } else {
      navigate(menu.path);
    }
  }

  useEffect(() => {
    if(isMobile) {
      setMenu(transformMenus(menus))
      return;
    }
    if(layout === 'mix' || layout === 'columns') {
      const rule = menus.find(item => item.key === menuParentKey!)
      if (rule && rule.children) {
        setMenu(transformMenus(rule.children))
      }
    } else {
      setMenu(transformMenus(menus))
    }
  }, [menus, transformMenus, layout, menuParentKey]);

  return (
    <Menu
      mode={ layout === 'top' && !isMobile ? 'horizontal' : 'inline' }
      items={menu}
      onClick={menuClick}
    />
  )
}

export default MenuRender;