import {type JSX, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router'
import useAuthStore from "@/stores/user";

export default function AuthRoute({ children }: { children: JSX.Element }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { token, user } = useAuthStore()

    useEffect(() => {
        async function checkAuth() {
            if (!token && location.pathname !== '/login') {
                navigate('/login', { replace: true })
            } else if (token && user && location.pathname === '/login') {
                navigate('/', { replace: true })
            }
        }
        checkAuth()
    }, [token, user, location.pathname, navigate])

    return children
}
