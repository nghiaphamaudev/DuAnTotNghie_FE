import { Card, Tabs } from "antd";

import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import AdminTable from "./AdminTable";
import SuperAdminTable from "./SuperAdminTable";
import UserTable from "./UserTable";

const { TabPane } = Tabs;

function Users() {

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere="Quản Lí Account" />
      <Card bordered={false}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="SuperAdmin" key="1">
            <SuperAdminTable />
          </TabPane>
          <TabPane tab="Quản Lí Admin" key="2">
            <AdminTable />
          </TabPane>
          <TabPane tab="Quản Lí Người Dùng" key="3">
            <UserTable />
          </TabPane>
        </Tabs>
      </Card>
      
    </div>
  );
}

export default Users;
