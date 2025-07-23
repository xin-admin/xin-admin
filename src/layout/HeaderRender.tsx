import React, {useMemo} from "react";
import {Button, ConfigProvider, Layout, Menu, type MenuProps, type ThemeConfig} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";
import HeaderLeftRender from "@/layout/HeaderLeftRender";
import HeaderRightRender from "@/layout/HeaderRightRender";
import useAuthStore from "@/stores/user.ts";
import IconFont from "@/components/IconFont";
import {useNavigate} from "react-router";
import BreadcrumbRender from "@/layout/BreadcrumbRender.tsx";
import {useTranslation} from "react-i18next";
import MenuRender from "@/layout/MenuRender.tsx";

const {Header} = Layout;

const HeaderRender: React.FC = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const rules = useAuthStore(state => state.rules);
  const layout = useGlobalStore(state => state.layout);
  const themeConfig = useGlobalStore(state => state.themeConfig);
  const collapsed = useGlobalStore(state => state.collapsed);
  const setCollapsed = useGlobalStore(state => state.setCollapsed);
  const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
  const setMenuSelectedKeys = useGlobalStore(state => state.setMenuSelectedKeys);
  const theme: ThemeConfig = {
    cssVar: true,
    token: { colorTextBase: themeConfig.headerColor },
    components: {
      Menu: {
        activeBarBorderWidth: 0,
        itemBg: 'transparent',
      }
    }
  }

  // 一级菜单
  const mixMenu = useMemo(() => {
    const mixRule = rules.filter(item => {
      return item.pid === 0 && !item.hidden && ['route', 'menu'].includes(item.type);
    })
    return mixRule.map(item => ({
        label: item.local ? t(item.local) : item.name,
        icon: item.icon ? <IconFont name={item.icon}/> : false,
        key: item.key!,
        path: item.path,
      })
    )
  }, [rules, t]);

  // mix 模式下顶部菜单栏点击事件
  const mixMenuClick: MenuProps['onClick'] = (info) => {
    const rule = rules.find(item => item.key === info.key);
    if( !rule ) return;
    if (rule.type === 'route') {
      if (rule.link) {
        window.open(rule.path,'_blank')
      } else {
        navigate(rule.path!)
      }
    } else {
      setMenuSelectedKeys([info.key]);
    }
  }
  
  return (
    <ConfigProvider theme={theme}>
      <Header
        className={"flex sticky z-1 top-0 backdrop-blur-xs"}
        style={{
          borderBottom: themeConfig.layoutBorder ? '1px solid ' + themeConfig.colorBorder : 'none',
        }}
      >
        { layout !== 'columns' && <HeaderLeftRender/> }
        <div className="flex-1 flex items-center">
          {/* 侧边栏开关 */}
          {['mix', 'side'].includes(layout) && (
            <Button
              type={'text'}
              className={'text-[16px] mr-2'}
              onClick={() => setCollapsed(!collapsed)}
            >
              { collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/> }
            </Button>
          )}
          {/* 面包屑 */}
          { ['columns', 'side'].includes(layout) && <BreadcrumbRender/> }
          {/* 顶部菜单 */}
          { layout == 'top' && <MenuRender /> }
          {/* 混合布局模式下的顶部菜单 */}
          { layout == 'mix' && (
            <Menu
              style={{ borderBottom: 'none' }}
              mode="horizontal"
              items={mixMenu}
              selectedKeys={menuSelectedKeys}
              onClick={mixMenuClick}
            />
          )}
        </div>
        <HeaderRightRender/>
      </Header>
    </ConfigProvider>
  )
}

export default HeaderRender;