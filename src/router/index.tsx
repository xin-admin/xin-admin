import { createBrowserRouter } from "react-router"
import Layout from "@/layout"
import Login from "@/pages/Login"
import { lazy, Suspense } from "react"
import AuthRoute from "@/components/AuthRoute"
import Loading from "@/components/Loading"
import React from "react";
import type {IRule} from "@/domain/iRule.ts"

const modules = import.meta.glob('/src/pages/**/*')

function lazyLoad(path: string) {
    console.log(path)
    console.log(modules[path])
    const Component = lazy(modules[path] as () => Promise<{ default: React.ComponentType }>)
    return (
        <>
            <Suspense fallback={<Loading />}>
                <AuthRoute>
                    <Component />
                </AuthRoute>
            </Suspense>
        </>
    )
}

export default function createRouter(routes: IRule[]) {
    return createBrowserRouter([
        {
            path: "/",
            Component: Layout,
            children: [
                // {
                //     index: true,
                //     path: "/",
                //     element: lazyLoad('/src/pages/Index/index.tsx'),
                // },
                // {
                //     path: "dashboard",
                //     element: lazyLoad('/src/pages/Dashboard/index.tsx')
                // },
                // 动态添加从状态中获取的路由
                ...routes.map(route => ({
                    index: route.index,
                    path: route.path,
                    element: lazyLoad(`/src/pages${route.elementPath}`),
                }))
            ],
        },
        {
            path: "login",
            element: <Login />
        },
    ])
}
