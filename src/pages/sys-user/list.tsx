import {Avatar, Button, Form, Input, message, Modal, Tag, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import XinTable from '@/components/XinTable';
import {type ProTableProps} from '@ant-design/pro-components';
import type {XinTableColumn} from "@/components/XinTable/typings.ts";
import type ISysUser from "@/domain/iSysUser.ts";
import AuthButton from "@/components/AuthButton";
import type {DeptFieldType, ResetPasswordType, RoleFieldType} from "@/api/sysUserList.ts";
import {deptField, resetPassword, roleField} from "@/api/sysUserList.ts";
import {RedoOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

interface TableParams {
  keywordSearch?: string;
  dept_id?: string | number | bigint;
}

const Table: React.FC = () => {
  const {t} = useTranslation();
  /** 角色选项数据 */
  const [roles, setRoles] = useState<RoleFieldType[]>([]);
  /** 部门选项数据 */
  const [depts, setDepts] = useState<DeptFieldType[]>([]);
  /** 高级表格列配置 */
  const columns: XinTableColumn<ISysUser>[] = [
    {
      title: t("sysUserList.id"),
      dataIndex: 'id',
      hideInForm: true,
      sorter: true,
      align: 'center',
    },
    {
      title: t("sysUserList.username"),
      dataIndex: 'username',
      valueType: 'text',
      align: 'center',
      formItemProps: {rules: [{required: true, message: t("sysUserList.username.required")}]},
    },
    {
      title: t("sysUserList.nickname"),
      dataIndex: 'nickname',
      valueType: 'text',
      colProps: {md: 7},
      align: 'center',
      formItemProps: {rules: [{required: true, message: t("sysUserList.nickname.required")}]},
    },
    {
      title: t("sysUserList.sex"),
      dataIndex: 'sex',
      valueType: 'radio',
      filters: true,
      align: 'center',
      hideInSearch: true,
      fieldProps: {
        options: [
          { value: 0, label: t("sysUserList.sex.0") },
          { value: 1, label: t("sysUserList.sex.1") },
        ]
      },
      valueEnum: {
        0: {text: t("sysUserList.sex.0")},
        1: {text: t("sysUserList.sex.1")},
      }
    },
    {
      title: t("sysUserList.email"),
      dataIndex: 'email',
      valueType: 'text',
      colProps: {md: 6},
      align: 'center',
      formItemProps: {rules: [{required: true, message: t("sysUserList.email.required")}]},
    },
    {
      title: t("sysUserList.role"),
      dataIndex: 'role_id',
      valueType: 'select',
      align: 'center',
      hideInSearch: true,
      formItemProps: {
        rules: [{required: true, message: t("sysUserList.role.required")}],
      },
      render: (dom) => <Tag color={'magenta'}>{dom}</Tag>,
      fieldProps: {
        mode: 'multiple',
        options: roles,
        fieldNames: {label: 'name', value: 'role_id'},
      },
    },
    {
      title: t("sysUserList.dept"),
      dataIndex: 'dept_id',
      valueType: 'treeSelect',
      align: 'center',
      formItemProps: {
        rules: [{required: true, message: t("sysUserList.dept.required")}],
      },
      render: (dom) => <Tag color={'volcano'}>{dom}</Tag>,
      fieldProps: {
        options: depts,
        fieldNames: {label: 'name', value: 'dept_id'}
      }
    },
    {
      title: t("sysUserList.status"),
      dataIndex: 'status',
      valueType: 'radioButton',
      fieldProps: {
        options: [
          { value: 0, label: t("sysUserList.status.0") },
          { value: 1, label: t("sysUserList.status.1") },
        ]
      },
      valueEnum: {
        0: {text: t("sysUserList.status.0"), status: 'Error'},
        1: {text: t("sysUserList.status.1"), status: 'Success'},
      },
      formItemProps: {rules: [{required: true, message: t("sysUserList.status.required")}]},
      filters: true,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: t("sysUserList.mobile"),
      dataIndex: 'mobile',
      valueType: 'text',
      formItemProps: {rules: [{required: true, message: t("sysUserList.mobile.required")}]},
      align: 'center',
    },
    {
      title: t("sysUserList.avatar"),
      dataIndex: 'avatar_url',
      hideInSearch: true,
      valueType: 'avatar',
      hideInForm: true,
      render: (_, entity) => <Avatar size={'small'} src={entity.avatar_url}></Avatar>,
      align: 'center',
    },
    {
      valueType: 'dependency',
      hideInTable: true,
      hideInSearch: true,
      name: ['id'],
      columns: ({id}) => {
        if (! id) {
          return [
            {
              title: t("sysUserList.password"),
              dataIndex: 'password',
              valueType: 'password',
              formItemProps: {rules: [{required: true, message: t("sysUserList.password.required")}]},
              fieldProps: {autoComplete: ''},
            },
            {
              title: t("sysUserList.rePassword"),
              dataIndex: 'rePassword',
              valueType: 'password',
              formItemProps: {rules: [{required: true, message: t("sysUserList.rePassword.required")}]},
              fieldProps: {autoComplete: ''},
            },
          ];
        }
        return [];
      },
    },
    {
      valueType: 'fromNow',
      title: t("sysUserList.created_at"),
      hideInForm: true,
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      valueType: 'fromNow',
      title: t("sysUserList.updated_at"),
      hideInForm: true,
      dataIndex: 'updated_at',
      align: 'center',
    },
  ];
  /** 表格查询参数 */
  const [tableParams, setParams] = useState<TableParams>();
  /** 表格参数 */
  const tableProps: ProTableProps<ISysUser, any> = {
    params: tableParams,
    toolbar: {
      search: {
        placeholder: t("sysUserList.searchPlaceholder"),
        style: {width: 304},
        onSearch: (value: string) => {
          setParams({keywordSearch: value});
        },
      },
      settings: [],
    },
    bordered: true,
    cardProps: {
      bordered: true
    },
    search: {},
    scroll: {x: 1400},
  }
  /** 修改密码相关状态 */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState<number>();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  /** 打开重置密码框 */
  const showRedoModal = (id: number) => {
    setIsModalOpen(true);
    setResetUserId(id);
  };
  /** 提交重置密码 */
  const handleRedoSubmit = async (values: ResetPasswordType) => {
    try {
      setButtonLoading(true);
      await resetPassword({...values, id: resetUserId!});
      setIsModalOpen(false);
      message.success(t("sysUserList.resetSuccess"));
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    deptField().then(res => setDepts(res.data.data!));
    roleField().then(res => setRoles(res.data.data!));
  }, [])

  return (
    <>
      <XinTable<ISysUser>
        api={'/sys-user/list'}
        columns={columns}
        rowKey={'id'}
        accessName={'sys-user.list'}
        beforeOperateRender={(record) => (
          <>
            {record.id !== 1 &&
              <AuthButton auth={'sys-user.list.resetPassword'}>
                <Tooltip title={t("sysUserList.resetPassword")}>
                  <Button
                    variant={'solid'}
                    color={'pink'}
                    icon={<RedoOutlined/>}
                    size={'small'}
                    onClick={() => showRedoModal(record.id!)}
                  />
                </Tooltip>
              </AuthButton>
            }
          </>
        )}
        editShow={(i) => i.id !== 1}
        deleteShow={(i) => i.id !== 1}
        tableProps={tableProps}
        formProps={{grid: true, colProps: {span: 12}}}
      />
      <Modal
        title={t("sysUserList.resetPassword")}
        closable={{'aria-label': 'Custom Close Button'}}
        open={isModalOpen}
        footer={null}
        styles={{body: {paddingTop: 20}}}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form<ResetPasswordType> autoComplete="off" layout={'vertical'} onFinish={handleRedoSubmit}>
          <Form.Item
            label={t("sysUserList.password")}
            name="password"
            rules={[{required: true, message: t("sysUserList.password.required")}]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item
            label={t("sysUserList.rePassword")}
            name="rePassword"
            rules={[{required: true, message: t("sysUserList.rePassword.required")}]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item label={null} style={{marginTop: 30}}>
            <Button type="primary" block size={'large'} htmlType="submit" loading={buttonLoading}>
              {t("sysUserList.resetButton")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Table;
