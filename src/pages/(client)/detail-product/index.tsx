import { useState } from 'react';
import { Image, Button, Modal } from 'antd';
import './css.css';
import ProductCard from '../../../components/common/(client)/ProductCard';
const DetailProduct = () => {
    const thumbnailImages = [
        "../src/assets/images/ao1.png",
        "../src/assets/images/size.png",
        "../src/assets/images/ao1.png",
        "../src/assets/images/size.png",
        "../src/assets/images/ao1.png",
        "../src/assets/images/ao1.png",
        "../src/assets/images/ao1.png",
        "../src/assets/images/ao1.png",
    ];
    const [selectedTab, setSelectedTab] = useState("recommended");
    const [mainImage, setMainImage] = useState(thumbnailImages[0]);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [isSizeGuideVisible, setIsSizeGuideVisible] = useState(false);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const showSizeGuide = () => {
        setIsSizeGuideVisible(true);
    };

    const handleSizeGuideCancel = () => {
        setIsSizeGuideVisible(false);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleThumbnailClick = (index) => {
        setMainImage(thumbnailImages[index]);
        setSelectedThumbnail(index);
    };

    const recommendedProducts = [
        <ProductCard />,
        <ProductCard />,
        <ProductCard />,
        <ProductCard />,
    ];

    const bestSellingProducts = [
        <ProductCard />,
        <ProductCard />,
        <ProductCard />,
        <ProductCard />,

    ];

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };
    const toggleAccordion = (header) => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('i');

        if (content.style.display === "none" || content.style.display === "") {
            content.style.display = "block";
            icon.classList.remove("fa-plus");
            icon.classList.add("fa-minus");
        } else {
            content.style.display = "none";
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
        }
    };
    return (
        <div className="container">
            <div className="left-column">
                <div className="breadcrumb">
                    <i className="fas fa-home"></i>
                    <a href="#">Trang chủ</a>
                    <span>|</span>
                    <a href="#">Áo Nỉ / Áo Thun Dài Tay</a>
                    <span>|</span>
                    <a href="#">Áo Nỉ Fitted L.4.7873</a>
                </div>

                <div className="image-gallery">
                    <div className="thumbnail-container">
                        <div className="thumbnail-images">
                            {thumbnailImages.map((src, index) => (
                                <img
                                    key={index}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`thumbnail-image ${selectedThumbnail === index ? 'selected' : ''}`}
                                    src={src}
                                    onClick={() => handleThumbnailClick(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="main-image-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                        <div
                            className="arrow-button left"
                            onClick={() => handleThumbnailClick((selectedThumbnail - 1 + thumbnailImages.length) % thumbnailImages.length)}
                            style={{
                                position: 'absolute',
                                left: '40px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                padding: '10px',
                                fontSize: '24px',
                                zIndex: 1,
                            }}
                        >
                            &#8592; {/* Left Arrow */}
                        </div>

                        <Image
                            className="main-image"
                            src={mainImage}
                            alt="Main Product Image"
                            style={{
                                width: '678px',
                                height: '700px  ',
                                cursor: 'pointer',
                                display: 'block',
                                margin: '0 auto',
                                marginTop: '-5px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            preview={false}
                            onClick={showModal}
                        />



                        <div
                            className="arrow-button right"
                            onClick={() => handleThumbnailClick((selectedThumbnail + 1) % thumbnailImages.length)}
                            style={{
                                position: 'absolute',
                                right: '40px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                padding: '10px',
                                fontSize: '24px',
                                zIndex: 1,
                                margin: '10px auto',

                            }}
                        >
                            &#8594; {/* Right Arrow */}
                        </div>
                    </div>
                </div>


                <Modal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={600}
                >
                    <Image
                        src={mainImage}
                        alt="Cận cảnh hình sản phẩm"
                        style={{ width: '100%', height: 'auto' }}
                        preview={false}

                    />

                </Modal>
                <div className="image-container">
                    <img className="image-size" src="../src/assets/images/size.png" alt="" />
                </div>
            </div>

            <div className="right-column">
                <h1 className="product-title">Áo Nỉ Fitted L.4.7873</h1>
                <span>còn hàng</span>
                <hr />
                <div className="product-price">169,000₫</div>
                <div className="product-options">
                    <label htmlFor="color" className="product-options1">Màu Sắc</label>
                    <br />
                    <div className="color-options">
                        {["#ccc", "#eee"].map((color, index) => (
                            <img
                                key={index}
                                src="../src/assets/images/ao1.png"
                                alt={`Color ${index + 1}`}
                                className={`color-option ${selectedColor === color ? "selected" : ""}`}
                                data-color={color}
                                onClick={() => handleColorSelect(color)}
                                style={{
                                    border: selectedColor === color ? '2px solid blue' : 'none',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    width: '35px',
                                    height: '35px',
                                    objectFit: 'cover',
                                }}
                            />
                        ))}
                    </div>

                    <br />
                    <label className="product-options1" htmlFor="size">Kích Thước</label>
                    <a className="size-review size-review-link" onClick={showSizeGuide} style={{ cursor: 'pointer' }}>
                        Hướng dẫn chọn size
                    </a>

                    <Modal
                        visible={isSizeGuideVisible}
                        onCancel={handleSizeGuideCancel}
                        footer={null}
                        width={600}
                    >
                        <Image
                            src="../src/assets/images/size.png"
                            alt="Hướng dẫn chọn size"
                            style={{ width: '100%', height: 'auto' }}
                            preview={false}
                        />
                    </Modal>

                    <br />
                    <div className="size-options">
                        {["2XL", "XL", "L", "M"].map((size) => (
                            <Button
                                key={size}
                                className={`size-option ${selectedSize === size ? "selected" : ""}`}
                                onClick={() => handleSizeSelect(size)}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="quantity-selector">
                    <Button onClick={() => handleQuantityChange(-1)}>-</Button>
                    <input type="text" value={quantity} readOnly />
                    <Button onClick={() => handleQuantityChange(1)}>+</Button>
                </div>
                <div className="action-buttons">
                    <button className="add-to-cart">THÊM VÀO GIỎ HÀNG</button>
                    <button className="buy-now">MUA NGAY</button>
                </div>
                <div className="action-button2">
                    <button className="like-add">
                        <i className="fa fa-heart"></i> YÊU THÍCH
                    </button>
                    <button className="shear-add">
                        CHIA SẺ <i className="fab fa-facebook"></i>
                    </button>
                </div>

                <div className="title11">
                    <h1 >Những cửa hàng còn mặt hàng này</h1>

                </div>
                <div className="store-availability">
                    <div className="store-box">
                        <select id="province-select" className="select-placeholder">
                            <option value="" disabled selected hidden>--Tỉnh Thành--</option>
                            <option value="HN">Hà Nội</option>
                            <option value="HCM">Hồ Chí Minh</option>
                        </select>
                    </div>

                    <div className="store-list">
                        {[
                            { name: "110 Phố Nhổn", phone: "0968959050", address: "Chi nhánh 1: 110 Phố Nhổn, Bắc Từ Liêm - HN", available: true },
                            { name: "154 Quang Trung Hà Đông", phone: "0968959050", address: "Chi nhánh 6: 154 Quang Trung, Hà Đông, HN", available: true },
                            { name: "326 Cầu Giấy", phone: "0968959050", address: "Chi nhánh 2: 326 Cầu Giấy, HN", available: false },
                            { name: "110 Phố Nhổn", phone: "0968959050", address: "Chi nhánh 1: 110 Phố Nhổn, Bắc Từ Liêm - HN", available: true },
                            { name: "154 Quang Trung Hà Đông", phone: "0968959050", address: "Chi nhánh 6: 154 Quang Trung, Hà Đông, HN", available: true },
                            { name: "326 Cầu Giấy", phone: "0968959050", address: "Chi nhánh 2: 326 Cầu Giấy, HN", available: false },
                        ].map(store => (
                            <div className="store" key={store.name}>
                                <p className="store-name">
                                    <strong><i className="fa fa-map-marker-alt"></i> {store.name}</strong>
                                </p>
                                <p className="store-details">
                                    {store.phone} <br />
                                    <div className="store-andress">
                                        {store.address}
                                    </div>
                                    <span className={store.available ? "available" : "unavailable"}>
                                    ({store.available ? "Còn hàng" : "Hết hàng"})
                                </span>
                                </p>
                               
                            </div>

                        ))}
                    </div>
                </div>
                <div className="infor">
                    <div class="accordion">

                        <div className="accordion-item">
                            <div className="accordion-header" onClick={(e) => toggleAccordion(e.currentTarget)}>
                                <span>THÔNG TIN SẢN PHẨM</span>
                                <i className="fas fa-plus"></i>
                            </div>
                            <div className="accordion-content" style={{ display: 'none' }}>
                                <p></p>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <div className="accordion-header" onClick={(e) => toggleAccordion(e.currentTarget)}>
                                <span>CHÍNH SÁCH ĐỔI TRẢ</span>
                                <i className="fas fa-plus"></i>
                            </div>
                            <div className="accordion-content" style={{ display: 'none' }}>
                                <p>- Mức phí: 30,000đ nội thành và 40,000đ ngoại thành <br />
                                    - Được kiểm tra hàng trước khi nhận hàng <br />
                                    - Đổi hàng trong vòng 30 ngày kể từ khi nhận hàng <br />
                                    - Không áp dụng đổi/trả sản phẩm trong CTKM <br />
                                    - Miễn phí đổi trả nếu lỗi sai sót từ phía atino.vn <br />

                                </p>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <div className="accordion-header" onClick={(e) => toggleAccordion(e.currentTarget)}>
                                <span>ƯU ĐÃI MEMBER</span>
                                <i className="fas fa-plus"></i>
                            </div>
                            <div className="accordion-content" style={{ display: 'none' }}>
                                <p></p>
                            </div>
                        </div>
                    </div>

                    <div class="info-section">
                        <div class="info-item">
                            <i class="fas fa-truck"></i>
                            <span>GIAO HÀNG NỘI THÀNH TRONG 24 GIỜ</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-exchange-alt"></i>
                            <span>ĐỔI HÀNG TRONG 30 NGÀY</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-phone-alt"></i>
                            <span>TỔNG ĐÀI BÁN HÀNG 096728.4444</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="product-like">
                <div className="title-container">
                    <div
                        className={`title ${selectedTab === "recommended" ? "active" : ""}`}
                        onClick={() => handleTabClick("recommended")}
                    >
                        CÓ THỂ BẠN THÍCH
                        <div className="underline"></div>
                    </div>
                    <div
                        className={`title ${selectedTab === "bestSelling" ? "active" : ""}`}
                        onClick={() => handleTabClick("bestSelling")}
                    >
                        SẢN PHẨM BÁN CHẠY
                        <div className="underline right"></div>
                    </div>
                </div>
                <div className="product-list">
                    <i className="fas fa-chevron-left arrow" />
                    {selectedTab === "recommended"
                        ? recommendedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                        : bestSellingProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    <i className="fas fa-chevron-right arrow" />
                </div>

            </div>


        </div>
    );
};

export default DetailProduct;
