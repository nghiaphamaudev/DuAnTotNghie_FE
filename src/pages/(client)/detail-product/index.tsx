import { useEffect, useState } from 'react';
import { Image, Button, Modal, message } from 'antd';
import './css.css';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../../contexts/ProductContext';
import ProductCard from '../../../components/common/(client)/ProductCard';
import { addItemToCart } from '../../../services/productServices';

const DetailProduct = () => {
    const { id } = useParams();
    const [price, setPrice] = useState(0);

    const { product, getDataProductById, addItemToCartHandler } = useProduct();
    const { allProduct, getAllDataProduct } = useProduct();
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(0); // New state for selected price
    const [quantity, setQuantity] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSizeGuideVisible, setIsSizeGuideVisible] = useState(false);
    const [startIndex, setStartIndex] = useState(0);
    const productsPerPage = 4;


    useEffect(() => {
        if (id) {
            getDataProductById(id);
        }
    }, [id]);

    useEffect(() => {
        getAllDataProduct();
    }, []);
    useEffect(() => {
        if (product?.data?.variants?.length > 0) {
            const defaultVariant = product.data.variants[0];
            setSelectedColor(defaultVariant.color || '');
            setSelectedSize(defaultVariant.sizes[0]?.nameSize || '');
            setSelectedPrice(defaultVariant.sizes[0]?.price || 0);
            setMainImage(defaultVariant.images[0] || '');
            setSelectedThumbnail(0);
        }
    }, [product]);

    const handleArrowClick = (direction) => {
        const images = product?.data?.variants.find(variant => variant.color === selectedColor)?.images;
        const newIndex = (selectedThumbnail + direction + images.length) % images.length;
        setSelectedThumbnail(newIndex);
        setMainImage(images[newIndex]);
    };

    const handleThumbnailClick = (index, image) => {
        setMainImage(image);
        setSelectedThumbnail(index);
    };
    const handleColorSelect = (color) => {
        const variant = product.data.variants.find(variant => variant.color === color);
        setSelectedColor(color);
        setMainImage(variant.images[0]);
        setSelectedThumbnail(0);

        if (variant.sizes.length > 0) {
            setSelectedSize(variant.sizes[0].nameSize);  // Cập nhật kích thước đầu tiên của màu này
            setPrice(variant.sizes[0].price);             // Cập nhật giá của kích thước đầu tiên
        }
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);

        const selectedVariant = product?.data?.variants.find(variant => variant.color === selectedColor);
        const selectedSizeObject = selectedVariant?.sizes.find(sizeObj => sizeObj.nameSize === size);
        if (selectedSizeObject) {
            setPrice(selectedSizeObject.price);  // Cập nhật giá theo kích thước được chọn
        }
    };

    const handleQuantityChange = (change) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
    };

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const showSizeGuide = () => setIsSizeGuideVisible(true);
    const handleSizeGuideCancel = () => setIsSizeGuideVisible(false);

    const handleTabClick = (tab) => setSelectedTab(tab);

    const handleNext = () => {
        if (startIndex + productsPerPage < allProduct.length) {
            setStartIndex(startIndex + productsPerPage);
        }
    };

    const handlePrevious = () => {
        if (startIndex - productsPerPage >= 0) {
            setStartIndex(startIndex - productsPerPage);
        }
    };

    const toggleAccordion = (header) => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('i');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        icon.className = content.style.display === 'none' ? 'fas fa-plus' : 'fas fa-minus';
    };
    const [openAccordion, setOpenAccordion] = useState(null);

    const handleAccordionToggle = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };
    const handleAddToCart = async () => {
        if (!product?.data) {
            message.error('Không tìm thấy thông tin sản phẩm.');
            return;
        }

        const productId = product?.data?.id;
        const selectedVariant = product?.data?.variants.find(variant => variant.color === selectedColor);
        const selectedSizeObject = selectedVariant?.sizes.find(size => size.nameSize === selectedSize);

        if (!productId || !selectedVariant || !selectedSizeObject) {
            message.error('Vui lòng chọn đầy đủ thông tin sản phẩm.');
            return;
        }

        const productData = {
            productId,
            variantId: selectedVariant.id,
            sizeId: selectedSizeObject.id,
            quantity,
        };


        addItemToCartHandler(productData);

    };


    return (
        <div className="container">
            <div className="left-column">
                <div className="breadcrumb">
                    <i className="fas fa-home"></i>
                    <a href="#">Trang chủ</a>
                    <span>|</span>
                    <a href="#">Danh mục {product?.data?.category}</a>
                    <span>|</span>
                    <a href="#">{product?.data?.name}</a>
                </div>

                <div className="image-gallery">
                    <div className="thumbnail-container">
                        <div className="thumbnail-images">
                            {product?.data?.variants?.find(variant => variant.color === selectedColor)?.images.map((image, index) => (
                                <img
                                    key={index}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`thumbnail-image ${selectedThumbnail === index ? 'selected' : ''}`}
                                    src={image}
                                    onClick={() => handleThumbnailClick(index, image)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="main-image-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="arrow-button left" onClick={() => handleArrowClick(-1)}>&#8592;</div>
                        <Image
                            className="main-image"
                            src={mainImage}
                            style={{
                                width: '678px',
                                height: '700px',
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
                        <Modal open={isModalVisible} onCancel={handleCancel} footer={null} width={600}>

                            <Image src={mainImage || product?.data?.coverImg} preview={false} />
                        </Modal>


                        <div className="arrow-button right" onClick={() => handleArrowClick(1)}>&#8594;</div>
                    </div>
                </div>
            </div>

            <div className="right-column">
                <h1 className="product-title">{product?.data?.name}</h1>
                <span>{product?.data?.status ? "Còn hàng" : "Hết hàng"}</span>
                <hr />
                <div className="product-price">
                    {price.toLocaleString()}₫
                </div>


                <div className="product-options">
                    <label htmlFor="color" className="product-options1">Màu Sắc</label>
                    <div className="color-options">
                        {product?.data?.variants?.map((variant, index) => (
                            <Button
                                key={index}
                                className={`color-option ${selectedColor === variant.color ? "selected" : ""}`}
                                onClick={() => handleColorSelect(variant.color)}
                                style={{
                                    padding: 0,
                                    margin: '5px',
                                    border: selectedColor === variant.color ? '2px solid #000' : '1px solid #ccc',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {variant.images?.[0] ? (
                                    <img
                                        src={variant.images[0]}
                                        alt={variant.color}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
                                )}
                            </Button>
                        ))}
                    </div>

                    <label className="product-options1" htmlFor="size">Kích Thước</label>
                    <a className="size-review size-review-link" onClick={showSizeGuide} style={{ cursor: 'pointer' }}>
                        Hướng dẫn chọn size
                    </a>
                    <div className="size-options">
                        {product?.data?.variants
                            ?.find(variant => variant.color === selectedColor)?.sizes.map(size => (
                                <Button
                                    key={size._id}
                                    onClick={() => handleSizeSelect(size.nameSize)}
                                    style={{
                                        border: selectedSize === size.nameSize ? '2px solid #000' : '1px solid #ccc',
                                    }}
                                >
                                    {size.nameSize}
                                </Button>
                            ))}
                    </div>


                    <Modal open={isSizeGuideVisible} onCancel={handleSizeGuideCancel} footer={null} width={600}>
                        <Image
                            src="../../../assets/images/size.png"
                            alt="Hướng dẫn chọn size"
                            style={{ width: '100%', height: 'auto' }}
                            preview={false}
                        />
                    </Modal>
                </div>

                <div className="quantity-selector">
                    <Button onClick={() => handleQuantityChange(-1)}>-</Button>
                    <input type="text" value={quantity} readOnly />
                    <Button onClick={() => handleQuantityChange(1)}>+</Button>
                </div>

                <div className="action-buttons">
                    <button className="add-to-cart" onClick={handleAddToCart}>THÊM VÀO GIỎ HÀNG</button>
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
                    <div className="accordion">

                        <div className="accordion-item">
                        <div className="accordion-item">
    <div className="accordion-header" onClick={() => handleAccordionToggle(1)}>
        <span>THÔNG TIN SẢN PHẨM</span>
        <i className={openAccordion === 1 ? "fas fa-minus" : "fas fa-plus"}></i>
    </div>
    <div className="accordion-content" style={{ display: openAccordion === 1 ? 'block' : 'none' }}>
        <p>{product?.data?.description}</p>
    </div>
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

                    <div className="info-section">
                        <div className="info-item">
                            <i className="fas fa-truck"></i>
                            <span>GIAO HÀNG NỘI THÀNH TRONG 24 GIỜ</span>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-exchange-alt"></i>
                            <span>ĐỔI HÀNG TRONG 30 NGÀY</span>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-phone-alt"></i>
                            <span>TỔNG ĐÀI BÁN HÀNG 096728.4444</span>
                        </div>
                    </div>
                </div>


            </div>

            <div className="product-like">
                <div className="product-list">
                    <i
                        className={`fas fa-chevron-left arrow ${startIndex === 0 ? 'disabled' : ''}`}
                        onClick={handlePrevious}
                        style={{ cursor: startIndex === 0 ? 'not-allowed' : 'pointer' }}
                    />
                    {allProduct.slice(startIndex, startIndex + productsPerPage).map((item, index) => (
                        <ProductCard key={index} item={item} />
                    ))}
                    <i
                        className={`fas fa-chevron-right arrow ${startIndex + productsPerPage >= allProduct.length ? 'disabled' : ''}`}
                        onClick={handleNext}
                        style={{ cursor: startIndex + productsPerPage >= allProduct.length ? 'not-allowed' : 'pointer' }}
                    />
                </div>
            </div>

        </div>
    );
};

export default DetailProduct;
