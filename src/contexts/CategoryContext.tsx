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
import { socket } from "../socket/index"; // Import socket

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

  // Lấy tất cả danh mục
  const getAllDataCategory = useCallback(async () => {
    try {
      const { data } = await getAllCategory();
      setAllCategory(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Lấy sản phẩm của danh mục theo ID
  const getDataCategoryById = async (id: string) => {
    try {
      const response = await getCategoryById(id);
      setActiveCategoryProducts(response?.products || []);
    } catch (error) {
      console.error("Error fetching category detail:", error);
    }
  };

  // Mutation thêm danh mục
  const { mutateAsync: addCategory } = useMutation({
    mutationFn: async (formData: CategoryRequest): Promise<any> => {
      const data = await addCategory(formData);
      return data;
    }
  });

  // Lắng nghe sự kiện "hidden product"
  useEffect(() => {
    const handleHiddenProduct = (productId: string) => {
      console.log(`Product hidden: ${productId}`);

      // Cập nhật trạng thái sản phẩm
      setActiveCategoryProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, isActive: false } : product
        )
      );
    };

    // Lắng nghe sự kiện từ socket
    socket.on("hidden product", handleHiddenProduct);

    // Cleanup listener
    return () => {
      socket.off("hidden product", handleHiddenProduct);
    };
  }, []);

  // Fetch danh mục khi component được mount
  useEffect(() => {
    getAllDataCategory();
  }, [getAllDataCategory]);

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
