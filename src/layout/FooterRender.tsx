import React from "react";
import {Layout} from "antd";
import {useGlobalStore} from "@/stores";
const { Footer } = Layout;

const FooterRender: React.FC = () => {

    const currentYear = new Date().getFullYear();
    const {themeConfig} = useGlobalStore();

    return (
        <Footer
            className={
                (themeConfig.fixedFooter ? 'fixed' : 'relative') +
                " bottom-0 border-t-1 border-solid z-10 w-full"
            }
            style={{borderTopColor: themeConfig.colorBorder}}
        >
            <div className={"flex items-center justify-center w-full"}>
                Xin Admin ©{currentYear} Created by xiaoliu
            </div>
        </Footer>
    );
};

export default FooterRender;
