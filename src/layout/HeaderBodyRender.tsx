import React from "react";
import {Breadcrumb, Button} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useGlobalStore} from "@/stores";

const HeaderBodyRender: React.FC = () => {
    const {collapsed, setCollapsed, breadcrumbItems} = useGlobalStore();

    return (
        <div className={"flex items-center flex-1"}>
            <Button
                type={'text'}
                className={'text-[16px] mr-2'}
                onClick={() => setCollapsed(!collapsed)}
            >
                { collapsed ?
                    <MenuUnfoldOutlined  />
                    :
                    <MenuFoldOutlined/>
                }
            </Button>
            <Breadcrumb items={breadcrumbItems}/>
        </div>
    )
}

export default HeaderBodyRender;