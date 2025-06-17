import {ConfigProvider, Menu, Layout, theme, type MenuProps} from "antd";
import {useGlobalStore} from "@/stores";
import React, {useEffect, useState} from "react";
import useAuthStore from "@/stores/user.ts";
import IconFont from "@/components/IconFont";
import transformMenus from "@/utils/transformMenus.ts";
import {useNavigate} from "react-router";
const {Sider} = Layout;
type MenuItem = Required<MenuProps>['items'][number];
const {useToken} = theme

const ColumnSiderRender: React.FC = () => {
    const navigate = useNavigate();
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const logo = useGlobalStore(state => state.logo);
    const title = useGlobalStore(state => state.title);
    const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
    const setMenuSelectedKeys = useGlobalStore(state => state.setMenuSelectedKeys);
    const rules = useAuthStore(state => state.menus);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const {token} = useToken();
    const [parentKeys, setParentKeys] =  useState(menuSelectedKeys[menuSelectedKeys.length-1]);

    useEffect(() => {
        const parentRule = rules.find(item => parentKeys === item.key)
        if(parentRule) {
            const menus = transformMenus(rules, parentRule.rule_id)
            setMenu(menus)
        }
    }, [rules, parentKeys])

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
                        {rules.filter(item => item.parent_id === 0).map(menu => (
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
                                        if(rule && !rules.find(item => item.parent_id === rule.rule_id)) {
                                            navigate(rule.path!)
                                        }
                                        setParentKeys(menu.key)
                                        setMenuSelectedKeys([menu.key])
                                    }
                                }}
                            >
                                <IconFont name={menu.icon}/>
                                <span className={"mt-1"}>{menu.name}</span>
                            </div>
                        ))}
                    </div>
                    { menu.length > 0 && (
                        <div className={"flex-auto"}>
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