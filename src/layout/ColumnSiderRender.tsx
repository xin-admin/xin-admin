import {ConfigProvider, Layout, theme} from "antd";
import {useGlobalStore} from "@/stores";
import React from "react";
import useAuthStore from "@/stores/user.ts";
import IconFont from "@/components/IconFont";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import MenuRender from "@/layout/MenuRender.tsx";
import type {IRule} from "@/domain/iRule.ts";

const {Sider} = Layout;
const {useToken} = theme;

const ColumnSiderRender: React.FC = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const themeConfig = useGlobalStore(state => state.themeConfig);
  const logo = useGlobalStore(state => state.logo);
  const title = useGlobalStore(state => state.title);
  const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
  const setMenuSelectedKeys = useGlobalStore(state => state.setMenuSelectedKeys);
  const rules = useAuthStore(state => state.rules);
  const {token} = useToken();

  const menuClick = (rule: IRule) => {
    if (rule.type === 'route') {
      if (rule.link) {
        window.open(rule.path, '_blank')
      } else {
        navigate(rule.path!)
      }
    } else {
      setMenuSelectedKeys([rule.key])
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: { colorTextBase: themeConfig.siderColor },
        cssVar: true
      }}
    >
      <Sider
        width={(themeConfig.siderWeight ? themeConfig.siderWeight : 226) + 72}
        className={"h-screen sticky top-0 bottom-0"}
        style={{color: themeConfig.siderColor}}
      >
        <div className={"w-full flex h-full"}>
          <div
            className={'w-[72px] box-border h-full overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'}
            style={{borderRight: "1px solid " + themeConfig.colorBorder}}
          >
            <div className={"w-full flex items-center justify-center pt-2.5 pb-2.5"}>
              <img className={"w-9"} src={logo} alt="logo"/>
            </div>
            {/* 侧栏菜单 */}
            {rules.filter(item => item.pid === 0 && !item.hidden && ['route', 'menu'].includes(item.type)).map(rule => (
              <div
                key={rule.key}
                style={{
                  backgroundColor: menuSelectedKeys.at(-1) === rule.key ? token.colorPrimaryBg : 'transparent',
                  color: menuSelectedKeys.at(-1) === rule.key ? token.colorPrimary : themeConfig.siderColor,
                }}
                className={"flex items-center justify-center flex-col p-2 mb-2 pt-3 pb-3 cursor-pointer"}
                onClick={() => menuClick(rule)}
              >
                <IconFont name={rule.icon}/>
                <span className={"mt-1 truncate w-full text-center"}>{rule.local ? t(rule.local) : rule.name}</span>
              </div>
            ))}
          </div>

          <div style={{ width: themeConfig.siderWeight }}>
            <div className={"font-semibold text-[20px] text-center pt-2.5 pb-2.5"}>
              {title}
            </div>
            <MenuRender/>
          </div>
        </div>
      </Sider>
    </ConfigProvider>
  )
}

export default ColumnSiderRender