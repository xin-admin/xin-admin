import { Tabs, Card } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {useEffect, useState} from 'react';

const UserSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('/user/setting');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const tabsList = [
    {
      label: (
        <span className="flex items-center">
          <UserOutlined className="mr-2" />
          基本信息
        </span>
      ),
      key: '/user/setting',
    },
    {
      label: (
        <span className="flex items-center">
          <LockOutlined className="mr-2" />
          安全设置
        </span>
      ),
      key: '/user/setting/security',
    },
    {
      label: (
        <span className="flex items-center">
          <IdcardOutlined className="mr-2" />
          实名认证
        </span>
      ),
      key: '/user/setting/verification',
    },
    {
      label: (
        <span className="flex items-center">
          <IdcardOutlined className="mr-2" />
          登录日志
        </span>
      ),
      key: '/user/setting/loginlog',
    },
  ]

  return (
    <Card variant={"borderless"} title={'用户设置'} styles={{ body: {paddingInline: 0, display: "flex"} }}>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          navigate(key)
          setActiveTab(key)
        }}
        tabPosition="left"
        className="min-h-[500px]"
        defaultActiveKey="basic"
        items={tabsList}
      />
      <Outlet />
    </Card>
  );
};

export default UserSettingsPage;