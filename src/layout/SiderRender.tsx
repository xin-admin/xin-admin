import {ConfigProvider, Layout, Menu, type MenuProps} from "antd";
import React, {useEffect, useState} from "react";
import {useGlobalStore} from "@/stores";
import useAuthStore from "@/stores/user.ts";
import transformMenus from "@/utils/transformMenus.ts";
import {useNavigate} from "react-router";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const SiderRender: React.FC = () => {
    const navigate = useNavigate();
    const rules = useAuthStore(state => state.menus)
    const collapsed = useGlobalStore(state => state.collapsed);
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const layout = useGlobalStore(state => state.layout);
    const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
    const setMenuSelectedKeys = useGlobalStore(state => state.setMenuSelectedKeys);
    const [menu, setMenu] = useState<MenuItem[]>([]);

    useEffect(() => {
        if(layout === 'side') {
            setMenu(transformMenus(rules))
            return;
        }
        if(layout === 'mix' && menuSelectedKeys) {
            const parentRule = rules.find(item => menuSelectedKeys[menuSelectedKeys.length-1] === item.key)
            if(parentRule) {
                const menus = transformMenus(rules, parentRule.rule_id)
                setMenu(menus)
            }
        }
    }, [rules, layout, menuSelectedKeys]);

    const menuClick: MenuProps['onClick'] = (data) => {
        const rule = rules.find(item => item.key === data.key)
        if(rule && rule.path) {
            navigate(rule.path!)
        }
        if(layout === 'mix') {
            setMenuSelectedKeys([...data.keyPath, menuSelectedKeys[menuSelectedKeys.length-1]])
        }else {
            setMenuSelectedKeys(data.keyPath)
        }
    }

    if(menu.length === 0) {
        return;
    }

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
                    <div style={{flex: "1 1 auto"}}>
                        <Menu
                            selectedKeys={menuSelectedKeys}
                            mode="inline"
                            items={menu}
                            onClick={menuClick}
                        />
                    </div>
                </div>
            </Sider>
        </ConfigProvider>
    )
}

export default SiderRender;