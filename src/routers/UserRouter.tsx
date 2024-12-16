// import { notification } from "antd";
// import { ReactNode } from "react";
// import { Navigate } from "react-router-dom";

// interface PrivateRouteProps {
//   children: ReactNode;
//   requireUser?: boolean;
// }

// const PrivateRouteruser = ({ children, requireUser = false }: PrivateRouteProps) => {
//   const userData = localStorage.getItem("useradmin");
//   const user = userData ? JSON.parse(userData) : null;

//   if (!user) {
//     return <Navigate to="/loginadmin" />;
//   }

//   if (requireUser && !["superadmin"].includes(user.role)) {
//     notification.warning({ message: "Bạn không có quyền vào trang này" });
//     return <Navigate to="/admin" />;
//   }

//   return <>{children}</>;
// };

// export default PrivateRouteruser;
