import React, { useEffect, useState } from 'react';
import { Card, Table, Pagination, Button, Input, Row, Col, Radio, Switch } from 'antd';
import { DownloadOutlined, EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { getCategoryById } from '../../../services/categoryServices';
import { Products, ProductVariant } from '../../../common/types/Product';
import { ColumnType } from 'antd/es/table';
import * as XLSX from 'xlsx';
import BreadcrumbsCustom from '../../../components/common/(admin)/BreadcrumbsCustom';
import { deleteProductStatus } from '../../../services/productServices';

const customTableHeaderCellStyle: React.CSSProperties = {
    fontWeight: 'bold',
    textAlign: 'center',
    height: '10px',
};

const CustomHeaderCell: React.FC<React.ComponentProps<'th'>> = (props) => (
    <th {...props} style={customTableHeaderCellStyle} />
);

export default function CategoryDetail() {
    const { id } = useParams();
    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<Products[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [statusFilter, setStatusFilter] = useState(1);
    const [searchValue, setSearchValue] = useState('');

    // Hàm lấy dữ liệu danh mục và sản phẩm theo ID danh mục
    const fetchCategoryData = async () => {
        try {
            const response = await getCategoryById(id!);
            if (response) {
                setCategory(response.category);
                setProducts(response.products); // Set danh sách sản phẩm
                setPagination({
                    current: 1,
                    pageSize: 5,
                    total: response.products.length,
                });
            }
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, [id]);

    const handleSearch = debounce((value: string) => {
        setSearchValue(value);
    }, 500);

    const handleStatusChange = async (checked: boolean, id: string) => {
        try {
            // Call your API to update status here
            const productData = await deleteProductStatus(id, checked);
            if (productData && productData.data) {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === productData.data.id ? { ...product, status: productData.data.status } : product
                    )
                );
            }
        } catch (error) {
            console.error('Error updating product status:', error);
        }
    };

    const handleStatusFilterChange = (e: any) => {
        setStatusFilter(e.target.value);
    };

    const columns: ColumnType<Products>[] = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'coverImg',
            render: (coverImg) => <img src={coverImg} alt="Cover" style={{ width: 100, height: 100 }} />,
        },
        {
            title: 'Số lượng',
            dataIndex: 'variants',
            key: 'quantity',
            width: '10%',
            align: 'center',
            render: (variants: ProductVariant[]) => {
                const totalQuantity = variants.reduce((total, variant) => {
                    return total + variant.sizes.reduce((sum, size) => sum + size.inventory, 0);
                }, 0);
                return totalQuantity;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '10%',
            render: (status, record) => (
                <Switch
                    checked={status === true}
                    checkedChildren=""
                    unCheckedChildren=""
                    onChange={(checked) => handleStatusChange(checked, record.id)}
                />
            ),
        },
        {
            title: 'Chi tiết',
            align: 'center',
            dataIndex: 'key',
            key: 'key',
            width: '20%',
            render: (_, record) => (
                <div>
                    <Link to={`/admin/product/${record.id}`}>
                        <EyeOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                    </Link>
                    <Link to={`/admin/product/detail/${record.id}`}>Chi tiết sản phẩm</Link>
                </div>
            ),
        },
    ];

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(products);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm');
        XLSX.writeFile(wb, 'products.xlsx');
    };

    return (
        <div>
            <BreadcrumbsCustom listLink={[]} nameHere={`Danh mục: ${category?.name || 'Loading...'}`} />
            <Card bordered={false}>
                <h2>{category?.name}</h2>
                <p>{category?.description}</p>

                <Row gutter={16}>
                    <Col span={12}>
                        <Input.Search
                            placeholder="Nhập tên sản phẩm"
                            allowClear
                            enterButton="Tìm kiếm"
                            size="large"
                            onSearch={handleSearch}
                        />
                    </Col>
                    <Col span={12}>
                        <Button
                            icon={<DownloadOutlined />}
                            style={{
                                float: 'right',
                                marginLeft: '12px',
                                backgroundColor: 'white',
                                color: 'green',
                                borderColor: 'green',
                            }}
                            type="default"
                            onClick={handleExportExcel}
                        >
                            Xuất Excel
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusCircleFilled />}
                            style={{ float: 'right' }}
                        >
                            <Link to={`/admin/product/add`}>Tạo sản phẩm</Link>
                        </Button>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '12px' }}>
                    <Col span={12}>
                        <span>Trạng thái: </span>
                        <Radio.Group value={statusFilter} onChange={handleStatusFilterChange}>
                            <Radio value={1}>Tất cả</Radio>
                            <Radio value={2}>Hoạt động</Radio>
                            <Radio value={3}>Ngưng hoạt động</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
            </Card>

            <Card style={{ marginTop: '12px' }}>
                <Table
                    components={{
                        header: {
                            cell: CustomHeaderCell,
                        },
                    }}
                    dataSource={products}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                />
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => {
                        setPagination({ ...pagination, current: page, pageSize });
                    }}
                />
            </Card>
        </div>
    );
}
