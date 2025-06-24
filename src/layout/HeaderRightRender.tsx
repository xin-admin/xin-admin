import {Avatar, Button, Dropdown, type MenuProps, Modal, Space, message, Input, Empty, theme} from "antd";
import {
    SettingOutlined,
    TranslationOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    SearchOutlined,
    ArrowUpOutlined,
    EnterOutlined,
    ArrowDownOutlined,
    GithubOutlined,
    HomeOutlined
} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";
import {useTranslation} from "react-i18next";
import useAuthStore from "@/stores/user";
import {useNavigate} from "react-router";
import {useState} from "react";
const { useToken } = theme;

const HeaderLeftRender = () => {
    const navigate = useNavigate()
    const themeDrawer = useGlobalStore(state => state.themeDrawer);
    const setThemeDrawer = useGlobalStore(state => state.setThemeDrawer);
    const userInfo = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)
    const { i18n } = useTranslation();
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [searchOpen, setSearch] = useState<boolean>(false);
    const { token } = useToken();
    const onFullscreenClick = () => {
        /* 获取 documentElement (<html>) 以全屏显示页面 */
        const elem = document.documentElement;
        /* 全屏查看 */
        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => {
                setFullscreen(false);
            });
        } else {
            elem.requestFullscreen().then(() => {
                setFullscreen(true);
            });
        }
    };


    const localesItems: MenuProps['items'] = [
        {
            key: '1',
            label: '简体中文',
            onClick: () => i18n.changeLanguage('zh'),
        },
        {
            key: '2',
            label: 'English',
            onClick: () => i18n.changeLanguage('en'),
        },
        {
            key: '3',
            label: '日本語です',
            onClick: () => i18n.changeLanguage('jp'),
        },
    ];
    const userItems: MenuProps['items'] = [
        {
            key: '1',
            label: '退出登录',
            onClick: () => {
                logout().then(() => {
                    message.success("退出成功，正在跳转")
                    navigate('/login', { replace: true })
                }).catch(() => {
                    message.error("退出登录失败")
                })
            },
        },
    ]

    return (
        <>
            <Modal
                closable={false}
                open={searchOpen}
                maskClosable
                footer={null}
                style={{ top: 40 }}
                styles={{content: {padding: 0, width: 600, maxHeight: '80vh'}}}
                onCancel={() => setSearch(false)}
            >
                <div className={'p-5'}>
                    <Input size="large" placeholder="Please enter the search content" prefix={<SearchOutlined />} />
                    <div className={'mt-5'}>
                        <Empty />
                    </div>
                </div>
                <Space className={'mt-5 flex align-center pl-5 pr-5 pt-2.5 pb-2.5'} style={{ borderTop: '1px solid ' + token.colorBorder }}>
                    <EnterOutlined /> <span className={'mr-4'}>Confirm</span>
                    <ArrowUpOutlined /><ArrowDownOutlined /> <span className={'mr-4'}>Switch</span>
                    <span className={'mr-2'}>Close</span>
                </Space>
            </Modal>
            <Space>
                <Button icon={<HomeOutlined />} size={'large'} type={'text'} onClick={() => window.open('https://xin-admin.com')}/>
                <Button icon={<GithubOutlined />} size={'large'} type={'text'} onClick={() => window.open('https://github.com/xin-admin/xin-admin-ui')}/>
                <Button icon={<SearchOutlined/>} size={'large'} type={'text'} onClick={() => setSearch(true)} />
                <Button
                    onClick={onFullscreenClick}
                    icon={ fullscreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
                    size={"large"}
                    type={'text'}
                />
                <Dropdown menu={{ items: localesItems }}>
                    <Button icon={<TranslationOutlined />} size={"large"} type={'text'}/>
                </Dropdown>
                <Button onClick={() => setThemeDrawer(!themeDrawer)} icon={<SettingOutlined/>} size={"large"} type={'text'}/>
                { userInfo ?
                    <Dropdown menu={{ items: userItems }}>
                        <Button size={"large"} type={'text'}>
                            <div>{ userInfo.nickname || userInfo.username }</div>
                            <Avatar src={userInfo.avatar_url} size={'small'}/>
                        </Button>
                    </Dropdown>
                    : null
                }
            </Space>
        </>
    )
}

export default HeaderLeftRender