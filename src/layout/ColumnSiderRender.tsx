import {ConfigProvider, Menu, Layout, theme, type MenuProps} from "antd";
import {useGlobalStore} from "@/stores";
import React, {useCallback, useEffect, useState} from "react";
import useAuthStore from "@/stores/user.ts";
import IconFont from "@/components/IconFont";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import type {IRule} from "@/domain/iRule.ts";
const {Sider} = Layout;
type MenuItem = Required<MenuProps>['items'][number];
const {useToken} = theme

const ColumnSiderRender: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const logo = useGlobalStore(state => state.logo);
    const title = useGlobalStore(state => state.title);
    const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
    const setMenuSelectedKeys = useGlobalStore(state => state.setMenuSelectedKeys);
    const rules = useAuthStore(state => state.rules);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const {token} = useToken();
    const [parentKeys, setParentKeys] =  useState(menuSelectedKeys[menuSelectedKeys.length-1]);

    const transformMenus = useCallback((rules: IRule[], pid: number = 0): MenuItem[] => {
        const menus: MenuItem[] = []
        rules.forEach((item) => {
            if (item.type === 'rule') return;
            if (item.pid !== pid) return;
            if (item.type === 'route') {
                menus.push({
                    label: item.local ? t(item.local) : item.name,
                    icon: <IconFont name={item.icon}/>,
                    key: item.key!,
                })
                return;
            }
            const children = transformMenus(rules, item.id);
            if(children &&  children.length > 0) {
                menus.push({
                    label: item.local ? t(item.local) : item.name,
                    icon: <IconFont name={item.icon}/>,
                    key: item.key!,
                    children
                })
            } else {
                menus.push({
                    label: item.local ? t(item.local) : item.name,
                    icon: <IconFont name={item.icon}/>,
                    key: item.key!,
                })
            }
        })
        return menus;
    }, [t])

    useEffect(() => {
        const parentRule = rules.find(item => parentKeys === item.key)
        if(parentRule) {
            const menus = transformMenus(rules, parentRule.id)
            setMenu(menus)
        }
    }, [rules, parentKeys, transformMenus])

    const menuClick: MenuProps['onClick'] = (data) => {
        setMenuSelectedKeys([...data.keyPath, parentKeys])
        const rule = rules.find(item => item.key === data.key)
        if(rule && rule.path) {
            navigate(rule.path!)
        }
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorTextBase: themeConfig.siderColor,
                },
                cssVar: true
            }}
        >
            <Sider width={menu.length > 0 ? themeConfig.siderWeight : '72px'}>
                <div
                    className={"overflow-auto h-screen sticky top-0 bottom-0 flex w-full"}
                    style={{
                        borderRight: (themeConfig.layoutBorder && menu.length > 0) ? "1px solid " + themeConfig.colorBorder : 'none',
                        color: themeConfig.siderColor,
                    }}
                >
                    <div
                        className={'w-[72px]'}
                        style={{ borderRight: "1px solid " + themeConfig.colorBorder }}
                    >
                        <div
                            className={"w-full flex items-center justify-center font-semibold text-[20px] mb-2"}
                            style={{height: themeConfig.headerHeight}}
                        >
                            <img className={"w-9"} src={logo} alt="logo"/>
                        </div>
                        {rules.filter(item => item.pid === 0).map(menu => (
                            <div
                                key={menu.key}
                                style={{
                                    backgroundColor: parentKeys === menu.key ? token.colorPrimaryBg : 'transparent',
                                    color: parentKeys === menu.key ? token.colorPrimary : themeConfig.siderColor,
                                }}
                                className={"flex flex-col p-2 items-center justify-center mb-2 pt-3 pb-3 cursor-pointer"}
                                onClick={() => {
                                    if(menu.key) {
                                        const rule = rules.find(item => item.key === menu.key);
                                        if(rule && !rules.find(item => item.pid === rule.id)) {
                                            navigate(rule.path!)
                                        }
                                        setParentKeys(menu.key)
                                        setMenuSelectedKeys([menu.key])
                                    }
                                }}
                            >
                                <IconFont name={menu.icon}/>
                                <span className={"mt-1 truncate w-full text-center"}>{menu.local ? t(menu.local) : menu.name}</span>
                            </div>
                        ))}
                    </div>
                    { menu.length > 0 && (
                        <div className={"flex-auto w-full"}>
                            <div
                                className={"w-full flex items-center justify-center font-semibold text-[20px]"}
                                style={{height: themeConfig.headerHeight}}
                            >
                                {title}
                            </div>
                            <Menu
                                selectedKeys={menuSelectedKeys}
                                mode="inline"
                                items={menu}
                                onClick={menuClick}
                            />
                        </div>
                    )}
                </div>
            </Sider>
        </ConfigProvider>
    )
}

export default ColumnSiderRender