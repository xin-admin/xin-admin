import {GithubFilled, InfoCircleFilled, LogoutOutlined, QuestionCircleFilled,} from '@ant-design/icons';
import {ProConfigProvider, ProLayout, SettingDrawer,} from '@ant-design/pro-components';
import SearchInputRender from '@/layout/SearchInputRender';
import {useGlobalStore} from "@/stores";
import {Outlet, useNavigate} from 'react-router';
import useAuthStore from "@/stores/user.ts";
import {Dropdown, type MenuProps} from "antd";
import {useEffect, useState} from "react";

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

    const avatarMenuItem: MenuProps['items'] = [
        {
            key: 'logout',
            icon: <LogoutOutlined/>,
            label: '退出登录',
            onClick: async () => {
                await logout()
                navigate('/login', { replace: true })
            }
        },
    ]

    return (
        <ProConfigProvider hashed={false}>
            <ProLayout
                logo={logo}
                title={title}
                route={routes}
                // avatarProps={}
                actionsRender={() => [
                    <SearchInputRender/>,
                    <InfoCircleFilled key="InfoCircleFilled"/>,
                    <QuestionCircleFilled key="QuestionCircleFilled"/>,
                    <GithubFilled key="GithubFilled"/>,
                ]}
                avatarProps={{
                    src: user?.avatar_url,
                    size: 'small',
                    title: user?.nickname,
                    render: (_, dom) => (
                        <Dropdown menu={{items: avatarMenuItem}}>{dom}</Dropdown>
                    ),
                }}
                appList={appList}
                // menuFooterRender={}
                // onMenuHeaderClick={(e) => console.log(e)}
                // menuItemRender={}
                {...layoutSetting}
            >
                <Outlet/>
                <SettingDrawer
                    enableDarkTheme
                    settings={layoutSetting}
                    onSettingChange={(changeSetting) => {
                        setLayout(changeSetting);
                    }}
                    disableUrlParams={true}
                />
            </ProLayout>
        </ProConfigProvider>
    );
};

export default Layout;
