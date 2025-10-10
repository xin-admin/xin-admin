import {Breadcrumb, type BreadcrumbProps} from "antd";
import {useGlobalStore} from "@/stores";
import {useEffect, useState} from "react";
import {HomeOutlined} from "@ant-design/icons";
import IconFont from "@/components/IconFont";
import {useTranslation} from "react-i18next";

const BreadcrumbRender = () => {
  const {t} = useTranslation();
  const breadcrumb = useGlobalStore(state => state.breadcrumb);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbProps['items']>([
    {
      href: '/',
      title: <HomeOutlined />,
    }
  ])
  useEffect(() => {
    setBreadcrumbItems([
      {
        href: '/',
        title: <HomeOutlined />,
      },
      ...breadcrumb.map(item => {
        if(item.href) {
          return {
            href: item.href,
            title: (
              <>
                {item.icon && <IconFont name={item.icon} />}
                <span>{item.local ? t(item.local) : item.title}</span>
              </>
            ),
          }
        }else {
          return {
            title: (
              <>
                {item.icon && <IconFont name={item.icon} />}
                <span>{item.local ? t(item.local) : item.title}</span>
              </>
            ),
          }
        }
      })
    ])
  }, [breadcrumb, t]);

  return (
    <Breadcrumb items={breadcrumbItems}/>
  )
}

export default BreadcrumbRender;