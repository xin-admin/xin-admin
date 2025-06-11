import type {ThemeProps} from "@/layout/typing.ts";

export const darkColorTheme: ThemeProps = {
    colorText: "#fff",
    // 基础背景颜色
    colorBg: "#000",
    // 内容区域背景色
    bodyBg: "#101010",
    // 页脚背景色
    footerBg: "#141414",
    // 头部背景色
    headerBg: "#141414",
    // 头部文字颜色
    headerColor: "#fff",
    // 侧边栏背景色
    siderBg: "#141414",
    // 布局分割线边框颜色
    colorBorder: "#3b3b3b",
}

export const defaultColorTheme: ThemeProps = {
    // 基础文字颜色
    colorText: "#000",
    // 基础背景颜色
    colorBg: "#fff",
    // 内容区域背景色
    bodyBg: "transparent",
    // 页脚背景色
    footerBg: "#fff",
    // 头部背景色
    headerBg: "#fff",
    // 头部文字颜色
    headerColor: "#000",
    // 侧边栏背景色
    siderBg: "#fff",
    // 布局分割线边框颜色
    colorBorder: "#f0f0f0"
}

export const configTheme: ThemeProps = {
    // 主题
    themeScheme: "light",
    // 品牌色
    colorPrimary: "#1677ff",
    // 错误色
    colorError: "#ff4d4f",
    // 成功色
    colorSuccess: "#52c41a",
    // 警告色
    colorWarning: "#faad14",
    // 基础组件的圆角大小
    borderRadius: 24,
    // 按钮和输入框等基础控件的高度
    controlHeight: 32,
    // 是否开启动画
    motion: true,
    // 头部两侧内边距
    headerPadding: 20,
    // 头部高度
    headerHeight: 56,
    // 侧边栏宽度
    siderWeight: 226,
    // 固定页脚
    fixedFooter: false,
}
