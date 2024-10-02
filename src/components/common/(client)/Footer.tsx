import { Facebook, Headset, Instagram, Twitter, Youtube } from 'lucide-react';
// Import Swiper styles
import { Button, Collapse, CollapseProps, Input } from 'antd';


const FooterClient = () => {
    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    const item: CollapseProps['items'] = [
        {
            key: '1',
            label: 'HỖ TRỢ KHÁCH HÀNG',
            children:
                <ul className='text-text-2'>
                    <li className='text-large mb-1'>Hướng dẫn mua hàng</li>
                    <li className='text-large my-1'>Hướng dẫn chọn size</li>
                    <li className='text-large my-1'>Phương thức thanh toán</li>
                    <li className='text-large my-1'>Chính sách bảo mật</li>
                </ul>
            ,
        },
        {
            key: '2',
            label: 'VỀ CHÚNG TÔI',
            children:
                <ul className='text-text-2'>
                    <li className='text-large mb-1'>Hướng dẫn mua hàng</li>
                    <li className='text-large my-1'>Hướng dẫn chọn size</li>
                    <li className='text-large my-1'>Phương thức thanh toán</li>
                    <li className='text-large my-1'>Chính sách bảo mật</li>
                </ul>,
        },
        {
            key: '3',
            label: 'HỆ THỐNG CỬA HÀNG',
            children:
                <ul className='text-text-2'>
                    <li className='text-large mb-1'>Hướng dẫn mua hàng</li>
                    <li className='text-large my-1'>Hướng dẫn chọn size</li>
                    <li className='text-large my-1'>Phương thức thanh toán</li>
                    <li className='text-large my-1'>Chính sách bảo mật</li>
                </ul>,
        },
    ];
    return (
        <>
            <div className='px-2 sm:px-4 md:px-10 md:pt-10 pb-3 pt-3 border-t border-t-bg-1 mt-5'>
                <div className='grid grid-cols-1 justify-center xsm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <div className='mx-auto border-b border-b-bg-1 lg:border-none py-2 w-full'>
                        <h3 className='text-medium text-text-1'>GỌI MUA HÀNG(8:30 - 22:20)</h3>
                        <p className='text-3xl my-3 flex items-center space-x-2'>
                            <div className='size-10 rounded-full bg-active flex items-center justify-center'>
                                <Headset />
                            </div>
                            <p className='text-text-1'>099999999</p>
                        </p>
                        <p className='text-text-1'>Tất cả các ngày trong tuần</p>
                    </div>
                    <div className='mx-auto border-b border-b-bg-1 lg:border-none py-2 w-full'>
                        <h3 className='text-medium text-text-1'>GỌI MUA HÀNG(8:30 - 22:20)</h3>
                        <p className='text-3xl my-3 flex items-center space-x-2'>
                            <div className='size-10 rounded-full bg-active flex items-center justify-center'>
                                <Headset />
                            </div>
                            <p className='text-text-1'>099999999</p>
                        </p>
                        <p className='text-text-1'>Tất cả các ngày trong tuần</p>
                    </div>
                    <div className='mx-auto border-b border-b-bg-1 lg:border-none py-2 w-full'>
                        <h3 className='text-medium text-text-1'>ĐĂNG KÝ NHẬN THÔNG TIN MỚI</h3>
                        <form className='mt-3 max-w-[280px] xsm:max-w-32 sm:max-w-44 md:max-w-72 lg:max-w-36 relative '>
                            <Input className='border-r-0 w-full rounded h-10' placeholder="Email" />
                            <Button className='rounded-l-none absolute -right-20 h-10 bg-active text-active' color="default" variant="solid">
                                Đăng ký
                            </Button>
                        </form>
                    </div>
                    <div className='mx-auto border-b border-b-bg-1 lg:border-none py-2 w-full'>
                        <h3 className='text-medium text-text-1'>THEO DÕI CHÚNG TÔI</h3>
                        <div className='flex space-x-2 mt-2'>
                            <Facebook size={40} />
                            <Instagram size={40} />
                            <Twitter size={40} />
                            <Youtube size={40} />
                        </div>
                    </div>

                </div>
            </div>
            <div className='px-2 sm:px-4 md:px-10 bg-bg-2 '>
                <div className='xsm:grid gap-4 grid-cols-2 md:grid-cols-4 hidden py-4'>
                    <div>
                        <p className='text-medium text-text-1'>HỖ TRỢ KHÁCH HÀNG</p>
                        <ul className='text-text-2'>
                            <li className='text-large my-1'>Hướng dẫn mua hàng</li>
                            <li className='text-large my-1'>Hướng dẫn chọn size</li>
                            <li className='text-large my-1'>Phương thức thanh toán</li>
                            <li className='text-large my-1'>Chính sách bảo mật</li>
                        </ul>
                    </div>
                    <div>
                        <p className='text-medium text-text-1'>HỖ TRỢ KHÁCH HÀNG</p>
                        <ul className='text-text-2'>
                            <li className='text-large my-1'>Hướng dẫn mua hàng</li>
                            <li className='text-large my-1'>Hướng dẫn chọn size</li>
                            <li className='text-large my-1'>Phương thức thanh toán</li>
                            <li className='text-large my-1'>Chính sách bảo mật</li>
                        </ul>
                    </div>
                    <div>
                        <p className='text-medium text-text-1'>HỖ TRỢ KHÁCH HÀNG</p>
                        <ul className='text-text-2'>
                            <li className='text-large my-1'>Hướng dẫn mua hàng</li>
                            <li className='text-large my-1'>Hướng dẫn chọn size</li>
                            <li className='text-large my-1'>Phương thức thanh toán</li>
                            <li className='text-large my-1'>Chính sách bảo mật</li>
                        </ul>
                    </div>
                    <div>
                        <p className='text-medium text-text-1'>HỖ TRỢ KHÁCH HÀNG</p>
                        <ul className='text-text-2'>
                            <li className='text-large my-1'>Hướng dẫn mua hàng</li>
                            <li className='text-large my-1'>Hướng dẫn chọn size</li>
                            <li className='text-large my-1'>Phương thức thanh toán</li>
                            <li className='text-large my-1'>Chính sách bảo mật</li>
                        </ul>
                    </div>
                </div>
                <Collapse className='border-none bg-bg-2 block xsm:hidden' items={item} defaultActiveKey={['']} onChange={onChange} />
            </div>
        </>
    )
}

export default FooterClient