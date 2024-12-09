import React, { useState, ReactNode } from "react";
import LogoFshirt from "../../../assets/images/logofshirt-rmbg.png";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  Row,
  Col,
  Grid,
  Modal,
} from "antd";
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineLogout,
  AiOutlineKey,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ClockCircleOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AdminMenu from "./AdminMenu";
import "./HeaderAdmin.css";

dayjs.extend(relativeTime);

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

type Notification = {
  createdAt: number;
  status: string;
  title: string;
  content: string;
  image?: string;
};

type HeaderAdminProps = {
  children: ReactNode;
};

export default function HeaderAdmin({ children }: HeaderAdminProps) {
  const notification: Notification[] = [];
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginadmin");
  };

  const showLogoutModal = async () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk: handleLogout,
      onCancel: () => {},
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="3" onClick={() => showLogoutModal()}>
        <AiOutlineLogout style={{ marginRight: "8px" }} /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu>
      {notification
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((noti, index) => (
          <React.Fragment key={index}>
            <Menu.Item
              style={{
                margin: "3px",
                borderRadius: "5px",
                backgroundColor: "#faebd2",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  maxWidth: "300px",
                  width: "300px",
                  height: "70px",
                }}
              >
                <Row gutter={8}>
                  <Col span={6}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                      }}
                    >
                      <img
                        src={
                          noti.image
                            ? noti.image
                            : "https://res.cloudinary.com/dioxktgsm/image/upload/v1701498532/zl87yxsvlm2luo5rjnyl.png"
                        }
                        alt=""
                        width="60px"
                        height="60px"
                        style={{
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={16}>
                    <div
                      style={{
                        flexDirection: "column",
                        wordWrap: "break-word",
                        marginLeft: "5px",
                      }}
                    >
                      {noti.status === "HOAT_DONG" ? (
                        <span>
                          <b>{noti.title}</b>
                          <p style={{ margin: 0 }}>{noti.content}</p>
                        </span>
                      ) : (
                        <span style={{ color: "gray" }}>
                          <b>{noti.title}</b>
                          <p style={{ margin: 0 }}>{noti.content}</p>
                        </span>
                      )}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ClockCircleOutlined
                          style={{
                            width: screens.xs ? "14px" : "17px", // Adjust size for responsiveness
                            color:
                              noti.status === "HOAT_DONG" ? "#FC7C27" : "gray",
                            marginRight: "5px",
                          }}
                        />
                        <span
                          style={{
                            color:
                              noti.status === "HOAT_DONG" ? "#FC7C27" : "gray",
                          }}
                        >
                          {dayjs(noti.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col span={2}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "15px",
                        height: "70px",
                      }}
                    >
                      <div
                        style={{
                          height: "15px",
                          width: "15px",
                          backgroundColor:
                            noti.status === "HOAT_DONG" ? "#faebd2" : "gray",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Menu.Item>
            {index < notification.length - 1 && (
              <hr style={{ padding: 0, margin: 0 }} />
            )}
          </React.Fragment>
        ))}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{ backgroundColor: "white" }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={LogoFshirt}
              alt="logo"
              style={{
                width: collapsed ? "60%" : "75%",
                height: "50%",
              }}
            />
          </div>
          <AdminMenu small={collapsed} />
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
            padding: screens.xs ? "0 10px" : "0 20px", // Adjust padding for responsiveness
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Menu Icon */}
          <div>
            {React.createElement(
              collapsed ? AiOutlineMenuUnfold : AiOutlineMenuFold,
              {
                onClick: () => setCollapsed(!collapsed),
                className: "menu-icon",
                size: screens.xs ? 20 : 24, // Adjust size based on screen size
              }
            )}
          </div>

          {/* User Icon + Notifications */}
          <div className="header-right">
            <Dropdown overlay={notificationMenu} trigger={["click"]}>
              <Badge
                count={
                  notification.filter((item) => item.status === "HOAT_DONG")
                    .length
                }
              />
            </Dropdown>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar
                style={{ marginRight: "15px", marginLeft: "15px" }}
                icon={<UserOutlined />}
                size={screens.xs ? "small" : "default"} // Adjust Avatar size for responsiveness
              />
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: "16px 16px",
            padding: screens.xs ? "10px" : "16px", // Adjust padding for responsiveness
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
