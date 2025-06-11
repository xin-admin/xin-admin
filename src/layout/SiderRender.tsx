import {Layout, Menu} from "antd";
import React from "react";
import {useGlobalStore} from "@/stores";
import SiderTopRender from "@/layout/SiderTopRender.tsx";
import SiderBottomRender from "@/layout/SiderBottomRender.tsx";

const { Sider } = Layout;

const SiderRender: React.FC = () => {
    const {collapsed, siderMenus, themeConfig} = useGlobalStore();

    return (
        <Sider
            collapsed={collapsed}
            width={themeConfig.siderWeight}
            className={"p-2.5 border-r-1 border-solid sticky overflow-auto bottom-0"}
            style={{
                borderRightColor: themeConfig.colorBorder,
                top: themeConfig.headerHeight,
                height: `calc(100vh - ${themeConfig.headerHeight}px)`,
            }}
        >
            <div className="flex flex-col min-h-full">
                <SiderTopRender/>
                <div style={{flex: "1 1 auto"}}>
                    <Menu
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        items={siderMenus}
                    />
                </div>
                <SiderBottomRender/>
            </div>
        </Sider>
    )
}

export default SiderRender;