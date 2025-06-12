import {Layout} from "antd";
import React from "react";
import {useGlobalStore} from "@/stores";
import HeaderRender from "@/layout/HeaderRender";
import SiderRender from "@/layout/SiderRender";
import FooterRender from "@/layout/FooterRender";

const { Content } = Layout;

const ClassicRender: React.FC<{children: React.ReactNode}> = (props) => {
    const {children} = props;
    const themeConfig = useGlobalStore(state => state.themeConfig);

    return (
        <Layout
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{background: themeConfig.background}}
        >
            <HeaderRender/>
            <Layout hasSider>
                <SiderRender/>
                <Layout className={"relative"}>
                    <Content>
                        {children}
                    </Content>
                    <FooterRender/>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default ClassicRender;
