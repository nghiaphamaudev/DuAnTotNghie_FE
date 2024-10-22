import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProduct, getProductById } from "../services/productServices";
import { useMutation } from "@tanstack/react-query";

type ProductContextProps = {
    allProduct: any[];
    product: any
    setAllProduct: React.Dispatch<React.SetStateAction<any[]>>
    getAllDataProduct: () => void
    getDataProductById: (id: string) => void
}

const ProductContext = createContext({} as ProductContextProps)
export const useProduct = () => {
    const context = useContext(ProductContext)
    if (!context) {
        throw new Error('useProduct must be used within an AuthProvider')
    }
    return context
}


export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const nav = useNavigate()
    const [ allProduct, setAllProduct ] = useState<any[]>([])
    const [ product, setProduct ] = useState<any[]>([])
    const { mutateAsync: getAllDataProduct } = useMutation({
        mutationFn: async () => {
            const data = await getAllProduct()
            setAllProduct(data.data)
            return data
        },
    })

    const { mutateAsync: getDataProductById } = useMutation({
        mutationFn: async (id: string) => {
            const data = await getProductById(id)
            setProduct(data)
            return data
        },
    })


    return (
        <ProductContext.Provider value={{ allProduct, product, setAllProduct, getAllDataProduct, getDataProductById }}>
        {children}
      </ProductContext.Provider>
    )
}