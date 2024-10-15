import { Outlet } from "react-router-dom";
import FooterClient from "../components/common/(client)/Footer";
import HeaderClient from "../components/common/(client)/Header";

const ClientLayout = () => {
  return (
    <div className="">
      {/* Header cố định */}
      <div className="h-auto w-full fixed top-0 bg-white z-50 transition-all duration-300 ease-in-out">
        <div className="">
          <HeaderClient />
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="bg-background-2 mt-[110px] md:mt-0 lg:mt-[150px]">
        <div className="">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="md:mb-0 mb-20">
        <div className="">
          <FooterClient />
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
