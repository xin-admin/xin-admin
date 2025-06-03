import React from 'react';
import {useGlobalStore} from "@/stores";

/** 自定义头标题的方法 */
const HeaderTitleRender: React.FC = () => {
    const {logo, title} = useGlobalStore();

    return (
        <div className="flex justify-center items-center ">
            <img className="w-8 mr-[10px]" src={ logo } alt="logo" />
            <h1 className="font-semibold text-[18px]">{ title }</h1>
        </div>
    )
}

export default HeaderTitleRender;
