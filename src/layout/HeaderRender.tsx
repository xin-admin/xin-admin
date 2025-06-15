import React, {useEffect, useState} from "react";
import {Breadcrumb, Button, ConfigProvider, Layout, Menu, type MenuProps} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";
import HeaderLeftRender from "@/layout/HeaderLeftRender";
import HeaderRightRender from "@/layout/HeaderRightRender";
import {buildMenu} from "@/layout/utils.ts";
import useAuthStore from "@/stores/user.ts";
import IconFont from "@/components/IconFont";

type MenuItem = Required<MenuProps>['items'][number];

const { Header } = Layout;

const HeaderRender: React.FC = () => {
    const menus = useAuthStore(state => state.menus)
    const collapsed = useGlobalStore(state => state.collapsed);
    const setCollapsed = useGlobalStore(state => state.setCollapsed);
    const setMixValue = useGlobalStore(state => state.setMixValue);
    const mixValue = useGlobalStore(state => state.mixValue);
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const breadcrumbItems = useGlobalStore(state => state.breadcrumbItems);
    const layout = useGlobalStore(state => state.layout);
    const [headMenu, setHeadMenu] = useState<MenuItem[]>();

    useEffect(() => {
        if(layout == 'top') {
            setHeadMenu(menus.map(item => buildMenu(item)!))
        }
    }, [menus, layout]);

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
                        <Breadcrumb items={breadcrumbItems}/>
                    )}
                    {layout == 'top' && (
                        <Menu
                            style={{ borderBottom: 'none' }}
                            defaultSelectedKeys={['1']}
                            mode="horizontal"
                            items={headMenu}
                        />
                    )}
                    {layout == 'mix' && (
                        <Menu
                            style={{ borderBottom: 'none' }}
                            defaultSelectedKeys={['1']}
                            mode="horizontal"
                            items={menus.map(item => ({
                                label: item.name,
                                icon: <IconFont name={item.icon} />,
                                key: item.key!,
                                path: item.path,
                            }))}
                            selectedKeys={[mixValue]}
                            onClick={(info) => setMixValue(info.key)}
                        />
                    )}
                </div>
                <HeaderRightRender/>
            </Header>
        </ConfigProvider>
    )
}

export default HeaderRender;