import {
  Button,
  Image,
  InputNumber,
  Modal,
  Rate,
  message,
  notification
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../../components/common/(client)/ProductCard";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import { useProduct } from "../../../contexts/ProductContext";
import { getFeedbacksByProductId } from "../../../services/Feedbacks";
import "./css.css";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../../config/axios";
import { getProductById } from "../../../services/productServices";

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
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0); // New state for selected price
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSizeGuideVisible, setIsSizeGuideVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [quantityCart, setQuantityCart] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [idVariantSelect, setIdVariantSelect] = useState("");
  const productsPerPage = 4;
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);
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
      setSelectedColor(defaultVariant.color || "");
      setSelectedSize(defaultSize?.nameSize || "");
      setSelectedPrice(defaultSize?.price || 0);
      setMainImage(defaultVariant.images[0] || "");
      setSelectedThumbnail(0);
      setPrice(defaultSize?.price || 0);
    }
  }, [product]);

  useEffect(() => {
    if (cartData && product?.data?.variants?.length > 0) {
      // Tìm variant và size được chọn
      const selectedVariant = product?.data?.variants.find(
        (variant) => variant.color === selectedColor
      );
      const selectedSizeObject = selectedVariant?.sizes.find(
        (size) => size.nameSize === selectedSize
      );

      // Cập nhật inventory
      setInventory(selectedSizeObject?.inventory || 0);

      // Tìm quantity trong cartData.items
      const dataCartVariantSelected = cartData?.items.find(
        (item) => item.sizeId === selectedSizeObject?.id
      );
      setQuantityCart(dataCartVariantSelected?.quantity || 0);
      setQuantity(1);
    }
  }, [cartData, product, selectedColor, selectedSize]);

  // function

  const fetchFeedbacks = async (productId: string) => {
    try {
      const data = await getFeedbacksByProductId(productId);
      console.log("Feedbacks", data);

      setFeedbacks(data);
    } catch (error) {
      if (error.message.includes("HTML")) {
        message.error("Lỗi khi tải feedbacks, nhận được trang lỗi từ server.");
      } else if (error.message.includes("Không có feedbacks")) {
        message.error("Không có feedbacks cho sản phẩm này.");
      }
    }
  };

  const handleArrowClick = (direction: any) => {
    const images = product?.data?.variants.find(
      (variant: any) => variant.color === selectedColor
    )?.images;
    const newIndex =
      (selectedThumbnail + direction + images.length) % images.length;
    setSelectedThumbnail(newIndex);
    setMainImage(images[newIndex]);
  };

  const handleThumbnailClick = (index: any, image: string) => {
    setMainImage(image);
    setSelectedThumbnail(index);
  };
  const handleColorSelect = (color) => {
    const variant = product.data.variants.find(
      (variant) => variant.color === color
    );
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

    const selectedVariant = product?.data?.variants.find(
      (variant) => variant.color === selectedColor
    );
    const selectedSizeObject = selectedVariant?.sizes.find(
      (sizeObj) => sizeObj.nameSize === size
    );
    if (selectedSizeObject) {
      setPrice(selectedSizeObject.price);
    }
  };

  const handleQuantityChange = (change: any) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
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
    const icon = header.querySelector("i");
    content.style.display = content.style.display === "none" ? "block" : "none";
    icon.className =
      content.style.display === "none" ? "fas fa-plus" : "fas fa-minus";
  };
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleAccordionToggle = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const onChangeQuantity = (value: number | null) => {
    if (value !== null && value <= inventory - quantityCart) {
      setQuantity(value);
    } else if (value === null) {
      notification.error({
        message: "Vui lòng nhập số lượng!",
        placement: "topRight",
        duration: 2
      });
    } else {
      notification.error({
        message: "Số lượng sản phẩm yêu cầu đã vượt quá số lượng tồn kho1!",
        placement: "topRight",
        duration: 2
      });
    }
  };

  const handleAddToCart = async (option?: string) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["carts"] });

    const productId = product?.data?.id;
    const selectedVariant = product?.data?.variants.find(
      (variant) => variant.color === selectedColor
    );
    const selectedSizeObject = selectedVariant?.sizes.find(
      (size) => size.nameSize === selectedSize
    );
    if (!token || !isLogin) {
      notification.error({
        message: "Vui lòng đăng nhập để tiếp tục",
        placement: "topRight",
        duration: 2
      });
      return;
    }
    if (!selectedVariant?.status) {
      notification.error({
        message: "Biến thể sản phẩm này hiện không khả dụng.",
        placement: "topRight",
        duration: 2
      });
      return;
    }
    if (!selectedSizeObject?.status) {
      notification.error({
        message: "Kích thước sản phẩm này hiện không khả dụng.",
        placement: "topRight",
        duration: 2
      });
      return;
    }

    if (id) {
      const res = await getDataProductById(id);
      const sizeObjects = res.data.variants
        .flatMap((variant) => variant.sizes)
        .filter((size) => size.id === selectedSizeObject.id);
      const newSizeObjectInventory = sizeObjects?.[0]?.inventory;
      if (!res.data.isActive) {
        notification.error({
          message: "Sản phẩm không còn tồn tại!",
          placement: "topRight",
          duration: 4
        });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        nav("/home");
        return;
      } else {
        if (newSizeObjectInventory === 0) {
          notification.error({
            message: "Đã có lỗi xảy ra. Vui lòng kiểm tra lại!",
            placement: "topRight",
            duration: 4
          });
          nav("/home");
        } else if (newSizeObjectInventory < quantity) {
          notification.error({
            message: "Đã có lỗi xảy ra. Vui lòng kiểm tra lại!",
            placement: "topRight",
            duration: 4
          });
          nav("/home");
        } else if (quantity > inventory - quantityCart) {
          notification.error({
            message: "Đã có lỗi xảy ra. Vui lòng kiểm tra lại!",
            placement: "topRight",
            duration: 2
          });
          nav("/home");

          return;
        } else {
          const productData = {
            productId,
            variantId: selectedVariant.id,
            sizeId: selectedSizeObject.id,
            quantity
          };

          const res = await addItemToCart(productData);
          if (res && res?.status) {
            if (option === "buy-now") {
              nav("/cart");
            } else {
              notification.success({
                message: "Thêm sản phẩm thành công",
                placement: "topRight",
                duration: 2
              });
            }
          } else {
            notification.error({
              message: "Sản phẩm không còn tồn tại",
              placement: "topRight",
              duration: 2
            });
          }
        }
      }
    }

    if (!product?.data) {
      message.error("Không tìm thấy thông tin sản phẩm.");
      return;
    }

    if (!productId || !selectedVariant || !selectedSizeObject) {
      message.error("Vui lòng chọn đầy đủ thông tin sản phẩm.");
      return;
    }
  };

  //sản phẩm cùng loại
  const getProductid = useQuery({
    queryKey: ["PRODUCT", id],
    queryFn: () => getProductById(id) // Sử dụng hàm getProductById
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["RELATED_PRODUCT", getProductid.data?.data?.category?.id],
    queryFn: async () => {
      const categoryId = getProductid.data?.data?.category?.id;
      const productId = getProductid.data?.data?.id;

      const { data } = await instance.get(
        `http://127.0.0.1:8000/api/v1/products/${categoryId}/related/${productId}`
      );
      console.log("API response:", data);
      return data.data || [];
    },
    enabled: !!getProductid.data?.data?.category?.id
  });

  //end

  return (
    <>
      <div className="container mx-auto">
        <div className="left-column">
          <div className="image-gallery">
            <div className="thumbnail-container">
              <div className="thumbnail-images">
                {product?.data?.variants
                  ?.find((variant) => variant.color === selectedColor)
                  ?.images.map((image, index) => (
                    <img
                      key={index}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail-image ${
                        selectedThumbnail === index ? "selected" : ""
                      }`}
                      src={image}
                      onClick={() => handleThumbnailClick(index, image)}
                    />
                  ))}
              </div>
            </div>

            <div
              className="main-image-container"
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div
                className="arrow-button left"
                onClick={() => handleArrowClick(-1)}
              >
                &#8592;
              </div>
              <Image
                className="main-image"
                src={mainImage}
                style={{
                  width: "678px",
                  height: "700px",
                  cursor: "pointer",
                  display: "block",
                  margin: "0 auto",
                  marginTop: "-5px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
                }}
                preview={false}
                onClick={showModal}
              />
              <Modal
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
              >
                <Image
                  src={mainImage || product?.data?.coverImg}
                  preview={false}
                />
              </Modal>
              {inventory - (quantityCart || 0) <= 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 text-white rounded-[8px] text-sm px-4 py-2">
                  Hết hàng
                </div>
              )}
              <div
                className="arrow-button right"
                onClick={() => handleArrowClick(1)}
              >
                &#8594;
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <h1 className="product-title">{product?.data?.name}</h1>
          <div className="flex items-center justify-start gap-4">
            {" "}
            <Rate allowHalf disabled value={product?.data?.ratingAverage} />
            <span
              className="italic text-sm text-gray-500"
              style={{ marginTop: "10px", display: "block" }}
            >
              {inventory > 0 ? `Số lượng: ${inventory}` : "Hết hàng"}
            </span>
          </div>

          <div className="product-price font-semibold text-2xl">
            {price.toLocaleString()}₫
          </div>

          <div className="product-options">
            <label htmlFor="color" className="product-options1 ">
              Màu Sắc
            </label>
            <div className="color-options">
              {product?.data?.variants?.map((variant, index) => (
                <Button
                  key={index}
                  className={`color-option ${
                    selectedColor === variant.color ? "selected" : ""
                  }`}
                  onClick={() => handleColorSelect(variant.color)}
                  disabled={!variant.status}
                  style={{
                    padding: 0,
                    margin: "5px 0",
                    border:
                      selectedColor === variant.color
                        ? "2px solid #000"
                        : "1px solid #ccc",
                    width: "100px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {variant.color?.[0] ? (
                    <div>{variant.color}</div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: "#ccc"
                      }}
                    ></div>
                  )}
                </Button>
              ))}
            </div>

            <label className="product-options1" htmlFor="size">
              Kích Thước
            </label>
            <div className="size-options">
              {product?.data?.variants
                ?.find((variant) => variant.color === selectedColor)
                ?.sizes.map((size) => (
                  <Button
                    key={size._id}
                    onClick={() => handleSizeSelect(size.nameSize)}
                    disabled={
                      !product?.data?.variants.find(
                        (variant) => variant.color === selectedColor
                      )?.status || // Disable nếu variant.status === false
                      !size.status // Disable nếu size.status === false
                    }
                    style={{
                      border:
                        selectedSize === size.nameSize
                          ? "2px solid #000"
                          : "1px solid #ccc",
                      backgroundColor:
                        !product?.data?.variants.find(
                          (variant) => variant.color === selectedColor
                        )?.status || !size.status
                          ? "#f5f5f5"
                          : "white",
                      cursor:
                        !product?.data?.variants.find(
                          (variant) => variant.color === selectedColor
                        )?.status || !size.status
                          ? "not-allowed"
                          : "pointer"
                    }}
                  >
                    {size.nameSize}
                  </Button>
                ))}
            </div>

            <Modal
              open={isSizeGuideVisible}
              onCancel={handleSizeGuideCancel}
              footer={null}
              width={600}
            >
              <Image
                src="../../../assets/images/size.png"
                alt="Hướng dẫn chọn size"
                style={{ width: "100%", height: "auto" }}
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
              type="number"
              min={1}
              max={inventory}
              value={quantity}
              onChange={onChangeQuantity}
              className="w-14 mx-2 focus:outline-none caret-transparent"
            />
            <Button
              disabled={inventory === 0}
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>

          <div className="action-buttons mt-4">
            <button
              className="add-to-cart rounded-sm"
              onClick={() => handleAddToCart()}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
            <button
              onClick={() => handleAddToCart("buy-now")}
              className="buy-now rounded-sm"
            >
              MUA NGAY
            </button>
          </div>
          <div className="action-button2">
            <button className="like-add">
              <i className="fa fa-heart"></i> YÊU THÍCH
            </button>
            <button className="shear-add">
              CHIA SẺ <i className="fab fa-facebook"></i>
            </button>
          </div>

          <div className="infor text-gray-500">
            <p>{product?.data?.description}</p>
          </div>
        </div>

        <div>
          <div className="feedback-from">
            {/* <div className="product-feedbacks">
              <h2>XEM ĐÁNH GIÁ</h2>
              {feedbacks
                .filter((feedback) => feedback.classify === true)
                .map((feedback) => (
                  <div key={feedback.id} className="feedback-item">
                    <div className="feedback-header">
                      <img
                        src={feedback.user.avatar}
                        alt="avatar"
                        className="feedback-avatar"
                      />
                      <div>
                        <strong className="feedback-username">
                          {feedback.user.fullName}
                        </strong>
                        <p className="feedback-rating">
                          Đánh giá:
                          {[...Array(5)].map((_, index) => (
                            <span
                              key={index}
                              className={
                                index < feedback.rating
                                  ? "star-filled"
                                  : "star-empty"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                    <div className="feedback-content text-sm text-gray-500 italic">
                      <p>{feedback.comment}</p>
                    </div>
                  </div>
                ))}
              {feedbacks.length === 0 && (
                <p className="no-feedbacks-message text-sm text-gray-500 italic">
                  Chưa có đánh giá nào cho sản phẩm này.
                </p>
              )}
            </div> */}
          </div>
        </div>
      </div>
      <div className="feedback-section flex flex-col items-center justify-start px-20">
        <span className="flex items-center">
          <span className="h-px flex-1 bg-black"></span>
          <span className="shrink-0 px-6">Xem đánh giá</span>
          <span className="h-px flex-1 bg-black"></span>
        </span>
        {feedbacks
          .filter((feedback) => feedback.classify === true)
          .map((fb) => (
            <article className="rounded-xl border-2 border-gray-100 bg-white w-full my-2">
              <div className="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
                <a href="#" className="block shrink-0">
                  <img
                    alt=""
                    src={fb.user.avatar}
                    className="size-14 rounded-lg object-cover"
                  />
                </a>

                <div>
                  <div className="flex flex-col items-start justify-start mb-3">
                    <h3 className="font-medium sm:text-lg">
                      <a href="#" className="hover:underline">
                        {" "}
                        {fb.user.fullName}
                      </a>
                    </h3>
                    <Rate
                      allowHalf
                      value={fb.rating}
                      onChange={(value) => {
                        setRating(value);
                      }}
                      style={{ fontSize: 13 }}
                    />
                  </div>

                  <p className="line-clamp-2 text-sm text-gray-700">
                    {fb.comment}
                  </p>

                  <div className="mt-2 sm:flex sm:items-center sm:gap-2">
                    <div className="flex items-center gap-1 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>

                      <p className="text-xs">{feedbacks.length} comments</p>
                    </div>

                    <span className="hidden sm:block" aria-hidden="true">
                      &middot;
                    </span>
                    <p className="text-xs"> {fb.like > 0 ? fb.like : 0} like</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end cursor-pointer">
                <strong
                  className={`-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl px-6 py-2 text-white ${
                    fb.like > 0 ? "bg-green-600" : "bg-gray-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-thumbs-up"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>

                  <span className="text-[10px] font-medium sm:text-xs">
                    like
                  </span>
                </strong>
              </div>
            </article>
          ))}
      </div>

      <div className="seminal product">
        <div className="product-like">
          <h3 className="text-2xl font-bold my-5">Sản phẩm cùng loại</h3>
          <div className="product-list">
            <i
              className={`fas fa-chevron-left arrow ${
                startIndex === 0 ? "disabled" : ""
              }`}
              onClick={handlePrevious}
              style={{ cursor: startIndex === 0 ? "not-allowed" : "pointer" }}
            />
            {Array.isArray(relatedProducts) &&
              relatedProducts.length > 0 &&
              relatedProducts
                .slice(startIndex, startIndex + productsPerPage)
                .map((item, index) => <ProductCard key={index} item={item} />)}
            <i
              className={`fas fa-chevron-right arrow ${
                startIndex + productsPerPage >= allProduct.length
                  ? "disabled"
                  : ""
              }`}
              onClick={handleNext}
              style={{
                cursor:
                  startIndex + productsPerPage >= allProduct.length
                    ? "not-allowed"
                    : "pointer"
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailProduct;
