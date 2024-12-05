
const AboutUs = () => {
    return (
        <>
            <div>
                {/* Section 1: Introduction */}
                <section className="py-20 px-4 md:px-20 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2">
                        <img src={'/src/assets/images/logofshirt-rmbg.png'} alt="Our Brand" className="rounded-lg shadow-lg" />
                    </div>
                    <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12">
                        <h2 className="text-3xl font-semibold text-black">Giới thiệu</h2>
                        <p className="mt-4 text-gray-400">
                            Chào mừng đến với thương hiệu thời trang F-Shirt! Chúng tôi tận tâm tạo ra những bộ áo thời trang, chất lượng cao, phản ánh cá tính độc đáo của bạn. Sứ mệnh của chúng tôi là trao quyền cho các cá nhân thông qua thời trang.
                        </p>
                    </div>
                </section>
                {/* Section 2: Brand Story */}
                <section className="py-16 px-4 bg-gray-900 md:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-semibold text-white">Our Story</h2>
                            <p className="mt-4 text-gray-400">
                                Our journey began with a passion for fashion and a commitment to sustainability. From a small local shop, we’ve grown into a brand loved by many.
                                Join us as we redefine the future of fashion.
                            </p>
                        </div>
                        <div>
                            <img src="https://media.istockphoto.com/id/1257563298/vi/anh/qu%E1%BA%A7n-%C3%A1o-th%E1%BB%9Di-trang-tr%C3%AAn-gi%C3%A1-trong-n%E1%BB%81n-s%C3%A1ng-trong-nh%C3%A0-v%E1%BB%8B-tr%C3%AD-cho-v%C4%83n-b%E1%BA%A3n.jpg?s=612x612&w=0&k=20&c=Mr5Q7fJiO3DBnd5gtan8j3B0Y6a5dDdkjkC4NTVV8Go=" alt="Our Brand" className="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </section>
                {/* Section 3: Core Values */}
                <section className="py-16 px-4 md:px-20">
                    <h2 className="text-3xl font-semibold text-center text-white">Our Core Values</h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-white text-4xl mb-4">🌿</div>
                            <h3 className="text-xl font-semibold text-black">Bền vững</h3>
                            <p className="mt-2 text-gray-400">Chúng tôi ưu tiên các vật liệu và thực hành thân thiện với môi trường.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-white text-4xl mb-4">🎨</div>
                            <h3 className="text-xl font-semibold text-black">Sáng tạo</h3>
                            <p className="mt-2 text-gray-400">Thiết kế của chúng tôi độc đáo và lấy cảm hứng từ xu hướng hiện đại.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-white text-4xl mb-4">🤝</div>
                            <h3 className="text-xl font-semibold text-black">Chăm sóc khách hàng</h3>
                            <p className="mt-2 text-gray-400">Chúng tôi cố gắng cung cấp dịch vụ đặc biệt cho tất cả khách hàng.</p>
                        </div>
                    </div>
                </section>
                {/* Section 4: Team */}
                {/* <section className="py-16 px-4 bg-gray-900 md:px-20">
                    <h2 className="text-3xl font-semibold text-center text-white">Meet Our Team</h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <img src="https://via.placeholder.com/150" alt="Team Member" className="rounded-full mx-auto shadow-lg" />
                            <h3 className="mt-4 text-xl font-semibold text-white">John Doe</h3>
                            <p className="text-gray-400">CEO &amp; Founder</p>
                        </div>
                        <div className="text-center">
                            <img src="https://via.placeholder.com/150" alt="Team Member" className="rounded-full mx-auto shadow-lg" />
                            <h3 className="mt-4 text-xl font-semibold text-white">Jane Smith</h3>
                            <p className="text-gray-400">Creative Director</p>
                        </div>
                        <div className="text-center">
                            <img src="https://via.placeholder.com/150" alt="Team Member" className="rounded-full mx-auto shadow-lg" />
                            <h3 className="mt-4 text-xl font-semibold text-white">Alice Brown</h3>
                            <p className="text-gray-400">Marketing Manager</p>
                        </div>
                    </div>
                </section> */}
            </div>
        </>
    )
}

export default AboutUs
