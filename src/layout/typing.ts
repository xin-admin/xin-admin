/**
 * @name OtherColor
 * @description 其他色
 */
interface OtherColor {
    /**
     * @name info
     * @description 信息色
     * @type string
     * @defaultValue "#646cff"
     */
    info: string;
    /**
     * @name success
     * @description 成功色
     * @type string
     * @defaultValue "#52c41a"
     */
    success: string;
    /**
     * @name warning
     * @description 警告色
     * @type string
     * @defaultValue "#faad14"
     */
    warning: string;
    /**
     * @name error
     * @description 错误色
     * @type string
     * @defaultValue "#f5222d"
     */
    error: string;
}

/**
 * @name LayoutConfig
 * @description 布局
 */
interface LayoutConfig {
    /**
     * @name mode
     * @description 布局模式
     */
    mode: "horizontal-mix" | "vertical" | "mix" |"horizontal" ;
    /**
     * @name scrollMode
     * @description 滚动模式
     * @type "content" | "page"
     */
    scrollMode: "content" | "page";
    /**
     * @name reverseHorizontalMix
     * @description 水平混合布局是否反转
     * @defaultValue false
     */
    reverseHorizontalMix: boolean;
}

/**
 * @name PageConfig
 * @description 页面配置
 */
interface PageConfig {
    /**
     * @name animate
     * @description 页面切换动画
     */
    animate:true,
    /**
     * @name animateMode
     * @description 页面切换动画模式
     */
    animateMode:"fade-slide"
}

/**
 * @name WatermarkConfig
 * @description 水印配置
 */
interface WatermarkConfig {
    /**
     * @name text
     * @description 水印文字
     */
    text: string;
    /**
     * @name visible
     * @description 水印是否可见
     */
    visible: boolean;
}

/**
 * @name HeaderConfig
 * @description 头部配置
 */
interface HeaderConfig {
    /**
     * @name height
     * @description 高度
     * @default 56
     */
    height: number;
    /**
     * @name breadcrumb
     * @description 面包屑配置
     */
    breadcrumb: {
        /**
         * @name visible
         * @description 面包屑是否可见
         * @default true
         */
        visible:true,
        /**
         * @name showIcon
         * @description 面包屑是否显示图标
         * @default true
         */
        showIcon:true
    }
}

/**
 * @name tab
 * @description tab配置
 */
interface TabConfig {
    /**
     * @name visible
     * @description tab是否可见
     * @default true
     * @type boolean
     */
    visible:boolean;
    /**
     * @name cache
     * @description 是否缓存tab
     * @default true
     * @type boolean
     */
    cache: boolean;
    /**
     * @name height
     * @description tab的高度
     * @default 44
     * @type number
     */
    height: number;
    /**
     * @name mode
     * @description tab的模式
     * @default chrome
     * @type "chrome" | "outlined"
     */
    mode: "chrome" | "outlined";
}

/**
 * @name SiderConfig
 * @description 侧边菜单栏配置
 */
interface SiderConfig {
    /**
     * @name visible
     * @description 是否显示侧边栏
     * @default true
     * @type boolean
     */
    inverted: boolean;
    /**
     * @name width
     * @description 侧边栏宽度
     * @default 220
     * @type number
     */
    width: number;
    /**
     * @name collapsedWidth
     * @description 侧边栏收起宽度
     * @default 64
     * @type number
     */
    collapsedWidth: number;
    /**
     * @name mixWidth
     * @description 混合模式下侧边栏宽度
     * @default 90
     * @type number
     */
    mixWidth: number;
    /**
     * @name mixChildMenuWidth
     * @description 混合模式下子菜单宽度
     * @default 200
     * @type number
     */
    mixCollapsedWidth: number;
    /**
     * @name mixChildMenuWidth
     * @description 混合模式下子菜单宽度
     * @default 200
     * @type number
     */
    mixChildMenuWidth: number;
}

interface FooterConfig {
    /**
     * @name visible
     * @description 是否显示页脚
     * @default true
     * @type boolean
     */
    visible: boolean;
    /**
     * @name fixed
     * @description 是否固定页脚
     * @default false
     * @type boolean
     */
    fixed: boolean;
    /**
     * @name right
     * @description 是否在右侧显示
     * @default true
     * @type boolean
     */
    right: boolean;
    /**
     * @name height
     * @description 页脚高度
     * @default 48
     * @type number
     */
    height: number;
}

export type ThemeProps = {
    /**
     * @name themeScheme
     * @description 主题
     * @defaultValue "light"
     */
    themeScheme: "light" | "dark" |  "auto";
    /**
     * @name grayscale
     * @description 灰色模式
     * @defaultValue false
     * @type boolean
     */
    grayscale: boolean;
    /**
     * @name colourWeakness
     * @description 色弱模式
     * @defaultValue false
     * @type boolean
     */
    colourWeakness: boolean;
    /**
     * @name recommendColor
     * @description 应用推荐色
     * @defaultValue false
     * @type boolean
     */
    recommendColor: boolean;
    /**
     * @name themeColor
     * @description 主题色
     * @defaultValue "#646cff"
     * @type string
     */
    themeColor: string;
    /**
     * @name otherColor
     * @description 其他色
     * @type OtherColor
     */
    otherColor: OtherColor;
    /**
     * @name isInfoFollowPrimary
     * @description 信息色是否跟随主色
     * @defaultValue true
     * @type boolean
     */
    isInfoFollowPrimary: boolean;
    /**
     * @name resetCacheStrategy
     * @description 重置缓存策略
     * @defaultValue "close"
     * @type "close" | "reload"
     */
    resetCacheStrategy: "close" | "reload";
    /**
     * @name layout
     * @description 布局
     * @type LayoutConfig
     */
    layout: LayoutConfig;
    /**
     * @name page
     * @description 页面配置
     * @type PageConfig
     */
    page: PageConfig;
    /**
     * @name header
     * @description 头部配置
     * @type HeaderConfig
     */
    header: HeaderConfig;
    /**
     * @name tab
     * @description 标签栏配置
     * @type TabConfig
     */
    tab: TabConfig;
    /**
     * @name fixedHeaderAndTab
     * @description 固定头部和标签栏
     * @type boolean
     */
    fixedHeaderAndTab: boolean;
    /**
     * @name sider
     * @description 侧边栏配置
     * @type SiderConfig
     */
    sider: SiderConfig;
    /**
     * @name footer
     * @description 页脚配置
     * @type FooterConfig
     */
    footer: FooterConfig;
    /**
     * @name watermark
     * @description 水印配置
     * @type WatermarkConfig
     */
    watermark: WatermarkConfig;
}
