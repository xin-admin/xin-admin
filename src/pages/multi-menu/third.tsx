import {PageContainer, ProCard} from "@ant-design/pro-components";
import {Button} from "antd";

const First = () => (
    <PageContainer
        header={{
            title: '四级页面',
            ghost: true,
            breadcrumb: {
                items: [
                    {
                        path: '',
                        title: '多级菜单',
                    },
                    {
                        path: '',
                        title: '二级菜单',
                    },
                    {
                        path: '',
                        title: '三级菜单',
                    },
                    {
                        path: '',
                        title: '四级页面',
                    },
                ],
            }
        }}
        tabProps={{
            type: 'editable-card',
            hideAdd: true,
            onEdit: (e, action) => console.log(e, action),
        }}
        footer={[
            <Button key="3">重置</Button>,
            <Button key="2" type="primary">
                提交
            </Button>,
        ]}
    >
        <ProCard direction="column" ghost gutter={[0, 16]}>
            <ProCard style={{ height: 200 }} />
            <ProCard gutter={16} ghost style={{ height: 200 }}>
                <ProCard colSpan={16} />
                <ProCard colSpan={8} />
            </ProCard>
        </ProCard>
    </PageContainer>
);

export default First;