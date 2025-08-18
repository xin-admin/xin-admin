import {createBrowserRouter, type DataRouteObject, Navigate} from "react-router"
import Layout from "@/layout"
import Login from "@/pages/login"
import { lazy, Suspense } from "react"
import Loading from "@/components/Loading"
import React from "react";
import type {IRule} from "@/domain/iRule.ts"

const modules = import.meta.glob('/src/pages/**/*')

function lazyLoad(path: string) {
  if(modules[path]) {
    const Component = lazy(modules[path] as () => Promise<{ default: React.ComponentType }>)
    return (
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    )
  }
  return <></>;
}

export default function createRouter(rules: IRule[]) {
  const routes: DataRouteObject[] = [];
  // 构建路由，只循环路由确保附加嵌套路由的时候父路由存在
  rules.forEach(rule => {
    if(rule.link) {
      // 如果是外链，则退出
      return;
    }
    if(rule.type === "route" && rule.elementPath) {
      const route: DataRouteObject = {
        id: rule.key,
        path: rule.path,
        element: lazyLoad(`/src/pages${rule.elementPath}.tsx`),
      }
      const childrenRules = rules.filter(item => item.elementPath && item.type === "nested-route" && item.pid === rule.id)
      if (childrenRules.length) {
        route.children = childrenRules.sort((a, b) => (b.order || 0) - (a.order || 0)).map((item, key) => {
          if(key === 0) {
            return {
              id: item.key,
              index: true,
              element: lazyLoad(`/src/pages${item.elementPath}.tsx`),
            }
          }else {
            return {
              id: item.key,
              path: item.path,
              element: lazyLoad(`/src/pages${item.elementPath}.tsx`)
            }
          }
        })
      }
      routes.push(route)
    }
  })

  return createBrowserRouter([
    {
      Component: Layout,
      children: [
        ...routes,
        {
          path: "*",
          element: lazyLoad(`/src/pages/result/404.tsx`)
        }
      ],
    },
    {
      path: '/',
      element: <Navigate to="/dashboard/analysis"/>
    },
    {
      path: "login",
      element: <Login />
    },
  ])
}