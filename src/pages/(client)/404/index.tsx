import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <>
            <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
                <div className="rounded-lg bg-white p-8 text-center shadow-xl">
                    <h1 className="mb-4 text-[48px] text-red-500 font-bold">404</h1>
                    <p className="text-gray-600">Trang bạn đang tìm kiếm không thể được tìm thấy.</p>
                    <Link to={'/home'} className="mt-4 inline-block rounded bg-black px-4 py-2 font-semibold text-white hover:bg-black-600"> Quay lại trang chủ </Link>
                </div>
            </div >
        </>
    )
}

export default NotFound
