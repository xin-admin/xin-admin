// src/components/AuthRoute.tsx
import {type JSX, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useGlobalStore } from '@/stores'

export default function AuthRoute({ children }: { children: JSX.Element }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, fetchRoutes } = useGlobalStore()

    useEffect(() => {
        async function checkAuth() {
            if (!isAuthenticated && location.pathname !== '/login') {
                navigate('/login', { replace: true })
            } else if (isAuthenticated && location.pathname === '/login') {
                navigate('/', { replace: true })
            }

            // 如果已认证但路由为空，则获取路由
            if (isAuthenticated) {
                await fetchRoutes()
            }
        }

        checkAuth()
    }, [isAuthenticated, location.pathname, navigate, fetchRoutes])

    return children
}