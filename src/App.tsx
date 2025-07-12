import createRouter from "@/router";
import {RouterProvider} from "react-router";
import useAuthStore from "@/stores/user.ts";

const App = () => {
  const { rules } = useAuthStore();

  const router = createRouter(rules)

  return (
    <RouterProvider router={router} />
  )
}

export default App
