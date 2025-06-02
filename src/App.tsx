import createRouter from "@/router";
import {RouterProvider} from "react-router";
import useAuthStore from "@stores/user.ts";
import {useEffect} from "react";

const App = () => {
    const { menus, getInfo, token } = useAuthStore()
    const router = createRouter(menus)

    useEffect(() => { if(token) getInfo() }, [getInfo, token]);

    return <RouterProvider router={router} />
}

export default App
