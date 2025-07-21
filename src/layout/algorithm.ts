import {type SelectProps, theme as antTheme} from "antd";

// AntDesign 算法，你可以在此自定义你的算法
const algorithm = {
  // 默认算法
  defaultAlgorithm: antTheme.defaultAlgorithm,
  // 暗黑模式算法
  darkAlgorithm: antTheme.darkAlgorithm,
  // 默认 + 紧凑算法
  defaultCompactAlgorithm: [antTheme.defaultAlgorithm, antTheme.compactAlgorithm],
  // 暗黑 + 紧凑算法
  darkCompactAlgorithm: [antTheme.darkAlgorithm, antTheme.compactAlgorithm],
};

// 算法切换选择器的 Options
export const algorithmOptions:  SelectProps['options'] = [
  {
    label: '默认',
    value: 'defaultAlgorithm',
  },
  {
    label: '暗黑',
    value: 'darkAlgorithm',
  },
  {
    label: '默认 + 紧凑',
    value: 'defaultCompactAlgorithm',
  },
  {
    label: '暗黑 + 紧凑',
    value: 'darkCompactAlgorithm',
  },
]

export type algorithmType = keyof typeof algorithm;

export default algorithm;