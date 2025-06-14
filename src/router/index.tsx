import {createBrowserRouter, type DataRouteObject, Navigate} from "react-router"
import Layout from "@/layout"
import Login from "@/pages/Login"
import { lazy, Suspense } from "react"
import AuthRoute from "@/components/AuthRoute"
import Loading from "@/components/Loading"
import React from "react";
import type {IRule} from "@/domain/iRule.ts"
import defaultRoute from "@/router/default.ts";

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

    console.log(rules);
    const buildRoute = (rule: IRule): DataRouteObject | undefined => {
        if (!['route', 'menu'].includes(rule.type!)) {
            return;
        }

        const route: DataRouteObject = {
            id: rule.key!,
            path: rule.path,
            index: rule.index,
        }

        if(rule.elementPath && modules[`/src/pages${rule.elementPath}.tsx`]) {
            route.element = lazyLoad(`/src/pages${rule.elementPath}.tsx`)
        }

        // 不能在索引路由上定义子路由
        if(rule.index) {
            return route
        }

        if(rule.children && rule.children.length) {
            const children: DataRouteObject['children'] = [];
            rule.children.forEach(child => {
                const childRoute = buildRoute(child)
                if(childRoute) {
                    children.push(childRoute)
                }
            })
            route.children = children
        }
        return route
    }

    const routes  = defaultRoute.map(route => buildRoute(route)!)
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