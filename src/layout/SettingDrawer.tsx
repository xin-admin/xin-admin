import React from 'react';
import {debounce} from 'lodash';
import {Button, Col, ColorPicker, Divider, Drawer, InputNumber, Row, Select, Switch, theme, Tooltip} from 'antd';
import {useGlobalStore} from "@/stores";
import {configTheme, darkColorTheme, defaultColorTheme, greenColorTheme, pinkColorTheme} from "@/layout/theme.ts";
import {algorithmOptions} from "@/layout/algorithm.ts";
import useAuthStore from "@/stores/user.ts";

const {useToken} = theme;

// 主题配置项
const THEME_CONFIGS = [
  {key: 'colorPrimary', label: '主色'},
  {key: 'colorText', label: '基础文字颜色'},
  {key: 'colorBg', label: '基础背景颜色'},
  {key: 'colorSuccess', label: '成功色'},
  {key: 'colorWarning', label: '警告色'},
  {key: 'colorError', label: '错误色'},
  {key: 'bodyBg', label: '内容区域背景色'},
  {key: 'footerBg', label: '页脚背景色'},
  {key: 'headerBg', label: '头部背景色'},
  {key: 'headerColor', label: '头部文字颜色'},
  {key: 'siderBg', label: '侧边栏背景色'},
  {key: 'siderColor', label: '侧边栏文字颜色'},
  {key: 'colorBorder', label: '布局边框颜色'},
];

// 风格配置项
const STYLE_CONFIGS = [
  {key: 'fixedFooter', label: '固定页脚', type: 'switch'},
  {key: 'motion', label: '开启动画', type: 'switch'},
  {key: 'layoutBorder', label: '开启边框', type: 'switch'},
  {key: 'borderRadius', label: '圆角大小', type: 'number', min: 0, max: 30},
  {key: 'controlHeight', label: '基础控件高度', type: 'number', min: 0},
  {key: 'headerPadding', label: '头部两侧内边距', type: 'number', min: 0},
  {key: 'headerHeight', label: '头部高度', type: 'number', min: 0},
  {key: 'siderWeight', label: '侧边栏宽度', type: 'number', min: 0},
  {key: 'bodyPadding', label: '内容区域内边距', type: 'number', min: 0},
];

// 预设主题列表
const THEME_LIST = [
  {background: '/theme/default.svg', name: 'light', title: '默认'},
  {background: '/theme/dark.svg', name: 'dark', title: '暗黑'},
  {background: '/theme/pink.svg', name: 'pink', title: '桃花缘'},
  {background: '/theme/green.svg', name: 'green', title: '知识协作'},
];

// 布局配置
const LAYOUT_CONFIGS = [
  {
    key: 'side', title: '左侧导航', render: (token: any) => (
      <>
        <div className="rounded-sm w-full h-6 mb-1.5" style={{background: token.colorPrimaryBorder}}/>
        <div className="flex">
          <div className="rounded-sm h-16 w-6" style={{background: token.colorPrimary}}/>
          <div className="rounded-sm flex-1 ml-1.5" style={{background: token.colorPrimaryBg}}/>
        </div>
      </>
    )
  },
  {
    key: 'top', title: '顶部导航', render: (token: any) => (
      <>
        <div className="rounded-sm h-6 w-full mb-1.5" style={{background: token.colorPrimary}}/>
        <div className="rounded-sm h-16" style={{background: token.colorPrimaryBg}}/>
      </>
    )
  },
  {
    key: 'mix', title: '混合导航', render: (token: any) => (
      <>
        <div className="rounded-sm w-full h-6 mb-1.5" style={{background: token.colorPrimary}}/>
        <div className="flex">
          <div className="rounded-sm h-16 w-6" style={{background: token.colorPrimary}}/>
          <div className="rounded-sm flex-1 ml-1.5" style={{background: token.colorPrimaryBg}}/>
        </div>
      </>
    )
  },
  {
    key: 'columns', title: '双栏导航', render: (token: any) => (
      <div className="flex">
        <div className="rounded-sm mr-1.5 w-3 h-24" style={{background: token.colorPrimary}}/>
        <div className="rounded-sm mr-1.5 w-6 h-24" style={{background: token.colorPrimaryHover}}/>
        <div className="rounded-sm flex-auto h-24" style={{background: token.colorPrimaryBg}}/>
      </div>
    )
  },
];

const SettingDrawer: React.FC = () => {
  const {token} = useToken();
  const themeDrawer = useGlobalStore(state => state.themeDrawer);
  const setThemeDrawer = useGlobalStore(state => state.setThemeDrawer);
  const setThemeConfig = useGlobalStore(state => state.setThemeConfig);
  const themeConfig = useGlobalStore(state => state.themeConfig);
  const layout = useGlobalStore(state => state.layout);
  const setLayout = useGlobalStore(state => state.setLayout);
  const localRoute = useAuthStore(state => state.localRoute);
  const setLocalRoute = useAuthStore(state => state.setLocalRoute);
  const getUserInfo = useAuthStore(state => state.getInfo);

  // 防抖更新主题配置
  const changeSetting = debounce((key: string, value: any) => {
    setThemeConfig({...themeConfig, [key]: value});
  }, 300, {leading: true, trailing: false});

  // 切换路由
  const changeLocaleRoute = async (value: boolean) => {
    await setLocalRoute(value)
    await getUserInfo()
  }

  // 处理主题切换
  const handleThemeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('[data-theme]');
    if (!target) return;

    const themeName = (target as HTMLElement).dataset.theme;
    const themeMap = {
      dark: darkColorTheme,
      light: defaultColorTheme,
      pink: pinkColorTheme,
      green: greenColorTheme,
    };

    if (themeMap[themeName as keyof typeof themeMap]) {
      setThemeConfig({...themeConfig, ...themeMap[themeName as keyof typeof themeMap]});
    }
  };

  // 重置主题
  const resetTheme = () => {
    setThemeConfig({...configTheme, ...defaultColorTheme});
  };

  return (
    <Drawer
      styles={{body: {paddingTop: 10}}}
      placement="right"
      closable={false}
      onClose={() => setThemeDrawer(false)}
      open={themeDrawer}
      width={392}
      footer={(
        <div className="flex w-full justify-between">
          <Button onClick={resetTheme}>重置主题</Button>
          <Button type="primary">保存主题</Button>
        </div>
      )}
    >
      {/* 布局样式 */}
      <Divider>布局样式</Divider>
      <Row gutter={[20, 20]}>
        {LAYOUT_CONFIGS.map(({key, title, render}) => (
          <Col span={12} key={key}>
            <Tooltip title={title}>
              <div
                className="p-2 rounded-lg cursor-pointer"
                style={{
                  boxShadow: token.boxShadow,
                  borderRadius: token.borderRadius,
                  border: layout === key ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
                }}
                onClick={() => setLayout(key as any)}
              >
                {render(token)}
              </div>
            </Tooltip>
          </Col>
        ))}
      </Row>

      {/* 预设主题 */}
      <Divider>预设主题</Divider>
      <Row gutter={20} onClick={handleThemeChange}>
        {THEME_LIST.map((item) => (
          <Col span={8} key={item.name} className="mb-2.5">
            <div
              data-theme={item.name}
              className="cursor-pointer overflow-hidden border-solid"
              style={{
                borderRadius: token.borderRadius,
                borderWidth: themeConfig.themeScheme === item.name ? '2px' : '0px',
                borderColor: themeConfig.themeScheme === item.name ? token.colorPrimary : 'transparent'
              }}
            >
              <img src={item.background} alt={item.name}/>
            </div>
            <div className="text-center mt-1.5">{item.title}</div>
          </Col>
        ))}
        <Col span={24} className="mb-2.5">
          <div className="flex justify-between items-center">
            <div>主题算法</div>
            <Select
              value={themeConfig.algorithm}
              style={{ width: 160 }}
              onChange={(value) => changeSetting('algorithm', value)}
              options={algorithmOptions}
            />
          </div>
        </Col>
      </Row>

      {/* 主题颜色 */}
      <Divider>主题颜色</Divider>
      {THEME_CONFIGS.map(({key, label}) => (
        <div key={key} className="flex justify-between items-center mb-2.5">
          <div>{label}</div>
          <ColorPicker
            showText
            value={themeConfig[key as keyof typeof themeConfig] as string}
            onChange={(value) => changeSetting(key, value.toCssString())}
          />
        </div>
      ))}

      {/* 风格配置 */}
      <Divider>风格配置</Divider>
      {STYLE_CONFIGS.map(({key, label, type, ...rest}) => (
        <div key={key} className="flex justify-between items-center mb-2.5">
          <div>{label}</div>
          {type === 'switch' ? (
            <Switch
              value={themeConfig[key as keyof typeof themeConfig] as boolean}
              onChange={(value) => changeSetting(key, value)}
            />
          ) : (
            <InputNumber
              value={themeConfig[key as keyof typeof themeConfig] as number}
              onChange={(value) => changeSetting(key, value)}
              {...rest}
            />
          )}
        </div>
      ))}

      {/* 系统配置 */}
      <Divider>系统配置</Divider>
      <div className="flex justify-between items-center mb-2.5">
        <div>本地菜单路由</div>
        <Switch
          value={localRoute}
          onChange={changeLocaleRoute}
        />
      </div>
    </Drawer>
  );
};

export default SettingDrawer;