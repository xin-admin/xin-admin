import React from "react";
import {useGlobalStore} from "@/stores";

const HeaderLeftRender: React.FC = () => {
    const logo= useGlobalStore(state => state.logo);
    const title= useGlobalStore(state => state.title);

    return (
        <div className={"flex items-center"} >
            <img className={"w-9 mr-5"} src={logo} alt="logo"/>
            <span className={"font-semibold text-[20px] mr-2"}>{title}</span>
        </div>
    )
}

export default HeaderLeftRender;