import {Card, Avatar, List, Badge, Tag, Divider, Typography, Space, Empty} from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  BellOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  SmileOutlined,
  AppstoreOutlined,
  ShopOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import useAuthStore from "@/stores/user.ts";
import type {ReactNode} from "react";
const { Meta } = Card;
const { Text, Title } = Typography;

interface AppType {
  id: number;
  name: string;
  description: string;
  icon: ReactNode;
  badge?: string;
  color: string;
}

const PersonalCenter = () => {
  // 用户信息数据
  const userInfo = useAuthStore(state => state.user);
  if (! userInfo ) return <></>;

  // 标签页列表数据
  const tabList = [
    {
      key: "projects",
      label: <><ProjectOutlined className={'mr-2'}/> 我的项目 </>,
    },
    {
      key: "teams",
      label: <><TeamOutlined className={'mr-2'}/> 我的团队 </>,
    },
    {
      key: "activities",
      label: <><ClockCircleOutlined className={'mr-2'}/> 最新动态 </>,
    },
    {
      key: "notifications",
      label: (
        <Badge count={1} offset={[10, 0]}>
          <span>
            <BellOutlined className={'mr-2'} />
            站内通知
          </span>
        </Badge>
      )
    },
  ]
  // 我的项目数据
  const projects = [
    {
      id: 1,
      name: '企业级管理系统',
      description: '基于React和AntDesign构建的企业后台管理系统',
      status: '进行中',
      progress: 65,
      members: 5,
    },
    {
      id: 2,
      name: '移动端H5应用',
      description: '使用Vue3开发的移动端电商应用',
      status: '已完成',
      progress: 100,
      members: 3,
    },
    {
      id: 3,
      name: '数据可视化平台',
      description: '基于ECharts的大数据可视化分析平台',
      status: '规划中',
      progress: 10,
      members: 2,
    },
    {
      id: 4,
      name: '系统升级通知',
      description: '系统将于本周五凌晨2:00-4:00进行升级维护',
      status: '2023-06-10',
      progress: 10,
      members: 2,
    },
    {
      id: 5,
      name: '团队邀请',
      description: '您已被邀请加入"新产品研发"项目组',
      status: '2023-06-08',
      progress: 15,
      members: 5,
    },
    {
      id: 6,
      name: '任务提醒',
      description: '您有3个任务即将到期，请及时处理',
      status: '2023-06-05',
      progress: 60,
      members: 3,
    },
  ];
  // APP 应用列表
  const apps: AppType[] = [
    {
      id: 1,
      name: '应用商店',
      icon: <AppstoreOutlined />,
      description: '应用分发与管理平台',
      badge: 'New',
      color: '#1890ff',
    },
    {
      id: 2,
      name: '商城系统',
      icon: <ShopOutlined />,
      description: '企业电商解决方案',
      color: '#52c41a',
    },
    {
      id: 3,
      name: '协作平台',
      icon: <TeamOutlined />,
      description: '团队协作与沟通工具',
      color: '#faad14',
    },
    {
      id: 4,
      name: '文档中心',
      icon: <FileTextOutlined />,
      description: '企业知识管理与文档协作',
      color: '#13c2c2',
    }
  ];
  // 获取当前时间问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '上午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };
  // APP 应用卡片
  const AppCard = (props: {app: AppType}) => (
    <Card
      hoverable
      variant={'borderless'}
      cover={
        <div
          className="flex items-center justify-center h-32"
          style={{ backgroundColor: `${props.app.color}20` }} // 20表示透明度
        >
          <Avatar
            icon={props.app.icon}
            size={64}
            style={{
              backgroundColor: props.app.color,
              color: '#fff',
              fontSize: '28px',
            }}
          />
        </div>
      }
    >
      <Meta
        title={<span className="font-semibold">{props.app.name}</span>}
        description={props.app.description}
      />
    </Card>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 左侧布局显示内容 */}
      <div className="lg:col-span-3 space-y-6">
        <Card variant={'borderless'} styles={{body: {padding: 0}}} className={'overflow-hidden'}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 flex items-center p-8">
            <Space size="large" className="w-full">
              <Avatar
                size={64}
                src={userInfo.avatar_url}
                icon={<SmileOutlined />}
                className="border-2 border-white shadow"
              />
              <div className="flex-1">
                <Title level={3} className="!text-white !mb-1">
                  {getGreeting()}，{userInfo.nickname}，欢迎回来！
                </Title>
                <Text className="text-white/80 text-lg">{userInfo.role_name}</Text>
              </div>
              <div className="hidden md:block">
                <Text className="text-white/80 text-lg">
                  今天是 {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
                </Text>
              </div>
            </Space>
          </div>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {apps.map((app) => (
            <div key={app.id}>
              { app.badge ?
                <Badge.Ribbon text={app.badge} color={app.color}>
                  <AppCard app={app}></AppCard>
                </Badge.Ribbon>
                :
                <AppCard app={app} ></AppCard>
              }
            </div>
          ))}
        </div>
        <Card variant={'borderless'} defaultActiveTabKey="projects" tabList={tabList}>
          <List
            itemLayout="horizontal"
            dataSource={projects}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<ProjectOutlined />} />}
                  title={<a href="#">{item.name}</a>}
                  description={item.description}
                />
                <div className="flex flex-col items-end">
                  <Tag color={item.status === '已完成' ? 'success' : item.status === '进行中' ? 'processing' : 'default'}>
                    {item.status}
                  </Tag>
                  <div className="mt-2">
                    <span className="text-gray-500 mr-2">进度: {item.progress}%</span>
                    <span className="text-gray-500">成员: {item.members}人</span>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* 右侧布局显示内容 */}
      <div className="lg:col-span-1">
        <Card variant={'borderless'} className="mb-5">
          <div className="flex flex-col items-center">
            <Avatar size={100} src={userInfo.avatar_url} className="mb-4" />
            <h2 className="text-xl font-bold mb-2">{userInfo.nickname}</h2>
            <p className="text-gray-600 mb-2">{userInfo.role_name}</p>
            <Tag color="blue" className="mb-4">
              {userInfo.dept_name}
            </Tag>
            <p className="text-gray-700 mb-2 text-center">hello</p>
            <Divider className="my-3 mb-4" />
            <div className="w-full space-y-3">
              <div className="flex items-center text-gray-600">
                <MailOutlined className="mr-2" />
                <span>{userInfo.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <PhoneOutlined className="mr-2" />
                <span>{userInfo.mobile}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <EnvironmentOutlined className="mr-2" />
                <span>本地</span>
              </div>
              <div className="flex items-center text-gray-600">
                <LinkOutlined className="mr-2" />
                <a target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  123
                </a>
              </div>
            </div>
          </div>
        </Card>
        <Card variant={'borderless'} title={'最近访问'}>
          <Empty/>
        </Card>
      </div>
    </div>
  );
};

export default PersonalCenter;