import vnpay from "../../../assets/images/vnpay.png";
import codpay from "../../../assets/images/codpay.png";
import zalopay from "../../../assets/images/zalopay.png";
import LogoFshirt from "../../../assets/images/logofshirt-rmbg.png";

const FooterClient = () => {
  return (
    <>
      <footer className="bg-white mt-5">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2">
            <div className="border-b border-gray-100 py-8 lg:order-last lg:border-b-0 lg:border-s lg:py-16 lg:ps-16">
              <div className="flex flex-col justify-center items-center mb-10 ">
                <img
                  src={LogoFshirt}
                  className="w-[150px] sm:w-[200px] md:w-[250px] lg:w-[250px]"
                  alt="Logo"
                />

                <div className="w-1/5 h-0.5 bg-[#9a9a9a] my-2"></div>
              </div>

              <div className="mt-8 space-y-4 lg:mt-0">
                <span className="hidden h-1 w-14 rounded bg-teal-500 lg:block"></span>
                <div>
                  <h2 className="text-2xl font-medium text-gray-900 uppercase">
                    Thời trang nam FSHIRT
                  </h2>
                  <p className="mt-2 max-w-lg text-gray-500 ">
                    Fshirt là cửa hàng thời trang chuyên cung cấp các sản phẩm
                    quần áo nam chất lượng cao. Với phong cách hiện đại và đa
                    dạng, Fshirt mang đến cho khách hàng những bộ trang phục từ
                    áo thun, áo sơ mi,... Chúng tôi cam kết mang lại sự thoải
                    mái và phong cách cho phái mạnh, giúp bạn tự tin và nổi bật
                    trong mọi hoàn cảnh. Hãy đến với Fshirt để trải nghiệm sự
                    khác biệt và đẳng cấp trong từng sản phẩm!
                  </p>
                </div>

                <form className="mt-6 w-full">
                  <label htmlFor="UserEmail" className="sr-only">
                    {" "}
                    Email{" "}
                  </label>

                  {/* <div className="rounded-md border border-gray-100 p-2  sm:flex sm:items-center sm:gap-4">
                    <input
                      type="email"
                      id="UserEmail"
                      placeholder="email@gmail.com"
                      className="w-full border-none px-6 py-3 focus:border-transparent focus:ring-transparent sm:text-sm"
                    />

                    <button className="mt-1 w-full rounded bg-teal-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-none hover:bg-teal-600 sm:mt-0 sm:w-auto sm:shrink-0">
                      Sign Up
                    </button>
                  </div> */}
                </form>
              </div>
            </div>

            <div className="py-3 lg:py-16 lg:pe-16">
              <div className="mt-2 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Thông tin liên hệ
                  </p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-700 transition hover:opacity-75"
                      >
                        {" "}
                        <strong> Địa chỉ:</strong>Tầng 8, tòa nhà Ford, số 313
                        Trường Chinh, quận Thanh Xuân, Hà Nội
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="text-gray-700 transition hover:opacity-75"
                      >
                        {" "}
                        <strong>Email:</strong> cdfpt@fpt.edu.vn
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="text-gray-700 transition hover:opacity-75"
                      >
                        {" "}
                        <strong>Điện thoại:</strong> 0984282598
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Nhóm liên kết</p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-700 transition hover:opacity-75"
                      >
                        {" "}
                        Trang chủ
                      </a>
                    </li>

                    <li>
                      <a
                        href="/product"
                        className="text-gray-700 transition hover:opacity-75"
                      >
                        {" "}
                        Sản phẩm
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="text-gray-700 transition hover:opacity-75"
                      >
                        {" "}
                        Bộ sưu tập
                      </a>
                    </li>
                    <li>
                      <a
                        href="/aboutus"
                        className="text-gray-700 transition hover:opacity-75"
                      >
                        {" "}
                        Về chúng tôi
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Phương thức thanh toán
                  </p>

                  <ul className="mt-3 flex justify-start items-center">
                    <img src={codpay} className="w-[50px]" alt="CODPAY" />
                    <img src={vnpay} className="w-[50px]" alt="VNPAY" />
                  </ul>
                </div>
              </div>

              <div className="mt-2 border-t border-gray-100 pt-8">
                <ul className="flex flex-wrap gap-4 text-xs">
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 transition hover:opacity-75"
                    >
                      {" "}
                      Uy tín & Chất lượng{" "}
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-gray-500 transition hover:opacity-75"
                    >
                      {" "}
                      Giá cả phải chăng{" "}
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-gray-500 transition hover:opacity-75"
                    >
                      {" "}
                      Lịch lãm & Phong cách{" "}
                    </a>
                  </li>
                </ul>

                <p className="mt-8 text-xs text-gray-500">
                  &copy; 2024. FSHIRT TEAM
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterClient;
