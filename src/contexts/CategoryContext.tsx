import { useMutation } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { Category, CategoryRequest } from "../common/types/Category";

type CategoryContextProps = {
    // allCategory: Category[];
    // category: Category | null;
    // setAllCategory: React.Dispatch<React.SetStateAction<Category[]>>;
    // getAllDataCategory: () => void;
    // getDataCategoryById: (id: string) => void;
    addCategory: (formData: CategoryRequest) => void;
};

const CategoryContext = createContext({} as CategoryContextProps);
// eslint-disable-next-line react-refresh/only-export-components
export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory must be used within an AuthProvider");
    }
    return context;
};

export const CategoryProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    
    const { mutateAsync: addCategory } = useMutation({
        mutationFn: async (formData: CategoryRequest): Promise<any> => {
            const data = await addCategory(formData);
            return data;
        },
    });

    return (
        <CategoryContext.Provider
            value={{
                addCategory
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};
