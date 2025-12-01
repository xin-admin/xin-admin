import React, { useState, useMemo, useCallback } from 'react';
import { Select, Modal, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { categories, type CategoriesKeys } from '@/utils/iconFields';
import IconFont from '@/components/IconFont';

/**
 * 图标选择器组件属性
 */
export interface IconSelectProps {
  value?: string;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
}

/**
 * 图标选择器组件
 * 基于 Ant Design Select + Modal + Tabs 封装
 * 
 * @example
 * <IconSelect
 *   value={icon}
 *   onChange={setIcon}
 *   placeholder="请选择图标"
 * />
 */
const IconSelect: React.FC<IconSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择图标',
  disabled = false,
  readonly = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(value);

  // 同步外部 value
  React.useEffect(() => {
    setSelectedIcon(value);
  }, [value]);

  // 处理图标选择
  const handleIconClick = useCallback((icon: string) => {
    setSelectedIcon(icon);
    onChange?.(icon);
    setOpen(false);
  }, [onChange]);

  // 处理清空
  const handleClear = useCallback(() => {
    setSelectedIcon(undefined);
    onChange?.(null);
  }, [onChange]);

  // 图标列表组件
  const IconsList = useCallback(({ type }: { type: CategoriesKeys }) => {
    return (
      <div className="flex flex-wrap max-h-[400px] overflow-auto gap-2">
        {categories[type].map((item) => (
          <div
            className="cursor-pointer p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center"
            key={item}
            onClick={() => handleIconClick(item)}
            title={item}
          >
            <IconFont name={item} style={{ fontSize: 20 }} />
          </div>
        ))}
      </div>
    );
  }, [handleIconClick]);

  // Tabs 配置
  const tabItems: TabsProps['items'] = useMemo(() => [
    {
      key: 'use',
      label: '自定义图标',
      children: <IconsList type="useIcons" />,
    },
    {
      key: 'suggestion',
      label: '网站通用图标',
      children: <IconsList type="suggestionIcons" />,
    },
    {
      key: 'direction',
      label: '方向性图标',
      children: <IconsList type="directionIcons" />,
    },
    {
      key: 'editor',
      label: '编辑类图标',
      children: <IconsList type="editorIcons" />,
    },
    {
      key: 'data',
      label: '数据类图标',
      children: <IconsList type="dataIcons" />,
    },
    {
      key: 'logo',
      label: '品牌和标识',
      children: <IconsList type="logoIcons" />,
    },
    {
      key: 'other',
      label: '其它图标',
      children: <IconsList type="otherIcons" />,
    },
  ], [IconsList]);

  // Select 选项
  const selectOptions = useMemo(() => {
    if (!selectedIcon) return [];
    return [{
      label: (
        <div className="flex items-center gap-2">
          <IconFont name={selectedIcon} />
          <span>{selectedIcon}</span>
        </div>
      ),
      value: selectedIcon,
    }];
  }, [selectedIcon]);

  return (
    <>
      <Select
        value={selectedIcon}
        placeholder={placeholder}
        disabled={disabled}
        open={false}
        onClick={() => !disabled && !readonly && setOpen(true)}
        options={selectOptions}
        style={{ width: '100%' }}
        allowClear
        onClear={handleClear}
        suffixIcon={selectedIcon ? <IconFont name={selectedIcon} /> : undefined}
      />

      <Modal
        title="选择图标"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <Tabs defaultActiveKey="use" items={tabItems} />
      </Modal>
    </>
  );
};

export default IconSelect;