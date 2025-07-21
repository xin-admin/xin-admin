import createRouter from "@/router";
import {RouterProvider} from "react-router";
import useAuthStore from "@/stores/user";
import AuthRoute from "@/components/AuthRoute"

const App = () => {
  const { rules } = useAuthStore();
  const router = createRouter(rules)

  return (
    <AuthRoute>
      <RouterProvider router={router} />
    </AuthRoute>
  )
}

export default App
