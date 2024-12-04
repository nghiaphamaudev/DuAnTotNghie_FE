import { Button, Image, InputNumber, Modal, message, notification } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../../../components/common/(client)/ProductCard';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import { useProduct } from '../../../contexts/ProductContext';
import { deleteFeedback, toggleLikeFeedback, updateFeedback } from '../../../services/Feedbacks';
import './css.css';


import { useQuery, useQueryClient } from '@tanstack/react-query';

const DetailProduct = () => {
  //context
  const { isLogin, token } = useAuth();
  const { cartData } = useCart();
  const queryClient = useQueryClient();

  //state
  const nav = useNavigate();
  const { id } = useParams();
  const [price, setPrice] = useState(0);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { product, getDataProductById } = useProduct();
  const { addItemToCart } = useCart();
  const { allProduct } = useProduct();
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [mainImage, setMainImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0); // New state for selected price
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSizeGuideVisible, setIsSizeGuideVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [quantityCart, setQuantityCart] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [idVariantSelect, setIdVariantSelect] = useState('');
  const productsPerPage = 4;
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [updatedRating, setUpdatedRating] = useState(1);

  //lifecycle
  useEffect(() => {
    if (id) {
      getDataProductById(id);
      fetchFeedbacks(id);
    }
  }, [id]);

  useEffect(() => {
    if (product?.data?.variants?.length > 0) {
      const defaultVariant = product.data.variants[0];
      const defaultSize = defaultVariant.sizes?.[0];
      setSelectedColor(defaultVariant.color || '');
      setSelectedSize(defaultSize?.nameSize || '');
      setSelectedPrice(defaultSize?.price || 0);
      setMainImage(defaultVariant.images[0] || '');
      setSelectedThumbnail(0);
      setPrice(defaultSize?.price || 0);
    }
  }, [product]);

  useEffect(() => {
    if (cartData && product?.data?.variants?.length > 0) {
      // Tìm variant và size được chọn
      const selectedVariant = product?.data?.variants.find(
        variant => variant.color === selectedColor
      );
      const selectedSizeObject = selectedVariant?.sizes.find(
        size => size.nameSize === selectedSize
      );

      // Cập nhật inventory
      setInventory(selectedSizeObject?.inventory || 0);

      // Tìm quantity trong cartData.items
      const dataCartVariantSelected = cartData?.items.find(
        item => item.sizeId === selectedSizeObject?.id
      );
      setQuantityCart(dataCartVariantSelected?.quantity || 0);
      setQuantity(1)
    }
  }, [cartData, product, selectedColor, selectedSize]);

  //sản phẩm cùng loại
  const getProductid = useQuery({
    queryKey: ["PRODUCT", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/v1/products/${id}`);
      return data;
    }
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["RELATED_PRODUCT", getProductid.data?.data?.category?.id],
    queryFn: async () => {
      const categoryId = getProductid.data?.data?.category?.id;
      const productId = getProductid.data?.data?.id;

      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/v1/products/${categoryId}/related/${productId}`
      );
      console.log('API response:', data);
      return data.data || [];
    },
    enabled: !!getProductid.data?.data?.category?.id
  });

  //end

  // function

  const fetchFeedbacks = async (productId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/feedback/${productId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.headers['content-type'].includes('text/html')) {
        console.log("Received HTML response instead of JSON.");
        message.error('Lỗi khi tải feedbacks, nhận được trang lỗi từ server.');
        return;
      }
      const data = response.data;
      if (!data || !data.data || !data.data.feedbacks) {
        console.log("Không có feedbacks trong phản hồi.");
        message.error('Không có feedbacks cho sản phẩm này.');
        return;
      }
      setFeedbacks(data.data.feedbacks);
    } catch (error) {
      console.log("chưa có commet ", error);
    }
  };


  //editFeedbacks
  const handleEdit = (feedback: any) => {
    setEditingFeedback(feedback);
    setUpdatedComment(feedback.comment);
    setUpdatedRating(feedback.rating);
  };

  const handleSaveEdit = async () => {
    if (!updatedComment) {
      message.error('Bình luận không thể trống!');
      return;
    }

    const updatedData = {
      comment: updatedComment,
      rating: updatedRating,
    };

    try {
      const result = await updateFeedback(editingFeedback.id, updatedData);

      if (result.success) {
        // Cập nhật feedbacks khi chỉnh sửa thành công
        setFeedbacks(feedbacks.map(feedback =>
          feedback.id === editingFeedback.id ? { ...feedback, ...updatedData } : feedback
        ));
        message.success("thanh công");
        setEditingFeedback(null);
        setUpdatedComment("");
        setUpdatedRating(1);
      } else {
        // Hiển thị lỗi ra console và alert
        console.error("Lỗi khi chỉnh sửa bình luận:", result.message);
        message.error(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error("Lỗi không mong muốn khi chỉnh sửa bình luận:", error);
      message.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
    }
  };


  const handleCommentChange = (e: any) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (value: any) => {
    setRating(value);
  };



  const handleDelete = async (feedbackId: any) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa bình luận này?");
    if (!confirmed) return;

    try {
      const response = await deleteFeedback(feedbackId);
      if (response.success) {
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
        message.success("Đã xóa bình luận thành công!");
      } else {
        message.error(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      message.error("Đã xảy ra lỗi khi xóa bình luận. Vui lòng thử lại.");
    }
  };

  const handleToggleLike = async (feedbackId: string) => {
    if (!isLogin) {
      message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
      return;
    }

    try {
      const response = await toggleLikeFeedback(feedbackId, token);

      if (response && response.data) {
        const updatedFeedback = response.data.feedback;
        console.log("LikedBy:", updatedFeedback.likedBy);
        console.log("Current Token:", token);
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback.id === feedbackId ? updatedFeedback : feedback
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi toggle like:", error);
      alert("Không thể thực hiện thao tác thích. Vui lòng thử lại.");
    }
  };


  //end



  const handleArrowClick = (direction: any) => {
    const images = product?.data?.variants.find((variant: any) => variant.color === selectedColor)?.images;
    const newIndex = (selectedThumbnail + direction + images.length) % images.length;
    setSelectedThumbnail(newIndex);
    setMainImage(images[newIndex]);
  };

  const handleThumbnailClick = (index: any, image: string) => {
    setMainImage(image);
    setSelectedThumbnail(index);
  };
  const handleColorSelect = (color) => {
    const variant = product.data.variants.find(variant => variant.color === color);
    setSelectedColor(color);
    setMainImage(variant.images[0]);
    setSelectedThumbnail(0);

    if (variant.sizes.length > 0) {
      setSelectedSize(variant.sizes[0].nameSize);
      setPrice(variant.sizes[0].price);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);

    const selectedVariant = product?.data?.variants.find(variant => variant.color === selectedColor);
    const selectedSizeObject = selectedVariant?.sizes.find(sizeObj => sizeObj.nameSize === size);
    if (selectedSizeObject) {
      setPrice(selectedSizeObject.price);
    }
  };

  const handleQuantityChange = (change: any) => {
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

  const onChangeQuantity = (value: number | null) => {
    if (value !== null && value <= (inventory - quantityCart)) {
      setQuantity(value);
    } else if (value === null) {
      notification.error({
        message: "Vui lòng nhập số lượng!",
        placement: "topRight",
        duration: 2,
      });
    } else {
      notification.error({
        message: "Số lượng sản phẩm yêu cầu đã vượt quá số lượng tồn kho!",
        placement: "topRight",
        duration: 2,
      });
    }
  };

  const handleAddToCart = async (option?: string) => {
    queryClient.invalidateQueries({ queryKey: ["carts"] });

    const productId = product?.data?.id;
    const selectedVariant = product?.data?.variants.find(variant => variant.color === selectedColor);
    const selectedSizeObject = selectedVariant?.sizes.find(size => size.nameSize === selectedSize);
    if (!token || !isLogin) {
      notification.error({
        message: "Vui lòng đăng nhập để tiếp tục",
        placement: "topRight",
        duration: 2
      });
      return
    }

    if (id) {
      const res = await getDataProductById(id)
      const sizeObjects = res.data.variants
        .flatMap(variant => variant.sizes)
        .filter(size => size.id === selectedSizeObject.id);
      const newSizeObjectInventory = sizeObjects?.[0]?.inventory
      if (!res.data.isActive) {
        notification.error({
          message: "Sản phẩm không còn tồn tại!",
          placement: "topRight",
          duration: 4,
        });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        nav('/home')
        return
      } else {
        if (newSizeObjectInventory === 0) {
          notification.error({
            message: "Sản phẩm không còn tồn tại!",
            placement: "topRight",
            duration: 4,
          });
        } else if (newSizeObjectInventory < quantity) {
          notification.error({
            message: "Số lượng sản phẩm yêu cầu được chọn vượt quá số lượng tồn kho!",
            placement: "topRight",
            duration: 4,
          });
        } else if (quantity > inventory - quantityCart) {
          notification.error({
            message: "Số lượng sản phẩm yêu cầu đã vượt quá số lượng tồn kho!",
            placement: "topRight",
            duration: 2
          });
          return
        } else {
          const productData = {
            productId,
            variantId: selectedVariant.id,
            sizeId: selectedSizeObject.id,
            quantity,
          };

          const res = await addItemToCart(productData);
          if (res && res?.status) {
            if (option === 'buy-now') {
              nav('/cart')
            } else {
              notification.success({
                message: "Thêm sản phẩm thành công",
                placement: "topRight",
                duration: 2,
              });
            }


          } else {
            notification.error({
              message: "Sản phẩm không còn tồn tại",
              placement: "topRight",
              duration: 2,
            });
          }
        }
      }
    }

    if (!product?.data) {
      message.error('Không tìm thấy thông tin sản phẩm.');
      return;
    }

    if (!productId || !selectedVariant || !selectedSizeObject) {
      message.error('Vui lòng chọn đầy đủ thông tin sản phẩm.');
      return;
    }

  };


  return (
    <div className="container mx-auto">
      <div className="left-column">
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
        <span>{inventory !== 0 ? `Còn hàng: ${inventory}` : "Hết hàng"}</span>
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

        <div className="flex items-center">
          <Button
            disabled={inventory === 0}
            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          >
            -
          </Button>
          <InputNumber
            readOnly
            type='number'
            min={1}
            max={inventory}
            value={quantity}
            onChange={onChangeQuantity}
            // onKeyDown={handleKeyPress}
            className="w-14 mx-2 focus:outline-none caret-transparent"
          />
          <Button
            disabled={inventory === 0}
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>

        <div className="action-buttons">
          <button className="add-to-cart rounded-sm" onClick={() => handleAddToCart()}>THÊM VÀO GIỎ HÀNG</button>
          <button onClick={() => handleAddToCart('buy-now')} className="buy-now rounded-sm">MUA NGAY</button>
        </div>
        <div className="infor">
          <p>{product?.data?.description}</p>

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
        <h3 className="text-2xl font-bold my-5">Sản phẩm cùng loại</h3>
        <div className="product-list">
          <i
            className={`fas fa-chevron-left arrow ${startIndex === 0 ? 'disabled' : ''}`}
            onClick={handlePrevious}
            style={{ cursor: startIndex === 0 ? 'not-allowed' : 'pointer' }}
          />
          {Array.isArray(relatedProducts) && relatedProducts.length > 0 && relatedProducts.slice(startIndex, startIndex + productsPerPage).map((item, index) => (
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
