import {createBrowserRouter} from "react-router";
import Layout from "../layout";
import Login from "../pages/Login";
import {lazy} from "react";

const modules = import.meta.glob('../pages/*/**/*.tsx') as never;

console.log(modules);

export default createBrowserRouter([
    {
        // no path on this parent route, just the component
        Component: Layout,
        children: [
            {
                index: true,
                path: "/",
                Component: lazy(modules["../pages/Index/index.tsx"]),
            },
            {
                path: "dashboard",
                Component: lazy(modules['../pages/Dashboard/index.tsx']) },

        ],
    },
    { path: "login", Component: Login },
]);
