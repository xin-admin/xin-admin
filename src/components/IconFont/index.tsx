import { createFromIconfontCN, ExclamationOutlined } from '@ant-design/icons';
import * as AntdIcons from '@ant-design/icons';
import React from 'react';
import {categories, oauthScriptUrl} from '@/utils/iconFields.ts'

const allIcons: any = AntdIcons;

const OtherIcons = createFromIconfontCN({
  scriptUrl: oauthScriptUrl,
});

const IconFont = (props: {name?: string}) => {
  if (!props.name || !categories.allIcons.includes(props.name)) {
    return <ExclamationOutlined />
  } else if(allIcons[props.name]) {
    return React.createElement(allIcons[props.name])
  } else {
    return <OtherIcons type={props.name} className={props.name} />
  }
}

export default IconFont;