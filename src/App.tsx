import createRouter from "@/router";
import {RouterProvider} from "react-router";
import useAuthStore from "@/stores/user";
import AuthRoute from "@/components/AuthRoute"
import PageTitle from "@/components/PageTitle";
import AntdProvider from "@/components/AntdProvider";

const App = () => {
  const { rules } = useAuthStore();
  const router = createRouter(rules)

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
