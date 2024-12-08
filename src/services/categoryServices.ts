import instance from "../config/axios";

export const getAllCategory = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data } = await instance.get("/categories");
    return data;
  } catch (error) {
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addCategory = async (payload: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data } = await instance.post("/categories", payload);
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};
export const getCategoryDetail = async (id: string) => {
  try {
    const { data } = await instance.get(`/categories/detail/${id}`);
    console.log("Category data fetched successfully:", data);

    return data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const { data } = await instance.get(`/categories/${id}`);
    console.log("Category data fetched successfully:", data);

    return data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCategory = async (data: any, id: string) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/categories/${id}`,
    {
      method: "PATCH",
      body: data
    }
  );
  return await response.json();
};

export const updateCategoryStatus = async (id: string, active: boolean) => {
  try {
    const response = await instance.patch(`/categories/${id}/status`, {
      active
    });
    console.log("Api res", response.data);
    if (!response.data || !response.data.data || !response.data.data.id) {
      throw new Error("Category ID is invalid");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
};

// export const deleteProductStatus = async (id: string, isActive: boolean) => {
//     try {
//         const response = await instance.patch(`/products/${id}/status`, { isActive });
//         console.log('API response:', response.data);
//         if (!response.data || !response.data.data || !response.data.data.id) {
//             throw new Error('Product ID is invalid');
//         }

//         return response.data;
//     } catch (error) {
//         console.error('Error updating product status:', error);
//         throw error;
//     }
// };
