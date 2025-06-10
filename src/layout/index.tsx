import {useGlobalStore} from "@/stores";
import {Outlet, useNavigate} from 'react-router';
import useAuthStore from "@/stores/user.ts";
import type {MenuProps} from "antd";
import React, {useEffect, useState} from "react";
import ClassicRender from "@/layout/LayoutRender/ClassicRender.tsx";

interface RouterTypes {
    path: string;
    children: Array<{
        icon?: string;
        name?: string;
        path?: string;
        // 可选二级菜单
        children?: RouterTypes['children'];
    }>;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Option 1', '1',),
    getItem('Option 2', '2'),
    getItem('User', 'sub1', [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9'),
];

const Layout = () => {
    const navigate = useNavigate()
    const {logo, title, appList, layoutSetting, setLayout} = useGlobalStore();
    const {user, token, menus, getInfo, logout} = useAuthStore();
    const [routes, setRoute] = useState<RouterTypes>();

    useEffect(() => {
        if(!token) {
            navigate('/login', { replace: true })
        }else {
            getInfo()
        }
        setRoute({
            path: '/',
            children: menus.map((item) => ({
                // icon: item.icon,
                name: item.name,
                path: item.path,
                children: item.children?.map((child) => ({
                    // icon: child.icon,
                    name: child.name,
                    path: child.path,
                })),
            })),
        })
    }, [getInfo, navigate, token]);

    // const avatarMenuItem: MenuProps['items'] = [
    //     {
    //         key: 'logout',
    //         icon: <LogoutOutlined/>,
    //         label: '退出登录',
    //         onClick: async () => {
    //             await logout()
    //             navigate('/login', { replace: true })
    //         }
    //     },
    // ]

    return (
        <ClassicRender menus={items}>
            <Outlet />
        </ClassicRender>
    );
};

export default Layout;
