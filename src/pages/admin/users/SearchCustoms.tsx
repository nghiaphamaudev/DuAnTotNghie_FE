import React from "react";
import { Button, Col, Row } from "antd";
import Search from "antd/es/input/Search";
import * as XLSX from "xlsx";
import { DownloadOutlined } from "@ant-design/icons";

interface SearchCustomerProps {
  onSearch: (value: string) => void;
  dataToExport: unknown[];
}

const SearchCustomer: React.FC<SearchCustomerProps> = ({ onSearch, dataToExport }) => {
  const handleExportExcel = () => {
    // Tạo WorkSheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Tạo WorkBook và thêm WorkSheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách");

    // Xuất file Excel
    XLSX.writeFile(workbook, "DanhSachNguoiDung.xlsx");
  };
  return (
    <Row gutter={16} className="flex flex-wrap" >
      <Col span={12} className="mb-4 md:mb-0">
        <Search
          placeholder="Tìm kiếm người dùng"
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          onSearch={onSearch}
          className="w-full"
        />
      </Col>
      <Col span={12} className="mb-4 md:mb-0">
        <Button
          icon={<DownloadOutlined />}
          style={{
            float: "right",
            marginLeft: "12px",
            backgroundColor: "white",
            color: "green",
            borderColor: "green",
          }}
          onClick={handleExportExcel}
          type="default"
        >
          Xuất Excel
        </Button>
      </Col>
    </Row>
  );
};

export default SearchCustomer;
