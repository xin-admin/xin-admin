import {Button, Dropdown, type MenuProps, Space} from "antd";
import {SettingOutlined,JavaScriptOutlined} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";
import {useTranslation} from "react-i18next";

const HeaderLeftRender = () => {
    const themeDrawer = useGlobalStore(state => state.themeDrawer);
    const setThemeDrawer = useGlobalStore(state => state.setThemeDrawer);
    const { i18n } = useTranslation();
    const items: MenuProps['items'] = [
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

    return (
        <Space>
            <Dropdown menu={{ items }}>
                <Button icon={<JavaScriptOutlined />} size={"large"} type={'text'}/>
            </Dropdown>
            <Button onClick={() => setThemeDrawer(!themeDrawer)} icon={<SettingOutlined/>} size={"large"} type={'text'}/>
            <div>admin</div>
        </Space>
    )
}

export default HeaderLeftRender