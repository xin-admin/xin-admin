import {
  AlipayOutlined,
  LockOutlined,
  QqOutlined,
  TaobaoOutlined,
  UserOutlined,
  WechatOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Col, Divider, message, Row, Space } from 'antd';
import {type CSSProperties, useEffect} from 'react';
import React from 'react';
import useAuthStore from "@/stores/user.ts";
import {useNavigate} from "react-router";
import type { LoginParams } from '@/api/sys/sysUser';

const bodyStyle: CSSProperties = {
  backgroundImage: 'url(/public/static/bg.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
};
const loginBodyStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  position: 'relative',
};
const loginCardStyle: CSSProperties = { 
  background: 'white', 
  borderRadius: '16px', 
  overflow: 'hidden', 
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  padding: '40px 20px',
  position: 'relative',
};
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
  const { login, token, user } = useAuthStore()

  useEffect(() => {
    if(token && user) {
      console.log("已登录，路由重定向！");
      window.location.href = '/';
    }
  }, [token, user, navigate]);

  const handleSubmit = async (values: LoginParams) => {
    await login(values);
    message.success('登录成功！');
    window.location.href = '/';
  };

  return (
    <Row style={bodyStyle}>
      <Col lg={12} xs={24} style={loginBodyStyle}>
        <div style={loginCardStyle}>
          <LoginForm
            logo={'https://file.xinadmin.cn/file/favicons.ico'}
            title={'Xin Admin'}
            subTitle={'用技术改变世界'}
            layout='vertical'
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
              label="用户名"
              fieldProps={{
                size: 'large',
                variant: "filled",
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'admin'}
              rules={[{ required: true, message: '请输入用户名!' }]}
            />
            <ProFormText.Password
              name="password"
              label="密码"
              fieldProps={{
                size: 'large',
                variant: "filled",
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'123456'}
              rules={[{ required: true, message: '请输入密码！' }]}
            />
            <div style={{ marginBlockEnd: 24 }}>
              <ProFormCheckbox noStyle name="remember">保持登录</ProFormCheckbox>
              <a style={{ float: 'right' }}>忘记密码</a>
            </div>
          </LoginForm>
        </div>
      </Col>
      <Col lg={12} xs={24}></Col>
    </Row>
    
  );
};

export default Login;
