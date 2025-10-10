import {
  AlipayOutlined,
  LockOutlined,
  QqOutlined,
  TaobaoOutlined,
  UserOutlined,
  WechatOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import { LoginFormPage, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Divider, message, Space } from 'antd';
import {type CSSProperties, useEffect} from 'react';
import React from 'react';
import useAuthStore from "@/stores/user.ts";
import {useNavigate} from "react-router";
import type {IAdminLoginParams} from "@/domain/iSysUser.ts";

const iconStyle: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};
const iconDivStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: 40,
  width: 40,
  border: '1px solid #D4D8DD',
  borderRadius: '50%',
};

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { getInfo, login, token, user } = useAuthStore()

  useEffect(() => {
    if(token && user) {
      console.log("已登录，路由重定向！")
      navigate('/', { replace: true })
    }
  }, [token, user, navigate]);

  const handleSubmit = async (values: IAdminLoginParams) => {
    try {
      // 登录
      const loginStatus = await login(values);
      if(loginStatus) {
        await getInfo();
        message.success('登录成功！');
        navigate('/', { replace: true })
      }
    } catch {
      console.error('登录失败');
    }
    return;
  };

  return (
    <LoginFormPage
      backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
      // backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
      logo={'https://file.xinadmin.cn/file/favicons.ico'}
      title={'Xin Admin'}
      subTitle={'用技术改变世界'}
      actions={
        <>
          <Divider plain>其他登录方式</Divider>
          <Space align="center" size={24} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={iconDivStyle}>
              <QqOutlined style={{ ...iconStyle, color: 'rgb(123, 212, 239)' }} />
            </div>
            <div style={iconDivStyle}>
              <WechatOutlined style={{ ...iconStyle, color: 'rgb(51, 204, 0)' }} />
            </div>
            <div style={iconDivStyle}>
              <AlipayOutlined style={{ ...iconStyle, color: '#1677FF' }} />
            </div>
            <div style={iconDivStyle}>
              <TaobaoOutlined style={{ ...iconStyle, color: '#FF6A10' }} />
            </div>
            <div style={iconDivStyle}>
              <WeiboOutlined style={{ ...iconStyle, color: '#e71f19' }} />
            </div>
          </Space>
        </>
      }
      onFinish={handleSubmit}
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={'prefixIcon'} />,
        }}
        placeholder={'用户名: admin'}
        rules={[{ required: true, message: '请输入用户名!' }]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        placeholder={'密码: 123456'}
        rules={[{ required: true, message: '请输入密码！' }]}
      />
      <div style={{ marginBlockEnd: 24 }}>
        <ProFormCheckbox noStyle name="autoLogin">自动登录</ProFormCheckbox>
        <a style={{ float: 'right' }}>忘记密码</a>
      </div>
    </LoginFormPage>
  );
};

export default Login;
