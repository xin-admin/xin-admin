import {UploadOutlined} from '@ant-design/icons';
import {Avatar, Button, Form, Input, message, Select, Upload} from 'antd';
import useAuthStore from "@/stores/user";

const {Option} = Select;

const Info = () => {
  const userInfo = useAuthStore(state => state.user);
  const [form] = Form.useForm();

  return (
    <div className="px-6 py-4 flex-auto max-w-4xl">
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log('Received values:', values);
          message.success('设置保存成功');
        }}
        initialValues={userInfo!}
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="flex flex-col items-center">
              <Avatar
                size={120}
                src={userInfo?.avatar_url}
                className="mb-4 border-2 border-gray-200"
              />
              <Upload
                name="avatar"
                showUploadList={false}
                onChange={() => {
                  message.success('头像上传成功');
                }}
              >
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
              <p className="text-gray-500 text-sm mt-2">支持 JPG/PNG 格式，大小不超过 2MB</p>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input className="w-full" disabled />
            </Form.Item>

            <Form.Item
              label="昵称"
              name="nickname"
              rules={[{ required: true, message: '请输入昵称!' }]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item label="性别" name="gender">
              <Select className="w-full">
                <Option value={0}>男</Option>
                <Option value={1}>女</Option>
                <Option value={2}>其他</Option>
              </Select>
            </Form.Item>

            <Form.Item label="个人简介" name="bio">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址!' },
                { required: true, message: '请输入邮箱!' }
              ]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full md:w-auto">
                保存设置
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Info;