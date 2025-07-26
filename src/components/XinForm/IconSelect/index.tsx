import { Input, Modal, Tabs, theme } from 'antd';
import type { FormInstance, TabsProps } from 'antd';
import {useState} from 'react';
import type { CSSProperties, FC } from 'react';
import { categories, type CategoriesKeys } from '@/utils/iconFields';
import IconFont from '@/components/IconFont';
const { useToken } = theme;

export interface IconsItemProps {
  value?: any,
  form: FormInstance,
  dataIndex?: string | number | bigint
}

const IconSelect: FC<IconsItemProps> = (props) => {
  const { value, form, dataIndex } = props;
  // 选择菜单显示
  const [iconShow, setIconShow] = useState<boolean>(false);
  const { token } = useToken();

  // 打开选择窗口
  const openModel = () => { setIconShow(true) }

  const IconListCss: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: 300,
    overflow: 'auto',
  };

  const IconsList = (props: { type: CategoriesKeys }) => {
    return (
      <div style={IconListCss}>
        {categories[props.type].map((item) => (
          <div
            className={'cursor-pointer p-[5px_10px] mr-2.5 flex items-center justify-center mb-2.5'}
            style={{
              border: '1px solid ' + token.colorBorder,
              borderRadius: token.borderRadius
            }}
            key={item}
            onClick={() => {
              form.setFieldValue(dataIndex, item);
              setIconShow(false);
            }}
          >
            <IconFont name={item} />
          </div>
        ))}
      </div>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: 'use',
      label: '自定义图标',
      children: <IconsList type={'useIcons'} />,
    },
    {
      key: 'suggestion',
      label: '网站通用图标',
      children: <IconsList type={'suggestionIcons'} />,
    },
    {
      key: 'direction',
      label: '方向性图标',
      children: <IconsList type={'directionIcons'} />,
    },
    {
      key: 'editor',
      label: '编辑类图标',
      children: <IconsList type={'editorIcons'} />,
    },
    {
      key: 'data',
      label: '数据类图标',
      children: <IconsList type={'dataIcons'} />,
    },
    {
      key: 'logo',
      label: '品牌和标识',
      children: <IconsList type={'logoIcons'} />,
    },
    {
      key: 'other',
      label: '其它图标',
      children: <IconsList type={'otherIcons'} />,
    },
  ];

  return (
    <>
      <Input
        value={value}
        addonAfter={
          <>
            { categories.allIcons.includes(value) ?
              <span className={'cursor-pointer'} onClick={openModel}><IconFont name={value} /></span>
              :
              <span className={'cursor-pointer'} onClick={openModel}>请选择</span>
            }
          </>
        }
      />
      <Modal open={iconShow} onCancel={() => setIconShow(false)} width={800} footer={false}>
        <Tabs defaultActiveKey="all" items={items} />
      </Modal>
    </>
  );
}

export default IconSelect;