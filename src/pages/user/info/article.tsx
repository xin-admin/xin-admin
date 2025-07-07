import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { Tag } from 'antd';

const dataSource = [
    {
        title: '语雀的天空',
    },
    {
        title: 'Ant Design',
    },
    {
        title: '蚂蚁金服体验科技',
    },
    {
        title: 'TechUI',
    },
];

const Article = () => {
    return (
        <ProList<{ title: string }>
            cardProps={{
                bodyStyle: {padding: 0}
            }}
            itemLayout="vertical"
            rowKey="id"
            dataSource={dataSource}
            metas={{
                title: {},
                description: {
                    render: () => (
                        <>
                            <Tag>语雀专栏</Tag>
                            <Tag>设计语言</Tag>
                            <Tag>蚂蚁金服</Tag>
                        </>
                    ),
                },
                actions: {
                    render: () => [
                        <span className={'mr-2'}>
                            <StarOutlined/>
                            156
                        </span>,
                        <span className={'mr-2'}>
                            <MessageOutlined/>
                            156
                        </span>,
                        <span className={'mr-2'}>
                            <LikeOutlined/>
                            156
                        </span>,
                    ],
                },
                extra: {
                    render: () => (
                        <img
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                    ),
                },
                content: {
                    render: () => {
                        return (
                            <div>
                                段落示意：蚂蚁金服设计平台
                                design.alipay.com，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台
                                design.alipay.com，用最小的工作量，无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。
                            </div>
                        );
                    },
                },
            }}
        />
    );
};

export default Article;