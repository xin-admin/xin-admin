import React from 'react';
import { Button, Drawer, Dropdown, Space, type MenuProps } from 'antd';
import { useGlobalStore } from '@/stores';
import MenuRender from '@/layout/MenuRender';
import { GithubOutlined, HomeOutlined, SettingOutlined, TranslationOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

/**
 * 移动端抽屉菜单组件
 * 在移动端设备上显示抽屉式侧边菜单
 */
const MobileDrawerMenu: React.FC = () => {
  const isMobile = useGlobalStore(state => state.isMobile);
  const {t, i18n} = useTranslation();
  const mobileMenuOpen = useGlobalStore(state => state.mobileMenuOpen);
  const setMobileMenuOpen = useGlobalStore(state => state.setMobileMenuOpen);
  const themeConfig = useGlobalStore(state => state.themeConfig);
  const themeDrawer = useGlobalStore(state => state.themeDrawer);
  const setThemeDrawer = useGlobalStore(state => state.setThemeDrawer);
  /** 语言切换按钮事件 */
  const onLocationClick = async (lng: string) => {
    // 设置 i18n 语言
    await i18n.changeLanguage(lng);
    // 存储到 localStorage
    localStorage.setItem('i18nextLng', lng);
  }

  const localesItems: MenuProps['items'] = [
    {
      key: '1',
      label: '简体中文',
      onClick: () => onLocationClick('zh'),
    },
    {
      key: '2',
      label: 'English',
      onClick: () => onLocationClick('en'),
    },
    {
      key: '3',
      label: '日本語です',
      onClick: () => onLocationClick('jp'),
    },
    {
      key: '4',
      label: 'Français',
      onClick: () => onLocationClick('fr'),
    },
    {
      key: '5',
      label: 'Русский',
      onClick: () => onLocationClick('ru'),
    },
  ];

  // 如果不是移动端，不渲染此组件
  if (!isMobile) {
    return null;
  }

  const handleClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Drawer
      placement="left"
      closable={true}
      onClose={handleClose}
      open={mobileMenuOpen}
      width={280}
      styles={{
        header: {
          borderBottom: themeConfig.layoutBorder ? '1px solid ' + themeConfig.colorBorder : 'none',
          background: themeConfig.siderBg,
          color: themeConfig.siderColor,
        },
        body: {
          padding: 0,
          background: themeConfig.siderBg,
        },
      }}
      footer={(
        <Space>
          <Button icon={<HomeOutlined/>} size={'large'} type={'text'}
                  onClick={() => window.open('https://xin-admin.com')}/>
          <Button icon={<GithubOutlined/>} size={'large'} type={'text'}
                  onClick={() => window.open('https://github.com/xin-admin/xin-admin-ui')}/>
          <Dropdown menu={{items: localesItems}}>
            <Button icon={<TranslationOutlined/>} size={"large"} type={'text'}/>
          </Dropdown>
          <Button onClick={() => setThemeDrawer(!themeDrawer)} icon={<SettingOutlined/>} size={"large"} type={'text'}/>
        </Space>
      )}
    >
      <div 
        style={{
          height: '100%',
          overflowY: 'auto',
          background: themeConfig.siderBg,
        }}
      >
        <MenuRender />
      </div>
    </Drawer>
  );
};

export default MobileDrawerMenu;