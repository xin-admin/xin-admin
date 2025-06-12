import {Outlet} from 'react-router';
import ClassicRender from "@/layout/LayoutRender/ClassicRender.tsx";
import SettingDrawer from "@/layout/SettingDrawer.tsx";
import {useGlobalStore} from "@/stores";
import {ConfigProvider, theme as antTheme, type ThemeConfig} from "antd";
import {useMemo} from "react";

// interface RouterTypes {
//     path: string;
//     children: Array<{
//         icon?: string;
//         name?: string;
//         path?: string;
//         // 可选二级菜单
//         children?: RouterTypes['children'];
//     }>;
// }

const Layout = () => {
    // const navigate = useNavigate()
    // const {logo, title, appList, layoutSetting, setLayout} = useGlobalStore();
    // const {user, token, menus, getInfo, logout} = useAuthStore();
    // const [routes, setRoute] = useState<RouterTypes>();

    // useEffect(() => {
    //     if(!token) {
    //         navigate('/login', { replace: true })
    //     }else {
    //         getInfo()
    //     }
    //     setRoute({
    //         path: '/',
    //         children: menus.map((item) => ({
    //             // icon: item.icon,
    //             name: item.name,
    //             path: item.path,
    //             children: item.children?.map((child) => ({
    //                 // icon: child.icon,
    //                 name: child.name,
    //                 path: child.path,
    //             })),
    //         })),
    //     })
    // }, [getInfo, navigate, token]);

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

    const themeConfig = useGlobalStore(state => state.themeConfig);

    const theme: ThemeConfig = useMemo(() => ({
        components: {
            Layout: {
                headerPadding: "0 " + themeConfig.headerPadding + "px",
                headerHeight: themeConfig.headerHeight,
                bodyBg: themeConfig.bodyBg,
                footerBg: themeConfig.footerBg,
                headerBg: themeConfig.headerBg,
                headerColor: themeConfig.headerColor,
                siderBg: themeConfig.siderBg,
            },
            Menu: {
                activeBarBorderWidth: 0,
                itemBg: 'transparent',
            }
        },
        token: {
            colorPrimary: themeConfig.colorPrimary,
            colorBgBase: themeConfig.colorBg,
            colorTextBase: themeConfig.colorText,
            colorError: themeConfig.colorError,
            colorInfo: themeConfig.colorPrimary,
            colorLink: themeConfig.colorPrimary,
            colorSuccess: themeConfig.colorSuccess,
            colorWarning: themeConfig.colorWarning,
            borderRadius: themeConfig.borderRadius,
            controlHeight: themeConfig.controlHeight,
            colorBorder: themeConfig.colorBorder,
            motion: false,
        },
        algorithm: themeConfig.themeScheme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
    }), [themeConfig])

    return (
        <ConfigProvider theme={{...theme, cssVar: true}}>
            <ClassicRender>
                <SettingDrawer></SettingDrawer>
                <Outlet/>
            </ClassicRender>
        </ConfigProvider>
    );
};

export default Layout;
