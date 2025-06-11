import {Outlet} from 'react-router';
import ClassicRender from "@/layout/LayoutRender/ClassicRender.tsx";

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

    return (
        <ClassicRender>
            <Outlet/>
        </ClassicRender>
    );
};

export default Layout;
