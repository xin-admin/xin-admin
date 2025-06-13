import React from "react";
import {Breadcrumb, Button, ConfigProvider, Layout, Menu} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";
import HeaderLeftRender from "@/layout/HeaderLeftRender";
import HeaderRightRender from "@/layout/HeaderRightRender";
const { Header } = Layout;

const HeaderRender: React.FC = () => {
    const collapsed = useGlobalStore(state => state.collapsed);
    const setCollapsed = useGlobalStore(state => state.setCollapsed);
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const breadcrumbItems = useGlobalStore(state => state.breadcrumbItems);
    const layout = useGlobalStore(state => state.layout);
    const siderMenus = useGlobalStore(state => state.siderMenus);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorTextBase: themeConfig.headerColor,
                },
            }}
        >
            <Header className={"flex sticky z-1 top-0 backdrop-blur-xs"}>
                <HeaderLeftRender/>
                { layout !== 'top' ?
                    <div className={"flex items-center flex-1"}>
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
                        <Breadcrumb items={breadcrumbItems}/>
                    </div>
                    :
                    <div className={"flex-1"}>
                        <Menu
                            defaultSelectedKeys={['1']}
                            mode="horizontal"
                            items={siderMenus}
                        />
                    </div>
                }
                <HeaderRightRender/>
            </Header>
        </ConfigProvider>
    )
}

export default HeaderRender;