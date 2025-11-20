import createRouter from "@/router";
import {RouterProvider} from "react-router";
import useAuthStore from "@/stores/user";
import AuthRoute from "@/components/AuthRoute"
import PageTitle from "@/components/PageTitle";
import AntdProvider from "@/components/AntdProvider";
import { useGlobalStore } from "./stores";
import { useEffect } from "react";
import { getWebInfo } from "./api";

const App = () => {
  const { menus } = useAuthStore();
  const setWebInfo = useGlobalStore(state => state.setWebInfo);
  const router = createRouter(menus);

  useEffect(() => {
    getWebInfo().then(({data}) => {
      const webInfo = data.data;
      setWebInfo(
        webInfo?.title || "Xin Admin", 
        webInfo?.subtitle || "基于 Ant Design 的后台管理框架", 
        webInfo?.describe || "Xin Admin 是一个基于 Ant Design 的后台管理框架", 
        webInfo?.logo || "https://file.xinadmin.cn/file/favicons.ico"
      );
    }).catch(() => {
      setWebInfo(
        "Xin Admin",
        "基于 Ant Design 的后台管理框架",
        "Xin Admin 是一个基于 Ant Design 的后台管理框架",
        "https://file.xinadmin.cn/file/favicons.ico"
      );
    });
  }, [])

  return (
    <AntdProvider>
      <PageTitle>
        <AuthRoute>
          <RouterProvider router={router} />
        </AuthRoute>
      </PageTitle>
    </AntdProvider>
  )
}

export default App
