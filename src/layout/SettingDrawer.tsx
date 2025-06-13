import React from 'react';
import { debounce } from 'lodash';
import {Button, Col, ColorPicker, Divider, Drawer, InputNumber, Row, Switch, theme, Tooltip} from 'antd';
import {useGlobalStore} from "@/stores";
import {darkColorTheme, defaultColorTheme, pinkColorTheme, greenColorTheme, configTheme} from "@/layout/theme.ts";
const { useToken } = theme;

const SettingDrawer: React.FC = () => {
    const themeDrawer = useGlobalStore(state => state.themeDrawer);
    const setThemeDrawer = useGlobalStore(state => state.setThemeDrawer);
    const setTheme = useGlobalStore(state => state.setTheme);
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const layout = useGlobalStore(state => state.layout);
    const setLayout = useGlobalStore(state => state.setLayout);

    const onClose = () => {
        setThemeDrawer(false);
    };

    const { token } = useToken();

    const themeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        // 检查点击的是否是带有 data-theme 的子元素
        const target = (e.target as HTMLElement).closest('[data-theme]');
        if (!target) {
            return;
        }
        const theme=  (target as HTMLElement).dataset.theme;

        if(theme === 'dark') {
            setTheme({...themeConfig, ...darkColorTheme});
        }
        if (theme === 'light') {
            setTheme({...themeConfig, ...defaultColorTheme});
        }
        if (theme === 'pink') {
            setTheme({...themeConfig, ...pinkColorTheme})
        }
        if (theme === 'green') {
            setTheme({...themeConfig, ...greenColorTheme})
        }
    }

    const themeList = [
        {
            background: '/theme/default.svg',
            name: 'light',
            title: '默认',
        },
        {
            background: '/theme/dark.svg',
            name: 'dark',
            title: '暗黑',
        },
        {
            background: '/theme/pink.svg',
            name: 'pink',
            title: '桃花缘',
        },
        {
            background: '/theme/green.svg',
            name: 'green',
            title: '知识协作',
        }
    ]

    const changeSetting = debounce((key: string, value: string | boolean | number | null ) => {
        setTheme({
            ...themeConfig,
            [key]: value,
        });
    }, 300, {
        leading: true,
    });

    // 重置主题
    const rechangeSetting = () => {
        setTheme({
            ...configTheme,
            ...defaultColorTheme,
        });
    }

    return (
        <Drawer
            styles={{body: {paddingTop: 10}}}
            placement={'right'}
            closable={false}
            onClose={onClose}
            open={themeDrawer}
            width={392}
            footer={(
                <div className={'flex w-full justify-between'}>
                    <Button onClick={rechangeSetting}>重置主题</Button>
                    <Button type={"primary"}>保存主题</Button>
                </div>
            )}
        >
            <Divider>布局样式</Divider>
            <Row gutter={[20, 20]}>
                <Col span={12}>
                    <Tooltip title="左侧导航">
                        <div
                            className="p-2 rounded-lg cursor-pointer"
                            style={{
                                boxShadow: token.boxShadow,
                                borderRadius: token.borderRadius,
                                border: layout === 'side' ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
                            }}
                            onClick={() => setLayout('side')}
                        >
                            <div className="rounded-sm w-full h-6 mb-1.5" style={{background: token.colorPrimaryBorder}}></div>
                            <div className="flex">
                                <div className="rounded-sm h-16 w-6" style={{background: token.colorPrimary}}></div>
                                <div className="rounded-sm flex-1 ml-1.5"
                                     style={{background: token.colorPrimaryBg}}>
                                </div>
                            </div>
                        </div>
                    </Tooltip>
                </Col>
                <Col span={12}>
                    <Tooltip title="顶部导航">
                        <div
                            className="p-2 rounded-lg cursor-pointer"
                            style={{
                                boxShadow: token.boxShadow,
                                borderRadius: token.borderRadius,
                                border: layout === 'top' ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
                            }}
                            onClick={() => setLayout('top')}
                        >
                            <div className={"rounded-sm h-6 w-full mb-1.5"} style={{background: token.colorPrimary}}></div>
                            <div className={"rounded-sm h-16"} style={{background: token.colorPrimaryBg}}></div>
                        </div>
                    </Tooltip>
                </Col>
                <Col span={12}>
                    <Tooltip title="混合导航">
                        <div
                            className="p-2 rounded-lg cursor-pointer"
                            style={{
                                boxShadow: token.boxShadow,
                                borderRadius: token.borderRadius,
                                border: layout === 'mix' ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
                            }}
                            onClick={() => setLayout('mix')}
                        >
                            <div className="rounded-sm w-full h-6 mb-1.5" style={{background: token.colorPrimary}}></div>
                            <div className="flex">
                                <div className="rounded-sm h-16 w-6" style={{background: token.colorPrimary}}></div>
                                <div className="rounded-sm flex-1 ml-1.5"
                                     style={{background: token.colorPrimaryBg}}>
                                </div>
                            </div>
                        </div>
                    </Tooltip>
                </Col>
                <Col span={12}>
                    <Tooltip title="双栏导航">
                        <div
                            className="p-2 rounded-lg cursor-pointer flex"
                            style={{
                                boxShadow: token.boxShadow,
                                borderRadius: token.borderRadius,
                                border: layout === 'columns' ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
                            }}
                            onClick={() => setLayout('columns')}
                        >
                            <div className={"rounded-sm mr-1.5 w-3 h-24"} style={{background: token.colorPrimary}}></div>
                            <div className={"rounded-sm mr-1.5 w-6 h-24"} style={{background: token.colorPrimaryHover}}></div>
                            <div className={"rounded-sm flex-auto h-24"} style={{background: token.colorPrimaryBg}}></div>
                        </div>
                    </Tooltip>
                </Col>
            </Row>
            <Divider>预设主题</Divider>
            <Row gutter={20} onClick={themeChange}>
                {themeList.map((item) => (
                    <Col span={8} key={item.name} className={'mb-2.5'}>
                        <div
                            data-theme={item.name}
                            className={'cursor-pointer overflow-hidden border-solid'}
                            style={{
                                borderRadius: token.borderRadius,
                                borderWidth: themeConfig.themeScheme === item.name ? '2px' : '0px',
                                borderColor: themeConfig.themeScheme === item.name ? token.colorPrimary : 'transparent'
                            }}
                        >
                            <img src={item.background} alt={item.name} />
                        </div>
                        <div className={'text-center mt-1.5'}>{item.title}</div>
                    </Col>
                ))}
            </Row>
            <Divider>主题颜色</Divider>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>主色</div>
                <ColorPicker
                    showText
                    value={themeConfig.colorPrimary}
                    onChange={(value) => changeSetting('colorPrimary', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>基础文字颜色</div>
                <ColorPicker
                    showText
                    value={themeConfig.colorText}
                    onChange={(value) => changeSetting('colorText', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>基础背景颜色</div>
                <ColorPicker
                    showText
                    value={themeConfig.colorBg}
                    onChange={(value) => changeSetting('colorBg', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>成功色</div>
                <ColorPicker
                    showText
                    value={themeConfig.colorSuccess}
                    onChange={(value) => changeSetting('colorSuccess', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>警告色</div>
                <ColorPicker
                    showText
                    value={themeConfig.colorWarning}
                    onChange={(value) => changeSetting('colorWarning', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>错误色</div>
                <ColorPicker
                    showText
                    value={themeConfig.colorError}
                    onChange={(value) => changeSetting('colorError', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>内容区域背景色</div>
                <ColorPicker
                    showText
                    value={themeConfig.bodyBg}
                    onChange={(value) => changeSetting('bodyBg', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>页脚背景色</div>
                <ColorPicker
                    showText
                    value={themeConfig.footerBg}
                    onChange={(value) => changeSetting('footerBg', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>头部背景色</div>
                <ColorPicker
                    showText
                    value={themeConfig.headerBg}
                    onChange={(value) => changeSetting('headerBg', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>头部文字颜色</div>
                <ColorPicker
                    showText
                    value={themeConfig.headerColor}
                    onChange={(value) => changeSetting('headerColor', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>侧边栏背景色</div>
                <ColorPicker
                    showText
                    value={themeConfig.siderBg}
                    onChange={(value) => changeSetting('siderBg', value.toCssString())}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>侧边栏文字颜色</div>
                <ColorPicker
                    showText
                    value={themeConfig.siderColor}
                    onChange={(value) => changeSetting('siderColor', value.toCssString())}
                />
            </div>
            <Divider>风格配置</Divider>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>固定页脚</div>
                <Switch
                    value={themeConfig.fixedFooter}
                    onChange={(value) => changeSetting('fixedFooter', value)}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>开启动画</div>
                <Switch
                    value={themeConfig.motion}
                    onChange={(value) => changeSetting('motion', value)}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>圆角大小</div>
                <InputNumber
                    min={0}
                    max={30}
                    value={themeConfig.borderRadius}
                    onChange={(value) => changeSetting('borderRadius', value)}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>基础控件高度</div>
                <InputNumber
                    min={0}
                    value={themeConfig.controlHeight}
                    onChange={(value) => changeSetting('controlHeight', value)}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>头部两侧内边距</div>
                <InputNumber
                    min={0}
                    value={themeConfig.headerPadding}
                    onChange={(value) => changeSetting('headerPadding', value)}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>头部高度</div>
                <InputNumber
                    min={0}
                    value={themeConfig.headerHeight}
                    onChange={(value) => changeSetting('headerHeight', value)}
                />
            </div>
            <div className={'flex justify-between items-center mb-2.5'}>
                <div>侧边栏宽度</div>
                <InputNumber
                    min={0}
                    value={themeConfig.siderWeight}
                    onChange={(value) => changeSetting('siderWeight', value)}
                />
            </div>
        </Drawer>
    );
};

export default SettingDrawer;