import {useGlobalStore} from "@/stores";
import createRouter from "@/router";
import {RouterProvider} from "react-router";

const App = () => {
    const { routes } = useGlobalStore();
    const router = createRouter(routes)

    return <RouterProvider router={router} />
}

export default App
