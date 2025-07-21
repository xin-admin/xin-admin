import {type JSX, useEffect} from 'react'
import useAuthStore from "@/stores/user.ts";

export default function Index({ children }: { children: JSX.Element }) {
  const token = useAuthStore(state => state.token)
  
  useEffect(() => {
    if (!token && location.pathname !== '/login') {
      console.log('未登录，路由重定向到登录页')
      location.href = '/login';
    }
  }, [token])

  return children
}
