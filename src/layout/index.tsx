import React from 'react';
// import { Breadcrumb, Layout, Menu, theme } from 'antd';
// import {Outlet} from "react-router";
// import FooterRender from './FooterRender';
import SiderRender from "@/layout/LayoutRender/ClassicRender.tsx";

// const { Header, Content } = Layout;
//
// const items = Array.from({ length: 15 }).map((_, index) => ({
//     key: index + 1,
//     label: `nav ${index + 1}`,
// }));

const App: React.FC = () => {
    // const {
    //     token: { colorBgContainer, borderRadiusLG },
    // } = theme.useToken();

    return (
        <SiderRender/>
    );
};

export default App;
