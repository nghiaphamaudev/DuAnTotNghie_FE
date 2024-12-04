
import { Button, Card, Pagination, Tabs, Typography } from "antd";
import React, { useState } from "react";
import { fetchVouchers } from "../../../../services/voucher";
import { useQuery } from "@tanstack/react-query";
import { IVoucher } from "../../../../interface/Voucher";
import dayjs from "dayjs";

const { Text } = Typography;

const PromoCodePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => await fetchVouchers(),
  });
  const paginatedData = data
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  return (
    <>
      <div className="p-6">
        <Typography.Title level={3}>Mã ưu đãi</Typography.Title>
        <Tabs
          defaultActiveKey="2"
          tabBarStyle={{
            color: "#2AB573",
          }}
          className="ant-tabs-green"
        />
        <div className="mt-4">
          <Typography.Text className="font-semibold">
            Mã ưu đãi của bạn:
          </Typography.Text>

          <div className="flex justify-center items-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p>Error fetching data</p>
              ) : (
                paginatedData.map((voucher: IVoucher) => (
                  <Card className="shadow-md w-full" key={voucher._id}>
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong className="text-lg">
                          {voucher.code}
                        </Text>
                        <p className="text-gray-500">{voucher.description}</p>
                        <Text className="text-gray-400">
                          HSD :{" "}
                          {dayjs(voucher.expirationDate).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text className="text-gray-400 ">
                        Số lượng: {voucher.quantity}
                      </Text>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-end">
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#2AB573",
                          borderColor: "#2AB573",
                        }}
                        className="bg-blue-500"
                      >
                        Mua ngay
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            total={data ? data.length : 0}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default PromoCodePage;
