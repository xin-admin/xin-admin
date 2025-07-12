import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { Tag } from 'antd';

interface DataType {
  id: number;
  name: string;
  tags: string[];
  image: string;
  desc: string;
}

const dataSource: DataType[] = [
  {
    id: 1,
    name: 'XinAdmin 经历了三年的变化',
    tags: ['XinAdmin', '小刘同学'],
    image: 'https://file.xinadmin.cn/file/favicons.ico',
    desc: '从2020年，我就开始研究属于自己的一套软件，当时只是在简单的做前端，研究一些有意思的Demo，慢慢的通过三年的技术积累，并且对AntDesign组件库的深入了解，我决定自己手搓一套框架，作为下一个软件项目的开始，XinAdmin至此诞生。',
  },
  {
    id: 2,
    name: 'Ant Design 的优势在哪里？',
    tags: ['XinAdmin', 'ant design', '小刘同学'],
    image: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '作为一个用过很多个前端UI组件库的老手来说，前端UI眼花缭乱，真正想好好的做一个项目，一开始就要面临选择困难症，我该用哪一个组件库呢？AntDesign无疑是万花丛中开的最艳丽的一朵牡丹，组件丰富、文档完善、企业级应用、稳定性强、自定义度高等很多有点让它成为下一个Admin的最佳选择！',
  },
  {
    id: 3,
    name: 'Laravel 是宇宙最好的Web框架',
    tags: ['XinAdmin', 'laravel', '小刘同学'],
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '如果你是一名全栈工程师，你让我给你推荐一款Web框架，我一点都不会犹豫的说：“Laravel”，开发者友好的原则，让你在开发过程中简直不要太舒服，你想要的任何扩展它都给你准备的一应俱全，甚至可以说，它是软件时代WEB工匠的一门艺术品。',
  },
];

const Article = () => {
  return (
    <ProList<DataType>
      cardProps={{
        bodyStyle: {padding: 0}
      }}
      itemLayout="vertical"
      rowKey="id"
      dataSource={dataSource}
      metas={{
        title: {
          render: (_, data) => data.name
        },
        description: {
          render: (_, data) => data.tags.map(str => <Tag>{str}</Tag>),
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
          render: (_: never, data: DataType) => (
            <img
              width={130}
              alt="logo"
              src={data.image}
            />
          ),
        },
        content: {
          render: (_, data ) => {
            return (
              <div>
                { data.desc }
              </div>
            );
          },
        },
      }}
    />
  );
};

export default Article;