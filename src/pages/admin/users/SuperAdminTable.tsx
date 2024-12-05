import React, { useMemo, useState } from "react";
import { Card, Table } from "antd";
import SearchCustomer from "./SearchCustoms";
import { UserAdmin } from "../../../common/types/User";
import { useQuery } from "@tanstack/react-query";
import { getSuperAndAdmin } from "../../../services/authServices";

const columnsSuperAdmin = [
  { title: "STT", dataIndex: "stt", key: "stt", width: 60, align: "center", render: (_: unknown, __: UserAdmin, index: number) => index + 1, },
  {
    title: "Ảnh",
    dataIndex: "coverImg",
    key: "coverImg",
    align: "center",
    render: (text: string) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={text}
          alt="cover"
          style={{
            width: 80,
            height: 80,
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>
    ),
  },
  { title: "Tên", dataIndex: "fullName", key: "fullName", align: "center" },
  { title: "Email", dataIndex: "email", key: "email", align: "center" },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
    align: "center",
    width: 120, 
  },
];



const SuperAdminTable: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const { data: adminAccount = [] } = useQuery<UserAdmin[]>({
    queryKey: ["SuperAdminAccount"],
    queryFn: async () => {
      const res = await getSuperAndAdmin();
      return res.superAdmins.data;
    },
  });

  const filteredAdmins = useMemo(() => {
    if (!searchKeyword) return adminAccount;
    return adminAccount.filter((superadmin) =>
      superadmin.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, adminAccount]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };


  return (
    <Card style={{ border: "none" }}>
      <SearchCustomer onSearch={handleSearch} dataToExport={filteredAdmins} />
      <div className="relative overflow-x-auto mt-6">
        <Table
          columns={columnsSuperAdmin}
          dataSource={filteredAdmins}
          pagination={false}
          bordered
        />
      </div>
    </Card>
  );
};

export default SuperAdminTable;
