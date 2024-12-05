import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { getAllCategory, getCategoryById } from "../services/categoryServices";
import { Category, CategoryRequest } from "../common/types/Category";

type CategoryContextProps = {
  allCategory: Category[];
  activeCategoryProducts: Category["products"];
  getAllDataCategory: () => void;
  getDataCategoryById: (id: string) => void;
  addCategory: (formData: CategoryRequest) => void;
};

const CategoryContext = createContext({} as CategoryContextProps);

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export const CategoryProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [activeCategoryProducts, setActiveCategoryProducts] = useState<
    Category["products"]
  >([]);

  //   const getAllDataCategory = async () => {
  //     try {
  //       const { data } = await getAllCategory();
  //       setAllCategory(data);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };
  const getAllDataCategory = useCallback(async () => {
    try {
      const { data } = await getAllCategory(); // Gọi API để lấy danh mục
      setAllCategory(data); // Cập nhật danh mục vào state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Fetch tất cả các danh mục khi component được mount lần đầu
  useEffect(() => {
    getAllDataCategory();
  }, [getAllDataCategory]);

  const getDataCategoryById = async (id: string) => {
    try {
      const response = await getCategoryById(id);
      setActiveCategoryProducts(response?.products || []);
    } catch (error) {
      console.error("Error fetching category detail:", error);
    }
  };

  const { mutateAsync: addCategory } = useMutation({
    mutationFn: async (formData: CategoryRequest): Promise<any> => {
      const data = await addCategory(formData);
      return data;
    }
  });

  return (
    <CategoryContext.Provider
      value={{
        allCategory,
        activeCategoryProducts,
        getAllDataCategory,
        getDataCategoryById,
        addCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
