import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../common/types/User";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginAccount, registerAccount } from "../services/authServices";

type AuthContextProps = {
    isLogin: boolean
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
    register: (formData: any) => void
    login: (formData: any) => void
    user: User | null,
    handleLogout: () => void
}

const AuthContext = createContext({} as AuthContextProps)
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const nav = useNavigate()
    const [isLogin, setIsLogin] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [messageApi, contextHolder] = message.useMessage()
    const token = localStorage.getItem('accessToken')

    useEffect(() => {
        if (token) {
            setIsLogin(true)
        } else {
            setIsLogin(false)
        }
    })

    // mutation register
    const { mutateAsync: register } = useMutation({
        mutationFn: async (formData: any) => {
            const data = await registerAccount(formData)
            return data
        },

    })

    // mutation login
    const { mutateAsync: login } = useMutation({
        mutationFn: async (formData: any) => {
            const data = await loginAccount(formData)
            return data
        },
        onSuccess: (data: any) => {
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('user', JSON.stringify(data.data))
            setUser(data.data)
        }
    })
    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        setIsLogin(false)
        setUser(null)
        nav('/')
    }
    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, register, login, user, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}