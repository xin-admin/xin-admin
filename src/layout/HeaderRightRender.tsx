import {Avatar, Button, Dropdown, type MenuProps, Space, message} from "antd";
import {SettingOutlined,TranslationOutlined, FullscreenExitOutlined, FullscreenOutlined} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";
import {useTranslation} from "react-i18next";
import useAuthStore from "@/stores/user";
import {useNavigate} from "react-router";
import {useState} from "react";

const HeaderLeftRender = () => {
    const navigate = useNavigate()
    const themeDrawer = useGlobalStore(state => state.themeDrawer);
    const setThemeDrawer = useGlobalStore(state => state.setThemeDrawer);
    const userInfo = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)
    const { i18n } = useTranslation();
    const [fullscreen, setFullscreen] = useState<boolean>(false);
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
        <Space>
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
    )
}

export default HeaderLeftRender