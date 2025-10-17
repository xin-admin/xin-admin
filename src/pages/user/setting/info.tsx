import {UploadOutlined} from '@ant-design/icons';
import {Avatar, Button, Form, Input, message, Radio, Upload, type UploadProps} from 'antd';
import useAuthStore from "@/stores/user";
import type {FormProps} from "@ant-design/pro-components";
import {type InfoParams, updateInfo} from "@/api/admin.ts";
import {useState} from "react";

const Info = () => {
  const userInfo = useAuthStore(state => state.user);
  const getInfo = useAuthStore(state => state.getInfo);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  /** 上传头像 */
  const uploadChange: UploadProps['onChange'] = async () => {
    message.success('头像上传成功');
  }

  /** 提交表单 */
  const onFinish: FormProps['onFinish'] = async (values: InfoParams) => {
    try {
      console.log('Received values:', values);
      setLoading(true);
      await updateInfo(values);
      await getInfo();
      message.success('更新用户信息成功！');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 px-6 py-4 max-w-4xl w-full">
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <Avatar size={120} src={userInfo?.avatar_url} className="mb-4 border-2 border-gray-200" />
        <Upload
          name="avatar"
          showUploadList={false}
          onChange={uploadChange}
        >
          <Button icon={ <UploadOutlined /> }>更换头像</Button>
        </Upload>
        <p className="text-gray-500 text-sm mt-2">支持 JPG/PNG 格式，大小不超过 2MB</p>
      </div>
      <div className="w-full md:w-2/3">
        <Form<InfoParams>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            bio: userInfo?.bio,
            email: userInfo?.email,
            mobile: userInfo?.mobile,
            nickname: userInfo?.nickname,
            sex: userInfo?.sex,
            username: userInfo?.username,
          }}
        >
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
          <Form.Item label="性别" name="sex">
            <Radio.Group options={[{ value: 0, label: '男' }, { value: 1, label: '女' }]}/>
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
          <Form.Item
            label="手机号"
            name="mobile"
            rules={[
              { required: true, message: '请输入手机号!' }
            ]}
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full md:w-auto">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Info;