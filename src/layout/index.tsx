import {GithubFilled, InfoCircleFilled, QuestionCircleFilled,} from '@ant-design/icons';
import {ProConfigProvider, ProLayout, SettingDrawer,} from '@ant-design/pro-components';
import SearchInputRender from '@/layout/SearchInputRender';
import {useGlobalStore} from "@/stores";
import {Outlet} from 'react-router';

const Layout = () => {
    const {logo, title, layoutSetting, setLayout} = useGlobalStore();

    return (
        <ProConfigProvider hashed={false}>
            <ProLayout
                logo={logo}
                title={title}
                // avatarProps={}
                actionsRender={() => [
                    <SearchInputRender/>,
                    <InfoCircleFilled key="InfoCircleFilled"/>,
                    <QuestionCircleFilled key="QuestionCircleFilled"/>,
                    <GithubFilled key="GithubFilled"/>,
                ]}
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