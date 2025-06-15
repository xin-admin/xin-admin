import {createBrowserRouter, type DataRouteObject, Navigate} from "react-router"
import Layout from "@/layout"
import Login from "@/pages/Login"
import { lazy, Suspense } from "react"
import AuthRoute from "@/components/AuthRoute"
import Loading from "@/components/Loading"
import React from "react";
import type {IRule} from "@/domain/iRule.ts"

const modules = import.meta.glob('/src/pages/**/*')

function lazyLoad(path: string) {
    const Component = lazy(modules[path] as () => Promise<{ default: React.ComponentType }>)
    return (
        <Suspense fallback={<Loading />}>
            <AuthRoute>
                <Component />
            </AuthRoute>
        </Suspense>
    )
}

export default function createRouter(rules: IRule[]) {

    const transformRoutes = (pid: number = 0): DataRouteObject[] => {
        const routes: DataRouteObject[] = [];
        rules.forEach((rule) => {

            if (!rule.key || !rule.type || rule.parent_id != pid || !['route', 'menu'].includes(rule.type)) {
                return;
            }
            const route: DataRouteObject = {
                id: rule.key,
                path: rule.path,
                index: rule.index,
            }
            if(rule.elementPath && modules[`/src/pages${rule.elementPath}.tsx`]) {
                route.element = lazyLoad(`/src/pages${rule.elementPath}.tsx`)
            }
            // 不能在索引路由上定义子路由
            // TODO 需要优化嵌套路由
            if(rule.index || rule.type === "route") {
                routes.push(route);
                return;
            }

            const children = transformRoutes(rule.rule_id)
            if(children && children.length) {
                route.children = children
            }
            routes.push(route);
        })

        return routes;
    }

    const routes  = transformRoutes()
    console.log(routes)

    return createBrowserRouter([
        {
            path: "/",
            Component: Layout,
            children: [
                ...routes,
                {
                    path: "*",
                    element: <Navigate to="/404" />
                }
            ],
        },
        {
            path: "login",
            element: <Login />
        },
    ])
}