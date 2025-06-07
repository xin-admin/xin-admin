import createRouter from "@/router";
import {RouterProvider} from "react-router";
import useAuthStore from "@/stores/user.ts";

const App = () => {
    const { menus } = useAuthStore()
    const router = createRouter(menus)

    return <RouterProvider router={router} />
}

export default App
