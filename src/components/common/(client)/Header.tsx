import { Dropdown, MenuProps, Space } from 'antd';
import { AlignJustify, ChevronDown, Chrome, CircleUserRound, PhoneCall, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';


const HeaderClient = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Tạo state để điều khiển menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Đổi trạng thái khi nhấn nút
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'My Account',
      disabled: true,
    },
    {
      key: '2',
      label: 'Thông tin cá nhân',
    },
    {
      key: '3',
      label: 'Lịch sử đặt hàng',
    },
    {
      key: '4',
      label: 'Đăng xuất',
    },
  ];
  return (
    <div>
    <div className='bg-active w-full hidden text-white py-2 px-16 md:flex justify-between items-center'>
      <div className='text-base lg:text-[14px] flex items-center space-x-2'>
        <PhoneCall size={18} />
        <span>0988888888</span>
      </div>
      <div className='flex items-center gap-6'>
        <button className='bg-transparent text-large flex items-center space-x-1'>
          <CircleUserRound size={18} />
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Tài khoản
                <ChevronDown />
              </Space>
            </a>
          </Dropdown>
        </button>
        <button className='bg-transparent text-large flex items-center space-x-1'>
          <ShoppingBag size={18} />
          <p>Giỏ hàng <span className='text-danger'>(0)</span></p>
        </button>
      </div>
    </div>
    <div className='mx-auto px-4 md:px-8 lg:px-16'>
      <div className='nav py-2 flex items-center justify-between md:justify-between md:items-center'>
        <Chrome className='size-10' />

        <ul
          className={`fixed top-0 left-0 w-1/2 bg-[#ccc] h-screen z-50 transition-transform transform ${isMenuOpen ? 'translate-x-0 h-screen' : '-translate-x-full h-screen'
            } md:hidden`}
        >
          <li className='p-4 text-[14px] border-b'>Sản phẩm mới</li>
          <li className='p-4 text-[14px] border-b'>Sản phẩm hot</li>
          <li className='p-4 text-[14px] border-b'>Bộ sưu tập</li>
          <li className='p-4 text-[14px] border-b'>Về chúng tôi</li>
        </ul>

        <ul className='hidden justify-center space-x-3 md:flex md:space-x-14 lg:space-x-16'>
          <li className='block text-[10px] md:text-[12px] lg:text-[14px]'>Sản phẩm mới</li>
          <li className='block text-[10px] md:text-[12px] lg:text-[14px]'>Sản phẩm hot</li>
          <li className='block text-[10px] md:text-[12px] lg:text-[14px]'>Bộ sưu tập</li>
          <li className='block text-[10px] md:text-[12px] lg:text-[14px]'>Về chúng tôi</li>
        </ul>

        <div className='flex items-center space-x-3'>
          <div className='flex space-x-3 items-center'>
            <div className='w-[220px]'>
              <form className="flex items-center w-full mx-auto">
                <label htmlFor="voice-search" className="sr-only">Tìm kiếm</label>
                <div className="relative w-full flex justify-end">
                  <div className="absolute inset-y-0 end-0 flex items-center pr-3 pointer-events-none">
                    <Search />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-3xl block w-[80%] ps-5 p-2.5 transition-all duration-300 ease-in-out focus:w-[100%] focus:origin-right dark:bg-[#ccc]"
                    placeholder="Tìm kiếm..."
                    required
                  />

                </div>
              </form>
            </div>


            {/* Nút mở menu cho mobile */}
            <AlignJustify className='size-8 block md:hidden cursor-pointer' onClick={toggleMenu} />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default HeaderClient