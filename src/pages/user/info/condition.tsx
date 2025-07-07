import { ProList } from '@ant-design/pro-components';
import { Space, Tag } from 'antd';
import { useState } from 'react';

const defaultData = [
    {
        id: '1',
        name: 'XinAdmin 经历了三年的变化',
        image: 'https://file.xinadmin.cn/file/favicons.ico',
        desc: '我是一条测试的描述',
    },
    {
        id: '2',
        name: 'Ant Design',
        image:
            'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        desc: '我是一条测试的描述',
    },
    {
        id: '3',
        name: '小刘同学',
        image:
            'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        desc: '我是一条测试的描述',
    },
    {
        id: '4',
        name: 'Ant Design',
        image: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        desc: '我是一条测试的描述',
    },
    {
        id: '5',
        name: 'Laravel 是最好的 Web 框架',
        image: 'https://laravel.com/img/favicon/favicon.ico',
        desc: '我是一条测试的描述',
    },
    {
        id: '4',
        name: 'ThinkPHP 是国内最好的 PHP 框架',
        image: 'https://doc.thinkphp.cn/lfs/55efb6ec3a68586bf4d3894849be6eeb456d80d29c1458984e636bb1d2e346dc.dat',
        desc: '我是一条测试的描述',
    },
];

type DataItem = (typeof defaultData)[number];

const Condition = () => {
    const [dataSource, setDataSource] = useState<DataItem[]>(defaultData);
    return (
        <ProList<DataItem>
            rowKey="id"
            dataSource={dataSource}
            showActions="hover"
            editable={{
                onSave: async (key, record, originRow) => {
                    console.log(key, record, originRow);
                    return true;
                },
            }}
            cardProps={{
                bodyStyle: {padding: 0}
            }}
            onDataSourceChange={setDataSource}
            metas={{
                title: {
                    dataIndex: 'name',
                },
                avatar: {
                    dataIndex: 'image',
                    editable: false,
                },
                description: {
                    dataIndex: 'desc',
                },
                subTitle: {
                    render: () => {
                        return (
                            <Space size={0}>
                                <Tag color="blue">XinAdmin</Tag>
                                <Tag color="#5BD8A6">科技</Tag>
                            </Space>
                        );
                    },
                },
                actions: {
                    render: (_text, row, _index, action) => [
                        <a
                            onClick={() => {
                                action?.startEditable(row.id);
                            }}
                            key="link"
                        >
                            编辑
                        </a>,
                    ],
                },
            }}
        />
    );
};

export default  Condition;