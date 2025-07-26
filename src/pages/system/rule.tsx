import type {FC} from "react";
import XinTable from "@/components/XinTable";
import type {IRule} from "@/domain/iRule";
import type {XinTableColumn} from "@/components/XinTable/typings";
import {useTranslation} from "react-i18next";
import IconFont from "@/components/IconFont";
import {Button, message, Switch} from "antd";
import {selectParentNode} from "@/api/rule.ts";
import IconSelect from "@/components/XinForm/IconSelect";

const RuleTable: FC = () => {

  const {t} = useTranslation();
  const iconColumn: XinTableColumn<IRule> = {
    title: '图标',
    dataIndex: 'icon',
    valueType: 'text',
    renderFormItem: (form, config, schema) => <IconSelect dataIndex={form.key} form={schema} value={config.value}></IconSelect>,
  }
  const localeColumn: XinTableColumn<IRule> = {
    title: '多语言标识',
    dataIndex: 'local',
    valueType: 'text',
  }
  const pathColumn: XinTableColumn<IRule> = {
    title: '路由地址',
    dataIndex: 'path',
    valueType: 'text',
    formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    tooltip: '项目文件系统路径，忽略：pages 或 index.(ts|tsx)',
  }

  const columns: XinTableColumn<IRule>[] = [
    {
      title: '父节点',
      dataIndex: 'pid',
      valueType: 'treeSelect',
      initialValue: 0,
      request: async () => {
        const data = await selectParentNode();
        return [
          {
            label: '根节点',
            value: 0,
            children: data.data.data
          }
        ]
      },
      hideInTable: true,
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    },
    {
      title: '标题',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
      render: (_, data) => data.local ? t(data.local) : data.name,
      tooltip: '菜单的标题，可当作菜单栏标题，如果有多语言标识，该项会被覆盖！',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      valueType: 'text',
      renderText: (_, date) => date.icon ? <IconFont name={date.icon}/> : '-',
      align: 'center',
      hideInForm: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'radio',
      valueEnum: {
        "menu": { text: '导航菜单', status: 'Default' },
        "route": {text: '路由', status: 'Success' },
        "nested-route": {text: '嵌套路由', status: 'Success' },
        "rule": { text: '权限', status: 'Error' }
      },
      initialValue: 'menu',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    },
    {
      title: '权限标识',
      dataIndex: 'key',
      valueType: 'text',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
      tooltip: '例: 路由地址 "/index/index" , 权限标识为 "index.index" , 按钮权限请加上上级路由的权限标识，如：查询按钮权限 "index.index.list" ',
    },
    {
      valueType: 'dependency',
      name: ['type'],
      hideInTable: true,
      columns: ({ type }: IRule): XinTableColumn<IRule>[] => {
        if (type === 'menu') {
          return [iconColumn, localeColumn];
        } else if (type === 'route') {
          return [pathColumn, iconColumn, localeColumn];
        } else if (type === 'nested-route') {
          return [pathColumn, iconColumn];
        }
        return []
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'digit',
      tooltip: '数字越小排序越靠前',
      align: 'center',
      colProps: { span: 6 }
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      valueType: 'text',
      hideInForm: true,
      renderText: (text, record) => record.type === 'route' || record.type === 'nested-route' ? text : '-',
      tooltip: '项目文件系统路径，忽略：pages 或 index.(ts|tsx)',
    },
    {
      title: '是否隐藏',
      dataIndex: 'hidden',
      valueType: 'switch',
      tooltip: '菜单栏显示状态，控制菜单是否显示再导航中（菜单规则依然生效）',
      align: 'center',
      colProps: { span: 6 },
      render: (_, data) => {
        if (data.type !== 'route') { return '-' }
        return (
          <Switch
            checkedChildren='显示'
            unCheckedChildren='隐藏'
            defaultValue={data.hidden}
            onChange={ async (_, event) => {
              event.stopPropagation();
              message.success('修改成功')
            }}
          />
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'date',
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
    <XinTable<IRule>
      columns={columns}
      api={'/system/rule'}
      accessName={'system.rule'}
      rowKey={'id'}
      onFinish={async () => {
        message.success("保存成功")
        return true;
      }}
      tableProps={{
        search: false,
        headerTitle: "菜单权限",
        pagination: false
      }}
      toolBarRender={[
        <Button>
          展开全部
        </Button>,
        <Button>
          折叠全部
        </Button>
      ]}
      formProps={{
        grid: true,
        colProps: { span: 12 },
      }}
    />
  )
}

export default RuleTable;