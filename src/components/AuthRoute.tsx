import {type JSX, useEffect} from 'react'
import { useNavigate } from 'react-router'
import useAuthStore from "@/stores/user";

export default function AuthRoute({ children }: { children: JSX.Element }) {
    const navigate = useNavigate()
    const { token } = useAuthStore()

    useEffect(() => {
        // if (!token) {
        //     console.log('未登录，路由重定向到登录页')
        //     navigate('/login', { replace: true })
        // }
    }, [navigate, token])

    return children
}
