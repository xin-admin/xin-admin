import {ConfigProvider, Layout, Menu, type MenuProps} from "antd";
import React, {useEffect, useState} from "react";
import {useGlobalStore} from "@/stores";
import SiderTopRender from "@/layout/SiderTopRender.tsx";
import SiderBottomRender from "@/layout/SiderBottomRender.tsx";
import useAuthStore from "@/stores/user.ts";
import {buildMenu} from "@/layout/utils.ts";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const SiderRender: React.FC = () => {
    const menus = useAuthStore(state => state.menus)
    const collapsed = useGlobalStore(state => state.collapsed);
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const layout = useGlobalStore(state => state.layout);
    const mixValue = useGlobalStore(state => state.mixValue);
    const [menu, setMenu] = useState<MenuItem[]>();

    useEffect(() => {
        if(layout === 'side') {
            setMenu(menus.map(item => buildMenu(item)!))
            return;
        }
        if(layout === 'mix' && mixValue) {
            const mixMenu = menus.find(item => mixValue === item.key)
            if(mixMenu && mixMenu.children && mixMenu.children.length > 0) {
                setMenu(mixMenu.children.map(item => buildMenu(item)!))
            }
        }
    }, [menus, layout, mixValue]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorTextBase: themeConfig.siderColor,
                },
            }}
        >
            <Sider
                collapsed={collapsed}
                width={themeConfig.siderWeight}
                className={"p-2.5 sticky overflow-auto bottom-0 backdrop-blur-xs"}
                style={{
                    top: themeConfig.headerHeight,
                    height: `calc(100vh - ${themeConfig.headerHeight}px)`,
                    borderRight: themeConfig.layoutBorder ? '1px solid ' +  themeConfig.colorBorder : 'none',
                }}
            >
                <div className="flex flex-col min-h-full">
                    <SiderTopRender/>
                    <div style={{flex: "1 1 auto"}}>
                        <Menu
                            defaultSelectedKeys={['1']}
                            mode="inline"
                            items={menu}
                        />
                    </div>
                    <SiderBottomRender/>
                </div>
            </Sider>
        </ConfigProvider>
    )
}

export default SiderRender;