import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { getAllCategory } from "../../../services/categoryServices";

const { Option } = Select;

const CategoryDropdown = ({ onSelect }: { onSelect: (value: string) => void }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await getAllCategory();
                setCategories(response?.data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <Select
            placeholder="Chọn danh mục"
            style={{ width: "100%" }}
            onChange={onSelect}
            loading={loading}
            allowClear
        >
            {categories.map((category: any) => (
                <Option key={category.id} value={category.id}>
                    {category.name}
                </Option>
            ))}
        </Select>
    );
};

export default CategoryDropdown;
