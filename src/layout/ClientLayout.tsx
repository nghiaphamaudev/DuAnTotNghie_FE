import React from 'react'
import { Outlet } from 'react-router-dom'

const ClientLayout = () => {
  return (
    <div className=''>
    <div className='fixed top-0 left-0 z-50 w-screen flex justify-center items-center bg-white'>
        <div className='container'>
            {/* <Header /> */}
        </div>
    </div>
    <div className='bg-background-2 mt-[108px]'>
        <div className='container'>
            <Outlet />
        </div>
    </div>
    <div className='md:mb-0 mb-20'>
        <div className='container'>
            {/* <Footer /> */}
        </div>
    </div>
</div>
  )
}

export default ClientLayout