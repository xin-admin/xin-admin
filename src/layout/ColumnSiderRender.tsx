import {ConfigProvider, Menu, Layout, theme, type MenuProps} from "antd";
import {useGlobalStore} from "@/stores";
import React, {useEffect, useState} from "react";
import {buildMenu} from "@/layout/utils.ts";
import useAuthStore from "@/stores/user.ts";
import IconFont from "@/components/IconFont";
const {Sider} = Layout;
type MenuItem = Required<MenuProps>['items'][number];
const {useToken} = theme
const ColumnSiderRender: React.FC = () => {
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const logo = useGlobalStore(state => state.logo);
    const title = useGlobalStore(state => state.title);
    const mixValue = useGlobalStore(state => state.mixValue);
    const setMixValue = useGlobalStore(state => state.setMixValue);
    const menus = useAuthStore(state => state.menus);
    const [menu, setMenu] = useState<MenuItem[]>();
    const {token} = useToken();

    useEffect(() => {
        const mixMenu = menus.find(item => mixValue === item.key)
        if(mixMenu && mixMenu.children && mixMenu.children.length > 0) {
            setMenu(mixMenu.children.map(item => buildMenu(item)!))
        }
    }, [menus, mixValue])
    
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorTextBase: themeConfig.siderColor,
                },
                cssVar: true
            }}
        >
            <Sider width={themeConfig.siderWeight}>
                <div
                    className={"overflow-auto h-screen sticky top-0 bottom-0 flex w-full"}
                    style={{
                        borderRight: themeConfig.layoutBorder ? "1px solid " + themeConfig.colorBorder : 'none',
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
                        {menus.map(menu => (
                            <div
                                style={{
                                    backgroundColor: mixValue === menu.key ? token.colorPrimaryBg : 'transparent',
                                    color: mixValue === menu.key ? token.colorPrimary : themeConfig.siderColor,
                                }}
                                className={"flex flex-col p-2 items-center justify-center mb-2 pt-3 pb-3 cursor-pointer"}
                                onClick={() => setMixValue(menu.key!)}
                            >
                                <IconFont name={menu.icon}/>
                                <span className={"mt-1"}>{menu.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className={"flex-auto"}>
                        <div
                            className={"w-full flex items-center justify-center font-semibold text-[20px]"}
                            style={{height: themeConfig.headerHeight}}
                        >
                            {title}
                        </div>
                        <Menu
                            defaultSelectedKeys={['1']}
                            mode="inline"
                            items={menu}
                        />
                    </div>
                </div>
            </Sider>
        </ConfigProvider>
    )
}


export default ColumnSiderRender