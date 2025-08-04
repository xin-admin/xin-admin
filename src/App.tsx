import createRouter from "@/router";
import {RouterProvider} from "react-router";
import useAuthStore from "@/stores/user";
import AuthRoute from "@/components/AuthRoute"
import PageTitle from "@/components/PageTitle";

const App = () => {
  const { rules } = useAuthStore();
  const router = createRouter(rules)

  return (
    <PageTitle>
      <AuthRoute>
        <RouterProvider router={router} />
      </AuthRoute>
    </PageTitle>
  )
}

export default App
