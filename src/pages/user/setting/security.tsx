import {Button, Card, Form, Input, message, Switch} from 'antd';
import {useState} from "react";
import {type PasswordParams, updatePassword} from "@/api/admin.ts";
import type {FormProps} from "@ant-design/pro-components";

const Security = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  /** 修改密码提交事件 */
  const onFinish: FormProps['onFinish'] = async (values: PasswordParams) => {
    try {
      setLoading(true);
      await updatePassword(values);
      form.resetFields();
      message.success('更新成功');
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 py-4 flex-auto max-w-4xl">
      <Card title="密码修改" className="shadow-sm mb-6">
        <Form<PasswordParams> form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="当前密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入当前密码!' }]}
          >
            <Input.Password className="w-full" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码!' },
              { min: 8, message: '密码长度至少8位!' }
            ]}
          >
            <Input.Password className="w-full" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="rePassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password className="w-full" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="w-full md:w-auto">
            修改密码
          </Button>
        </Form>
      </Card>
      <Card title="账户安全" className="shadow-sm">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div>
            <h4 className="font-medium">绑定手机</h4>
            <p className="text-gray-500 text-sm">已绑定: 138****1234</p>
          </div>
          <Button type="link">更换</Button>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div>
            <h4 className="font-medium">绑定邮箱</h4>
            <p className="text-gray-500 text-sm">已绑定: user@example.com</p>
          </div>
          <Button type="link">更换</Button>
        </div>

        <div className="flex justify-between items-center py-3">
          <div>
            <h4 className="font-medium">两步验证</h4>
            <p className="text-gray-500 text-sm">增强账户安全性</p>
          </div>
          <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
        </div>
      </Card>
    </div>
  );
};

export default  Security;