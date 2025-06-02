import {type JSX, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router'
import useAuthStore from "@stores/user.ts";

export default function AuthRoute({ children }: { children: JSX.Element }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthStore()

    useEffect(() => {
        async function checkAuth() {
            if (!user && location.pathname !== '/login') {
                navigate('/login', { replace: true })
            } else if (user && location.pathname === '/login') {
                navigate('/', { replace: true })
            }
        }
        checkAuth()
    }, [user, location.pathname, navigate])

    return children
}
