import { Card, Divider, Tag, Timeline, Avatar } from 'antd';
import {
  InfoCircleOutlined,
  LinkOutlined,
  HistoryOutlined,
  UserOutlined,
  FileTextOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined
} from '@ant-design/icons';

const SystemInfoPage = () => {
  // 系统基本信息
  const systemInfo = [
    { label: '系统名称', value: 'XinAdmin' },
    { label: '版本号', value: 'v1' },
    { label: '构建时间', value: '2025-7-25' },
    { label: '前端框架', value: 'React 18' },
    { label: 'UI框架', value: 'Ant Design 5' },
    { label: 'CSS框架', value: 'TailwindCSS 4' },
  ];

  // 项目地址
  const projectLinks = [
    { name: 'GitHub仓库', url: 'https://github.com/xin-admin/xin-admin', icon: <GithubOutlined /> },
    { name: 'Gitee仓库', url: 'https://gitee.com/xin-admin/xin-admin', icon: <GithubOutlined /> },
    { name: '文档地址', url: 'https://xinadmin.cn/ui', icon: <FileTextOutlined /> },
    { name: '演示地址', url: 'https://ui.xinadmin.cn', icon: <LinkOutlined /> },
  ];

  // 更新日志
  const changelog = [
    { time: '2025-07-20', version: 'v1.0.1', content: '优化系统菜单栏' },
    { time: '2025-07-22', version: 'v1.0.2', content: '更新依赖版本' },
    { time: '2025-07-25', version: 'v1.0.3', content: '新增权限管理模块' },
  ];

  // 作者信息
  const authorInfo = {
    name: '小刘同学',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: '软件开发工程师',
    contact: [
      { type: 'GitHub', value: 'https://github.com/xineny' },
      { type: '邮箱', value: '2302563948@qq.com' },
      { type: '微信', value: '*******' },
      { type: 'QQ', value: '2302563948' },
    ],
  };

  // 系统描述
  const systemDescription = `
    XinAdmin是基于React和Ant Design构建的中后台管理系统，集成了用户管理、权限控制、数据可视化等功能模块。
    采用现代化的前端技术栈，具有良好的扩展性和可维护性。系统设计遵循最佳实践，代码结构清晰，适合作为企业级应用的起点。
  `;

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">系统信息</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 系统基本信息卡片 */}
        <Card
          variant={'borderless'}
          title={
            <div className="flex items-center">
              <InfoCircleOutlined className="mr-2 text-blue-500" />
              <span>系统基本信息</span>
            </div>
          }
        >
          <div className="space-y-3">
            {systemInfo.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{item.label}:</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
          <Divider className="my-4" />
          <div className="flex flex-wrap gap-2">
            <Tag color="pink">XinAdmin</Tag>
            <Tag color="blue">React</Tag>
            <Tag color="geekblue">Ant Design</Tag>
            <Tag color="cyan">TailwindCSS</Tag>
            <Tag color="purple">TypeScript</Tag>
          </div>
        </Card>

        {/* 项目地址卡片 */}
        <Card
          variant={'borderless'}
          title={
            <div className="flex items-center">
              <LinkOutlined className="mr-2 text-green-500" />
              <span>项目地址</span>
            </div>
          }
        >
          <div className="space-y-3">
            {projectLinks.map((link, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2 text-gray-500">{link.icon}</span>
                <span className="text-gray-600 mr-2">{link.name}:</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {link.url}
                </a>
              </div>
            ))}
          </div>
          <Divider className="my-4" />
          <div className="text-sm text-gray-500">
            请根据实际项目情况修改以上链接
          </div>
        </Card>

        {/* 更新日志卡片 */}
        <Card
          variant={'borderless'}
          title={
            <div className="flex items-center">
              <HistoryOutlined className="mr-2 text-orange-500" />
              <span>更新日志</span>
            </div>
          }
        >
          <Timeline mode="left" className="mt-4">
            {changelog.map((log, index) => (
              <Timeline.Item key={index} label={log.time}>
                <div className="font-medium">{log.version}</div>
                <div className="text-gray-600">{log.content}</div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        {/* 作者介绍卡片 */}
        <Card
          variant={'borderless'}
          title={
            <div className="flex items-center">
              <UserOutlined className="mr-2 text-purple-500" />
              <span>作者介绍</span>
            </div>
          }
        >
          <div className="flex items-center mb-4">
            <Avatar
              src={authorInfo.avatar}
              size={64}
              className="mr-4 border-2 border-purple-200"
            />
            <div>
              <h3 className="text-lg font-bold">{authorInfo.name}</h3>
              <p className="text-gray-600">{authorInfo.role}</p>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="space-y-3">
            {authorInfo.contact.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="w-16 text-gray-600">{item.type}:</span>
                <span className="font-medium">
                  {item.type === 'GitHub' ? (
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : item.value}
                </span>
                {item.type === '微信' && <WechatOutlined className="ml-2 text-green-500" />}
                {item.type === 'QQ' && <QqOutlined className="ml-2 text-blue-500" />}
              </div>
            ))}
          </div>
        </Card>

        {/* 系统描述卡片 */}
        <Card
          variant={'borderless'}
          title={
            <div className="flex items-center">
              <FileTextOutlined className="mr-2 text-indigo-500" />
              <span>系统描述</span>
            </div>
          }
          className="md:col-span-2 lg:col-span-1"
        >
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {systemDescription}
            </p>
          </div>
          <Divider className="my-4" />
          <div className="flex justify-center space-x-4">
            <Tag color="magenta">企业级</Tag>
            <Tag color="red">高性能</Tag>
            <Tag color="volcano">可扩展</Tag>
            <Tag color="gold">现代化</Tag>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemInfoPage;