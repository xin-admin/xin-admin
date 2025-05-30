import {Outlet} from "react-router";

const Layout =  () => {

    return (
        <div>
            <a href="/">首页</a>
            <a href="/dashboard">仪表盘</a>
            <a href="/login">登录页</a>
            <Outlet/>
        </div>
    );
}

export default  Layout;