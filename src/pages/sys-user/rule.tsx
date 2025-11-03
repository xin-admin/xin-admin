import type {ISysRule} from "@/domain/iSysRule.ts";
import {listRule, ruleParent, showRule, statusRule} from "@/api/sysUserRule.ts";
import {useTranslation} from "react-i18next";
import IconFont from "@/components/IconFont";
import XinTable from "@/components/XinTable";
import type {XinTableColumn, XinTableRef} from "@/components/XinTable/typings.ts";
import {Button, message, Switch, Tag, Tooltip} from "antd";
import IconSelect from "@/components/XinForm/IconSelect";
import {PlusOutlined} from "@ant-design/icons";
import {useRef} from "react";
import type {ProFormInstance} from "@ant-design/pro-components";

const Rule =  () => {
  const {t} = useTranslation();
  const formRef = useRef<ProFormInstance>(null);
  const xinTableRef = useRef<XinTableRef<ISysRule>>(null);

  /** 路由地址表单项 */
  const pathItem: XinTableColumn<ISysRule> = {
    title: '路由地址',
    dataIndex: 'path',
    valueType: 'text',
    formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    tooltip: '路由页面的地址，如果为外链直接填写外链网站URL',
  };
  /** 图标表单项 */
  const iconItem: XinTableColumn<ISysRule> = {
    title: '图标',
    dataIndex: 'icon',
    valueType: 'text',
    renderFormItem: (form, config, schema) => (
      <IconSelect dataIndex={form.key} form={schema} value={config.value}></IconSelect>
    ),
  };
  /** 多语言表单项 */
  const localeItem: XinTableColumn<ISysRule> = {
    title: '多语言标识',
    dataIndex: 'local',
    valueType: 'text',
    hideInTable: true,
  };
  /** 是否外链表单项 */
  const linkItem: XinTableColumn<ISysRule> = {
    title: '是否外链',
    dataIndex: 'link',
    valueType: 'switch',
    hideInTable: true,
    fieldProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
      onClick: (checked: boolean) => {
        formRef.current?.setFieldValue('link', checked ? 1 : 0);
      },
    },

  }
  /** 路由组件路径表单项 */
  const elementPathItem: XinTableColumn<ISysRule> = {
    title: '组件路径',
    dataIndex: 'elementPath',
    valueType: 'text',
    hideInTable: true,
    formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
  }

  const columns: XinTableColumn<ISysRule>[] = [
    /** ----------------- 表单使用的 Column ------------------- */
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'radioButton',
      valueEnum: {
        "menu": "菜单",
        "route": "路由",
        "nested-route": "嵌套路由",
        "rule": "权限",
      },
      hideInTable: true,
      initialValue: 'menu',
      colProps: { span: 9 },
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    },
    {
      title: '父节点',
      dataIndex: 'parent_id',
      hideInTable: true,
      valueType: 'treeSelect',
      request: async () => {
        const data = await ruleParent();
        return [
          {
            name: "顶级菜单",
            id: 0,
            children: data.data.data!
          }
        ]
      },
      initialValue: 0,
      fieldProps: { fieldNames: { label: 'name', value: 'id' }, disabled: true},
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
      colProps: { span: 9 },
    },
    {
      title: '排序',
      hideInTable: true,
      dataIndex: 'order',
      valueType: 'digit',
      width: "100%",
      initialValue: 0,
      colProps: { span: 6 },
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    },
    {
      title: '规则名称',
      hideInTable: true,
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    },
    {
      title: '权限标识',
      valueType: 'text',
      dataIndex: 'key',
      hideInTable: true,
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    },
    {
      valueType: 'dependency',
      name: ['type', 'link'],
      hideInTable: true,
      columns: ({ type, link }: ISysRule): any[] => {
        if (type === 'menu') {
          return [ localeItem, iconItem ];
        } else if (type === 'route') {
          if (!link) {
            return [ pathItem, iconItem, localeItem, linkItem, elementPathItem ];
          } else {
            return [ pathItem, iconItem, localeItem, linkItem ];
          }
        } else if (type === 'nested-route') {
          return [ pathItem, elementPathItem ];
        } else {
          return [];
        }
      },
    },
    /** ------------------ 表格使用的 Column ---------------- */
    {
      title: '规则名称',
      width: 220,
      ellipsis: true,
      hideInForm: true,
      dataIndex: 'name',
    },
    {
      width: 220,
      ellipsis: true,
      align: 'center',
      title: '显示名称',
      dataIndex: 'local',
      hideInForm: true,
      renderText: (data) => t(data)
    },
    {
      title: '图标',
      dataIndex: 'icon',
      align: 'center',
      width: 60,
      hideInForm: true,
      renderText: (data) => data ? <IconFont name={data} /> : '-'
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      width: 120,
      hideInForm: true,
      renderText: (value: string, record) => (
        <>
          { value === 'menu' && <Tag color={'processing'}>菜单</Tag> }
          { value === 'route' && (
            <Tooltip title={"路由地址：" + record.path}>
              <Tag color={'success'}>路由</Tag>
            </Tooltip>
          )}
          { value === 'nested-route' && <Tag color={'success'}>嵌套路由</Tag> }
          { value === 'rule' && <Tag>权限</Tag> }
        </>
      )
    },
    {
      width: 60,
      title: '排序',
      align: 'center',
      dataIndex: 'order',
      hideInForm: true,
      render: (value) => <Tag bordered={false} color={'purple'}>{value}</Tag>,
    },
    {
      title: '权限标识',
      align: 'center',
      dataIndex: 'key',
      hideInForm: true,
      width: 220,
      render: (value) => <Tag bordered={false} color={'geekblue'}>{value}</Tag>,
    },
    {
      title: '路由地址',
      hideInTable: true,
      valueType: 'text',
      hideInForm: true,
      dataIndex: 'path',
    },
    {
      title: '显示状态',
      align: 'center',
      dataIndex: 'hidden',
      hideInForm: true,
      tooltip: '菜单栏显示状态，控制菜单是否显示再导航中（菜单规则依然生效）',
      render: (_, data) => {
        if (data.type === 'rule' || data.type === 'nested-route') { return '-' }
        return (
          <Switch
            checkedChildren='显示'
            unCheckedChildren='隐藏'
            defaultValue={data.hidden === 1}
            onChange={ async (_, event) => {
              event.stopPropagation();
              await showRule(data.id!);
              message.success('修改成功');
            }}
          />
        )
      },
    },
    {
      title: '是否禁用',
      dataIndex: 'status',
      hideInForm: true,
      tooltip: '权限是否禁用（将不会参与权限验证）',
      align: 'center',
      render: (_, data) => {
        return (
          <Switch
            checkedChildren='启用'
            unCheckedChildren='禁用'
            defaultChecked={data.status === 1}
            onChange={async (_, event) => {
              event.stopPropagation();
              await statusRule(data.id!);
              message.success('修改成功');
            }}
          />
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'fromNow',
      hideInForm: true,
      align: 'center',
    },
    {
      title: '最近修改',
      dataIndex: 'updated_at',
      valueType: 'fromNow',
      hideInForm: true,
      align: 'center',
    },
  ];

  return (
    <XinTable
      tableProps={{
        request: async () => {
          const { data } = await listRule();
          return {
            data: data.data,
            success: data.success
          };
        },
        headerTitle: '用户权限',
        search: false,
        bordered: true,
        pagination: false,
        cardProps: {
          bordered: true
        },
      }}
      beforeOperateRender={(data) => {
        return (
          <Tooltip title={'添加下级'}>
            <Button
              color={'green'}
              variant={'solid'}
              icon={<PlusOutlined />}
              size={'small'}
              onClick={() => {
                xinTableRef.current?.setFormInitValue(false);
                formRef.current?.resetFields();
                xinTableRef.current?.setFormOpen(true);
                formRef.current?.setFieldValue('parent_id', data.id);
              }}
            />
          </Tooltip>
        )
      }}
      formProps={{
        grid: true,
        colProps: {span: 12}
      }}
      formRef={formRef}
      xinTableRef={xinTableRef}
      columns={columns}
      api={'/sys-user/rule'}
      rowKey={"id"}
      accessName={"sys-user.rule"}
    />
  )
}

export default Rule;