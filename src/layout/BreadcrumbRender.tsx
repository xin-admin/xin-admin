import {Breadcrumb, type BreadcrumbProps} from "antd";
import {useGlobalStore} from "@/stores";
import useAuthStore from "@/stores/user.ts";
import {useEffect, useState} from "react";
import {HomeOutlined} from "@ant-design/icons";
import IconFont from "@/components/IconFont";

const BreadcrumbRender = () => {

    const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
    const rules = useAuthStore(state => state.menus);
    const [items, setItems] = useState<BreadcrumbProps['items']>([]);

    useEffect(() => {
        const item: BreadcrumbProps['items'] = [
            {
                href: '/index',
                title: <HomeOutlined />,
            },
        ];

        menuSelectedKeys.slice().reverse().forEach(i => {
            const rule = rules.find(rule => rule.key === i);
            if(rule) {
                item?.push({
                    title: (
                        <>
                            <IconFont name={rule.icon}/>
                            <span>{rule.name}</span>
                        </>
                    ),
                })
            }
        })
        setItems(item);
    },[menuSelectedKeys, rules])

    return (
        <Breadcrumb items={items}/>
    )
}

export default BreadcrumbRender;