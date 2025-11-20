import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Menu,
  Button,
  Space,
  message,
  Popconfirm,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  DatePicker,
  Radio,
  Checkbox,
  Divider,
  Spin,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { BetaSchemaForm, type ProFormInstance } from '@ant-design/pro-components';
import type { ISettingGroup } from '@/domain/iSettingGroup';
import type { ISetting } from '@/domain/iSetting';
import {
  getSettingGroupList,
  createSettingGroup,
  updateSettingGroup,
  deleteSettingGroup,
  getSettingItemList,
  createSettingItem,
  updateSettingItem,
  deleteSettingItem,
  saveSettingItemValue,
} from '@/api/sys/sysSetting';

const { TextArea } = Input;
const { Text } = Typography;

/** 表单组件类型选项 */
const FORM_COMPONENT_OPTIONS = [
  { label: '输入框', value: 'Input' },
  { label: '文本域', value: 'TextArea' },
  { label: '数字输入框', value: 'InputNumber' },
  { label: '开关', value: 'Switch' },
  { label: '单选框', value: 'Radio' },
  { label: '复选框', value: 'Checkbox' },
  { label: '下拉选择', value: 'Select' },
  { label: '日期选择器', value: 'DatePicker' },
];

const SettingManagement: React.FC = () => {
  const [settingGroups, setSettingGroups] = useState<ISettingGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>();
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>();
  const [settingItems, setSettingItems] = useState<ISetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);

  // 设置组表单
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ISettingGroup | null>(null);
  const groupFormRef = useRef<ProFormInstance>(null);

  // 设置项表单
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ISetting | null>(null);
  const itemFormRef = useRef<ProFormInstance>(null);

  // 设置项值表单
  const [valuesForm] = Form.useForm();

  // 保存计时器
  const saveTimerRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

  /** 加载设置组列表 */
  const loadSettingGroups = async () => {
    try {
      setLoading(true);
      const { data } = await getSettingGroupList();
      const groups = data.data || [];
      setSettingGroups(groups);

      // 如果当前没有选中的组,选中第一个
      if (!selectedGroupId && groups.length > 0) {
        setSelectedGroupId(groups[0].id);
        setSelectedGroupKey(groups[0].key);
      }
    } finally {
      setLoading(false);
    }
  };

  /** 加载设置项列表 */
  const loadSettingItems = async (groupId?: number) => {
    if (!groupId) return;

    try {
      setItemsLoading(true);
      const { data } = await getSettingItemList(groupId);
      const items = data.data || [];
      setSettingItems(items);

      // 初始化表单值
      const initialValues: { [key: string]: any } = {};
      items.forEach(item => {
        if (item.values) {
          try {
            // 尝试解析JSON值
            const parsedValue = JSON.parse(item.values);
            initialValues[`item_${item.id}`] = parsedValue;
          } catch {
            // 如果不是JSON,直接使用字符串值
            initialValues[`item_${item.id}`] = item.values;
          }
        }
      });
      valuesForm.setFieldsValue(initialValues);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    loadSettingGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      loadSettingItems(selectedGroupId);
    }
  }, [selectedGroupId]);

  /** 打开新增设置组对话框 */
  const handleAddGroup = () => {
    setEditingGroup(null);
    groupFormRef.current?.resetFields();
    setGroupModalOpen(true);
  };

  /** 打开编辑设置组对话框 */
  const handleEditGroup = (group: ISettingGroup) => {
    setEditingGroup(group);
    groupFormRef.current?.setFieldsValue(group);
    setGroupModalOpen(true);
  };

  /** 保存设置组 */
  const handleSaveGroup = async (values: ISettingGroup) => {
    try {
      if (editingGroup) {
        await updateSettingGroup(editingGroup.id!, values);
        message.success('修改设置组成功');
      } else {
        await createSettingGroup(values);
        message.success('新增设置组成功');
      }
      setGroupModalOpen(false);
      await loadSettingGroups();
      return true;
    } catch (error) {
      return false;
    }
  };

  /** 删除设置组 */
  const handleDeleteGroup = async (id: number) => {
    try {
      await deleteSettingGroup(id);
      message.success('删除设置组成功');
      if (selectedGroupId === id) {
        setSelectedGroupId(undefined);
        setSelectedGroupKey(undefined);
      }
      await loadSettingGroups();
    } catch (error) {
      console.error('删除设置组失败:', error);
    }
  };

  /** 打开新增设置项对话框 */
  const handleAddItem = () => {
    setEditingItem(null);
    itemFormRef.current?.resetFields();
    itemFormRef.current?.setFieldsValue({ group_id: selectedGroupId });
    setItemModalOpen(true);
  };

  /** 打开编辑设置项对话框 */
  const handleEditItem = (item: ISetting) => {
    setEditingItem(item);
    itemFormRef.current?.setFieldsValue(item);
    setItemModalOpen(true);
  };

  /** 保存设置项 */
  const handleSaveItem = async (values: ISetting) => {
    try {
      if (editingItem) {
        await updateSettingItem(editingItem.id!, { ...values, group_id: selectedGroupId });
        message.success('修改设置项成功');
      } else {
        await createSettingItem(values);
        message.success('新增设置项成功');
      }
      setItemModalOpen(false);
      await loadSettingItems(selectedGroupId);
      return true;
    } catch (error) {
      return false;
    }
  };

  /** 删除设置项 */
  const handleDeleteItem = async (id: number) => {
    try {
      await deleteSettingItem(id);
      message.success('删除设置项成功');
      await loadSettingItems(selectedGroupId);
    } catch (error) {
      console.error('删除设置项失败:', error);
    }
  };

  /** 自动保存设置项值 */
  const handleValueChange = async (itemId: number, value: any) => {
    // 清除之前的定时器
    if (saveTimerRef.current[itemId]) {
      clearTimeout(saveTimerRef.current[itemId]);
    }

    // 设置新的定时器,500ms后保存
    saveTimerRef.current[itemId] = setTimeout(async () => {
      try {
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        await saveSettingItemValue(itemId, valueStr);
        message.success('保存成功', 1);
      } catch (error) {
        message.error('保存失败');
      }
    }, 500);
  };

  /** 渲染设置项的表单组件 */
  const renderSettingItemComponent = (item: ISetting) => {
    const fieldName = `item_${item.id}`;
    const componentType = item.type || 'Input';
    const usage = `setting('${selectedGroupKey}.${item.key}')`;

    // 解析options
    let options: any[] = [];
    if (item.options_json) {
      try {
        options = JSON.parse(item.options_json);
      } catch {
        console.error('options解析失败:', item.options_json);
      }
    }

    // 解析props
    let props: any = {};
    if (item.props_json) {
      try {
        props = JSON.parse(item.props_json);
      } catch {
        console.error('props解析失败:', item.props_json);
      }
    }

    const commonProps = {
      ...props,
      onChange: (value: any) => {
        // 对于事件对象,提取value
        const actualValue = value?.target ? value.target.value : value;
        handleValueChange(item.id!, actualValue);
      },
    };

    // 自定义Label组件
    const CustomLabel = () => (
      <div style={{ marginBottom: 8 }}>
        <Space>
          <Text strong>{item.title}</Text>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditItem(item)}
          />
          <Popconfirm
            title="确认删除?"
            onConfirm={() => handleDeleteItem(item.id!)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
        <div style={{ marginBottom: 4 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {item.describe} <Text code copyable>{usage}</Text>
          </Text>
        </div>
      </div>
    );

    let component;
    switch (componentType) {
      case 'Input':
        component = (
          <Input
            placeholder={item.describe || '请输入'}
            {...commonProps}
            onBlur={(e) => handleValueChange(item.id!, e.target.value)}
          />
        );
        break;

      case 'TextArea':
        component = (
          <TextArea
            placeholder={item.describe || '请输入'}
            rows={4}
            {...commonProps}
            onBlur={(e) => handleValueChange(item.id!, e.target.value)}
          />
        );
        break;

      case 'InputNumber':
        component = (
          <InputNumber
            style={{ width: '100%' }}
            placeholder={item.describe || '请输入'}
            {...commonProps}
          />
        );
        break;

      case 'Switch':
        component = <Switch {...commonProps} />;
        break;

      case 'Radio':
        component = <Radio.Group options={options} {...commonProps} />;
        break;

      case 'Checkbox':
        component = <Checkbox.Group options={options} {...commonProps} />;
        break;

      case 'Select':
        component = (
          <Select
            placeholder={item.describe || '请选择'}
            options={options}
            {...commonProps}
          />
        );
        break;

      case 'DatePicker':
        component = (
          <DatePicker
            style={{ width: '100%' }}
            placeholder={item.describe || '请选择日期'}
            {...commonProps}
          />
        );
        break;

      default:
        component = <Input placeholder={item.describe || '请输入'} {...commonProps} />;
    }

    return (
      <div style={{ marginBottom: 24 }}>
        <CustomLabel />
        <Form.Item name={fieldName} noStyle>
          {component}
        </Form.Item>
      </div>
    );
  };

  /** 设置组表单列 */
  const groupColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text' as const,
      formItemProps: {
        rules: [{ required: true, message: '请输入标题' }],
      },
    },
    {
      title: '键',
      dataIndex: 'key',
      valueType: 'text' as const,
      formItemProps: {
        rules: [{ required: true, message: '请输入键' }],
      },
    },
    {
      title: '描述',
      dataIndex: 'remark',
      valueType: 'textarea' as const,
    },
  ];

  /** 设置项表单列 */
  const itemColumns = [
    {
      title: '键',
      dataIndex: 'key',
      valueType: 'text' as const,
      formItemProps: {
        rules: [{ required: true, message: '请输入键' }],
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text' as const,
      formItemProps: {
        rules: [{ required: true, message: '请输入标题' }],
      },
    },
    {
      title: '组件类型',
      dataIndex: 'type',
      valueType: 'select' as const,
      fieldProps: {
        options: FORM_COMPONENT_OPTIONS,
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择组件类型' }],
      },
    },
    {
      title: '描述',
      dataIndex: 'describe',
      valueType: 'textarea' as const,
      colProps: { span: 24 },
    },
    {
      title: '选项(JSON数组)',
      dataIndex: 'options',
      valueType: 'textarea' as const,
      tooltip: '例如: 1=选项1 /n 2=选项2',
    },
    {
      title: '属性(JSON对象)',
      dataIndex: 'props',
      valueType: 'textarea' as const,
      tooltip: '例如: placeholder=请输入 /n maxLength=100',
    },
    {
      title: '默认值',
      dataIndex: 'values',
      valueType: 'text' as const,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'digit' as const,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* 左侧设置组菜单 */}
      <Col xs={24} lg={6}>
        <Card
          title={
            <Space>
              <SettingOutlined />
              设置组
            </Space>
          }
          extra={
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddGroup}
            >
              新增
            </Button>
          }
          loading={loading}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedGroupId ? [String(selectedGroupId)] : []}
            items={settingGroups.map(group => ({
              key: String(group.id),
              label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{group.title}</span>
                  <Space size="small">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGroup(group);
                      }}
                    />
                    <Popconfirm
                      title="确认删除?"
                      description="删除设置组将同时删除该组下的所有设置项"
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDeleteGroup(group.id!);
                      }}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </Space>
                </div>
              ),
              onClick: () => {
                setSelectedGroupId(group.id);
                setSelectedGroupKey(group.key);
              },
            }))}
          />
        </Card>
      </Col>

      {/* 右侧设置项 */}
      <Col xs={24} lg={18}>
        <Card
          title="设置项"
          extra={
            selectedGroupId && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddItem}
              >
                新增设置项
              </Button>
            )
          }
        >
          {!selectedGroupId ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              请先选择设置组
            </div>
          ) : (
            <Spin spinning={itemsLoading}>
              <Form form={valuesForm} layout="vertical">
                {settingItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                    暂无设置项,请点击"新增设置项"按钮添加
                  </div>
                ) : (
                  settingItems.map((item, index) => (
                    <div key={item.id} style={{ position: 'relative' }}>
                      <div style={{ paddingRight: 80 }}>
                        {renderSettingItemComponent(item)}
                      </div>
                      {index < settingItems.length - 1 && <Divider />}
                    </div>
                  ))
                )}
              </Form>
            </Spin>
          )}
        </Card>
      </Col>

      {/* 设置组表单弹窗 */}
      <BetaSchemaForm<ISettingGroup>
        title={editingGroup ? '编辑设置组' : '新增设置组'}
        open={groupModalOpen}
        layoutType="ModalForm"
        columns={groupColumns}
        formRef={groupFormRef}
        onFinish={handleSaveGroup}
        modalProps={{
          onCancel: () => setGroupModalOpen(false),
          forceRender: true,
        }}
      />

      {/* 设置项表单弹窗 */}
      <BetaSchemaForm<ISetting>
        title={editingItem ? '编辑设置项' : '新增设置项'}
        open={itemModalOpen}
        layoutType="ModalForm"
        columns={itemColumns}
        formRef={itemFormRef}
        onFinish={handleSaveItem}
        modalProps={{
          onCancel: () => setItemModalOpen(false),
          forceRender: true,
          width: 600,
        }}
        grid={true}
        colProps={{ span: 12 }}
      />
    </Row>
  );
};

export default SettingManagement;
