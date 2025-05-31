import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import createRouter from '@/router';
import {useGlobalStore} from "@/stores";

const root = document.getElementById("root");

function App() {
    const { routes } = useGlobalStore()
    const router = createRouter(isAuthenticated ? routes : [])

    return <RouterProvider router={router} />
}

ReactDOM.createRoot(root!).render(
    <RouterProvider router={router} />
);
