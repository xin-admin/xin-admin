import {Button, Space} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";

const HeaderLeftRender = () => {
    const themeDrawer = useGlobalStore(state => state.themeDrawer);
    const setThemeDrawer = useGlobalStore(state => state.setThemeDrawer);

    return (
        <Space>
            <Button onClick={() => setThemeDrawer(!themeDrawer)} icon={<SettingOutlined/>} size={"large"} type={'text'}/>
            <div>admin</div>
        </Space>
    )
}

export default HeaderLeftRender