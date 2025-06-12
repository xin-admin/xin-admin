import React from 'react';
import {SearchOutlined, UserOutlined} from '@ant-design/icons';
import {AutoComplete, Button, Flex, Input} from 'antd';
import {useGlobalStore} from "@/stores";

const SiderTopRender: React.FC = () => {

    const collapsed = useGlobalStore((state) => state.collapsed);


    const Title: React.FC<Readonly<{ title?: string }>> = (props) => (
        <Flex align="center" justify="space-between">
            {props.title}
            <a href="https://www.google.com/search?q=antd" target="_blank" rel="noopener noreferrer">
                more
            </a>
        </Flex>
    );

    const renderItem = (title: string, count: number) => ({
        value: title,
        label: (
            <Flex align="center" justify="space-between">
                {title}
                <span>
        <UserOutlined /> {count}
      </span>
            </Flex>
        ),
    });

    const options = [
        {
            label: <Title title="Libraries" />,
            options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
        },
        {
            label: <Title title="Solutions" />,
            options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
        },
        {
            label: <Title title="Articles" />,
            options: [renderItem('AntDesign design language', 100000)],
        },
    ];

    return (
        <div className={"mb-2 p-1"} style={{flex: "0 0 auto"}}>
            { !collapsed ?
                <AutoComplete
                    popupMatchSelectWidth={500}
                    options={options}
                >
                    <Input.Search size={'large'} placeholder="input here" />
                </AutoComplete>
                :
                <Button icon={<SearchOutlined/>} className={"w-full"}></Button>
            }
        </div>
    )
}

export default SiderTopRender;