import React, { useState } from 'react';
import { Card, Space, Divider, Typography, message, Form, Button } from 'antd';
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import IconSelect from '@/components/XinForm/IconSelector';
import IconFont from '@/components/IconFont';

const { Title, Paragraph, Text } = Typography;

/**
 * 图标选择器组件使用示例页面
 */
const IconSelectExample: React.FC = () => {
  const [icon, setIcon] = useState<string>('');
  const [form] = Form.useForm();

  return (
    <div className="p-6">
      <Typography>
        <Title level={2}>图标选择器组件示例</Title>
        <Paragraph>
          基于 Ant Design Select + Modal + Tabs 封装的图标选择器组件，支持多分类图标选择。
        </Paragraph>
      </Typography>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 示例1：独立使用 */}
        <Card title="示例1：独立使用" bordered>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>基础用法：</Text>
              <div className="mt-2">
                <IconSelect
                  value={icon}
                  onChange={(value) => {
                    setIcon(value || '');
                    if (value) {
                      message.success(`选中图标: ${value}`);
                    } else {
                      message.info('已清空图标');
                    }
                  }}
                  placeholder="请选择图标"
                />
              </div>
              <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
                <Text type="secondary">当前选中: {icon || '未选择'}</Text>
                {icon && (
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Text strong>小尺寸</Text>
                      <IconFont name={icon} style={{ fontSize: 20 }} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Text strong>中尺寸</Text>
                      <IconFont name={icon} style={{ fontSize: 32 }} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Text strong>大尺寸</Text>
                      <IconFont name={icon} style={{ fontSize: 48 }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Divider />

            <div>
              <Text strong>禁用状态：</Text>
              <div className="mt-2">
                <IconSelect
                  value="HomeOutlined"
                  disabled={true}
                  placeholder="禁用状态"
                />
              </div>
            </div>

            <Divider />

            <div>
              <Text strong>只读状态：</Text>
              <div className="mt-2">
                <IconSelect
                  value="SettingOutlined"
                  readonly={true}
                  placeholder="只读状态"
                />
              </div>
              <Text type="secondary" className="mt-2 block text-sm">
                只读模式下不能打开选择弹窗，但可以清空
              </Text>
            </div>
          </Space>
        </Card>

        {/* 示例2：在 Ant Design Form 中使用 */}
        <Card title="示例2：在 Ant Design Form 中使用" bordered>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              console.log('表单提交:', values);
              message.success('提交成功！');
              message.info(`菜单图标: ${values.icon}`);
            }}
          >
            <Form.Item
              name="menuName"
              label="菜单名称"
              rules={[{ required: true, message: '请输入菜单名称' }]}
            >
              <input
                type="text"
                placeholder="请输入菜单名称"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </Form.Item>

            <Form.Item
              name="icon"
              label="菜单图标"
              rules={[{ required: true, message: '请选择菜单图标' }]}
            >
              <IconSelect placeholder="请选择菜单图标" />
            </Form.Item>

            <Form.Item
              name="menuPath"
              label="菜单路径"
              rules={[{ required: true, message: '请输入菜单路径' }]}
            >
              <input
                type="text"
                placeholder="/example/path"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </Form.Item>

            {/* 图标预览 */}
            <Form.Item dependencies={['icon', 'menuName']}>
              {() => {
                const selectedIcon = form.getFieldValue('icon');
                const menuName = form.getFieldValue('menuName');
                return selectedIcon ? (
                  <div className="p-4 border border-blue-200 rounded bg-blue-50">
                    <Text strong className="block mb-3">菜单预览：</Text>
                    <div className="flex items-center gap-3 p-3 bg-white rounded shadow-sm">
                      <IconFont name={selectedIcon} style={{ fontSize: 24, color: '#1890ff' }} />
                      <Text className="text-base">{menuName || '菜单名称'}</Text>
                    </div>
                    <Text type="secondary" className="block mt-3 text-sm">
                      图标代码: {selectedIcon}
                    </Text>
                  </div>
                ) : null;
              }}
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button onClick={() => form.resetFields()}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 示例3：在 ProForm 中使用 */}
        <Card title="示例3：在 ProForm 中使用" bordered>
          <ProForm
            onFinish={async (values) => {
              console.log('ProForm 提交:', values);
              message.success('提交成功！');
              message.info(`系统图标: ${values.systemIcon}`);
              return true;
            }}
            submitter={{
              searchConfig: {
                submitText: '提交表单',
              },
              resetButtonProps: {
                style: { display: 'none' },
              },
            }}
          >
            <ProFormText
              name="systemName"
              label="系统名称"
              placeholder="请输入系统名称"
              rules={[{ required: true, message: '请输入系统名称' }]}
            />

            <ProForm.Item
              name="systemIcon"
              label="系统图标"
              rules={[{ required: true, message: '请选择系统图标' }]}
            >
              <IconSelect placeholder="请选择系统图标" />
            </ProForm.Item>

            <ProFormTextArea
              name="description"
              label="系统描述"
              placeholder="请输入系统描述"
              fieldProps={{
                rows: 4,
              }}
            />
          </ProForm>
        </Card>

        {/* 示例4：图标分类说明 */}
        <Card title="示例4：图标分类说明" bordered>
          <div>
            <Text strong>支持的图标分类：</Text>
            <ul className="mt-2 pl-6 space-y-2">
              <li>
                <Text>🎨 <Text strong>自定义图标</Text> - 项目自定义的图标集合</Text>
              </li>
              <li>
                <Text>🌐 <Text strong>网站通用图标</Text> - 常用的网站功能图标（首页、设置、用户等）</Text>
              </li>
              <li>
                <Text>➡️ <Text strong>方向性图标</Text> - 箭头、方向类图标（上下左右、展开折叠等）</Text>
              </li>
              <li>
                <Text>✏️ <Text strong>编辑类图标</Text> - 编辑操作相关图标（复制、粘贴、删除等）</Text>
              </li>
              <li>
                <Text>📊 <Text strong>数据类图标</Text> - 数据展示相关图标（图表、表格、统计等）</Text>
              </li>
              <li>
                <Text>🏷️ <Text strong>品牌和标识</Text> - 各种品牌 Logo 和标识图标</Text>
              </li>
              <li>
                <Text>🔧 <Text strong>其它图标</Text> - 其他未分类的实用图标</Text>
              </li>
            </ul>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default IconSelectExample;
