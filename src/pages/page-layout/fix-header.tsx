import { ProCard, PageContainer } from "@ant-design/pro-components";
import React from "react";

const FixHeader = () => {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <div
      ref={setContainer}
    >
      <PageContainer
        fixedHeader
        affixProps={{
          target: () => container
        }}
        style={{overflow: "hidden"}}
        header={{ title: '页面标题', style: {padding: '8px 24px 0 24px'} }}
        tabList={[
          {
            tab: '已选择',
            key: '1',
          },
          {
            tab: '可点击',
            key: '2',
          },
          {
            tab: '禁用',
            key: '3',
            disabled: true,
          },
        ]}
      >
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard style={{ height: 200 }} />
          <ProCard gutter={16} ghost>
            <ProCard colSpan={16} style={{ height: 200 }} />
            <ProCard colSpan={8} style={{ height: 200 }} />
          </ProCard>
          <ProCard gutter={16} ghost>
            <ProCard colSpan={8} style={{ height: 200 }} />
            <ProCard colSpan={16} style={{ height: 200 }} />
          </ProCard>
        </ProCard>
      </PageContainer>
    </div>
  );
};

export default FixHeader;