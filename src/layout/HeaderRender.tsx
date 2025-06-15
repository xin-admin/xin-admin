import React, {useEffect, useState} from "react";
import {Button, ConfigProvider, Layout, Menu, type MenuProps} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";
import HeaderLeftRender from "@/layout/HeaderLeftRender";
import HeaderRightRender from "@/layout/HeaderRightRender";
import {transformMenus} from "@/layout/utils.ts";
import useAuthStore from "@/stores/user.ts";
import IconFont from "@/components/IconFont";
import {useNavigate} from "react-router";
import BreadcrumbRender from "@/layout/BreadcrumbRender.tsx";

type MenuItem = Required<MenuProps>['items'][number];

const { Header } = Layout;

const HeaderRender: React.FC = () => {
    const navigate = useNavigate();
    const rules = useAuthStore(state => state.menus)
    const collapsed = useGlobalStore(state => state.collapsed);
    const setCollapsed = useGlobalStore(state => state.setCollapsed);
    const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
    const setMenuSelectedKeys = useGlobalStore(state => state.setMenuSelectedKeys);
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const layout = useGlobalStore(state => state.layout);
    const [headMenu, setHeadMenu] = useState<MenuItem[]>([]);
    const [parentKeys, setParentKeys] =  useState(menuSelectedKeys[menuSelectedKeys.length-1]);

    useEffect(() => {
        if(layout == 'top') {
            const menus = transformMenus(rules, 0)
            setHeadMenu(menus)
        }
    }, [rules, layout]);

    const menuClick: MenuProps['onClick'] = (data) => {
        navigate(data.key)
        if(layout === 'mix') {
            setMenuSelectedKeys([...data.keyPath, menuSelectedKeys[menuSelectedKeys.length-1]])
        }else {
            setMenuSelectedKeys(data.keyPath)
        }
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorTextBase: themeConfig.headerColor,
                },
                components: {
                    Menu: {
                        activeBarBorderWidth: 0,
                        itemBg: 'transparent',
                    }
                },
                cssVar: true
            }}
        >
            <Header
                className={"flex sticky z-1 top-0 backdrop-blur-xs"}
                style={{
                    borderBottom: themeConfig.layoutBorder ? '1px solid ' +  themeConfig.colorBorder : 'none',
                }}
            >
                {layout !== 'columns' && <HeaderLeftRender/>}
                <div className="flex-1 flex items-center">
                    {['mix', 'side'].includes(layout) && (
                        <Button
                            type={'text'}
                            className={'text-[16px] mr-2'}
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            { collapsed ?
                                <MenuUnfoldOutlined  />
                                :
                                <MenuFoldOutlined/>
                            }
                        </Button>
                    )}
                    {['columns', 'side'].includes(layout) && (
                        <BreadcrumbRender/>
                    )}
                    {layout == 'top' && (
                        <Menu
                            style={{ borderBottom: 'none' }}
                            mode="horizontal"
                            items={headMenu}
                            selectedKeys={menuSelectedKeys}
                            onClick={menuClick}
                        />
                    )}
                    {layout == 'mix' && (
                        <Menu
                            style={{ borderBottom: 'none' }}
                            mode="horizontal"
                            items={rules.filter(item => item.parent_id === 0).map(item => ({
                                label: item.name,
                                icon: <IconFont name={item.icon} />,
                                key: item.key!,
                                path: item.path,
                            }))}
                            selectedKeys={[parentKeys]}
                            onClick={(info) => {
                                const rule = rules.find(item => item.key === info.key);
                                if(rule && !rules.find(item => item.parent_id === rule.rule_id)) {
                                    navigate(rule.path!)
                                }
                                setParentKeys(info.key)
                                setMenuSelectedKeys([info.key])
                            }}
                        />
                    )}
                </div>
                <HeaderRightRender/>
            </Header>
        </ConfigProvider>
    )
}

export default HeaderRender;