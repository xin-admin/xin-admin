import React from 'react';
import {useGlobalStore} from "@/stores";

/** 自定义头标题的方法 */
const HeaderTitleRender: React.FC = () => {
    const {logo, title} = useGlobalStore();

    return (
        <div className="flex justify-center items-center h-14 border-b-1 border-b-[#ebebeb] border-b-solid mb-3">
            <img className="w-8 mr-[10px]" src={ logo } alt="logo" />
            <h1 className="font-semibold text-[18px]">{ title }</h1>
        </div>
    )
}

export default HeaderTitleRender;
