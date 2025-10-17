import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { storefrontClient } from "../lib/shopifyConfig";
import { PRODUCT_BY_ID_QUERY } from "../lib/shopifyQueries";
import { useCart } from "../context/CartContext";
import "../../assets/css/ProductDetail.css";
import Header from "../Layout/Header";
import Footer from "../Footer";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const decodedId = productId ? decodeURIComponent(productId) : null;

  useEffect(() => {
    if (decodedId) fetchProduct();
    window.scrollTo(0, 0);
  }, [decodedId]);

  const fetchProduct = async () => {
    try {
      const { data } = await storefrontClient.query(PRODUCT_BY_ID_QUERY, { id: decodedId });
      const prod = data?.product;
      if (!prod) throw new Error("Product not found");
      setProduct(prod);
      const defaultVariant = prod.variants?.edges?.[0]?.node;
      setSelectedVariant(defaultVariant);
      setSelectedOptions(
        Object.fromEntries(defaultVariant.selectedOptions.map(o => [o.name, o.value]))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (name, value) => {
    const updated = { ...selectedOptions, [name]: value };
    setSelectedOptions(updated);
    const match = product.variants.edges.find(({ node }) =>
      node.selectedOptions.every(o => updated[o.name] === o.value)
    );
    if (match) setSelectedVariant(match.node);
  };

  const handleQuantityChange = (type) => {
    setQuantity((q) => {
      const maxQty = selectedVariant?.quantityAvailable || 1;
      if (type === "inc" && q < maxQty) return q + 1;
      if (type === "dec" && q > 1) return q - 1;
      return q;
    });
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAddingToCart(true);
    await addToCart(selectedVariant.id, quantity);
    setIsAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id, quantity);
    navigate("/cart");
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currencyCode || "USD",
    }).format(price.amount);

  if (loading)
    return (
      <div className="product-loading">
        <div className="shimmer-box"></div>
        <div className="loading-text">Loading product details...</div>
      </div>
    );

  if (!product) return <p className="error-text">Product not found</p>;

  const images = product.images?.edges.map(edge => edge.node.url) || [];

  return (
    <><Header /><div className="product-detail fade-in">
      {/* --- Image Section --- */}
      <div className="image-gallery">
        <div className="gallery-container">
          <div className="main-image-container">
            <div className="main-image" onClick={() => setIsLightboxOpen(true)}>
              <img src={images[activeImage]} alt={product.title} />
            </div>
          </div>

          <div className="vertical-thumbnails">
            {images.map((img, i) => (
              <div
                key={i}
                className={`thumb-item ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Lightbox --- */}
      {isLightboxOpen && (
        <div className="lightbox-overlay">
          <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
            <X size={28} />
          </button>
          <button className="lightbox-nav lightbox-prev" onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}>
            <ChevronLeft size={40} />
          </button>
          <div className="lightbox-content">
            <img src={images[activeImage]} alt="Enlarged product view" />
          </div>
          <button className="lightbox-nav lightbox-next" onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}>
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {/* --- Info Section --- */}
      <div className="product-info">
        <h1 className="title">{product.title}</h1>
        <p className="price">{formatPrice(selectedVariant?.price)}</p>

        {/* Quantity */}
        <div className="quantity-box">
          <button onClick={() => handleQuantityChange("dec")}>−</button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange("inc")}>+</button>
        </div>

        {/* Buttons */}
        <div className="btn-group">
          <button
            className={`add-cart ${isAddingToCart ? "loading" : ""}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader className="button-loader" size={18} /> Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </button>

          <button
            className="buy-now"
            onClick={handleBuyNow}
            disabled={!selectedVariant?.availableForSale}
          >
            Buy it now
          </button>
        </div>

        {/* Options */}
        {product.options.map(opt => (
          <div key={opt.name} className="option-group">
            <p className="option-label">{opt.name}</p>
            <div className="sizes">
              {opt.values.map(val => (
                <button
                  key={val}
                  onClick={() => handleOptionChange(opt.name, val)}
                  className={`size-btn ${selectedOptions[opt.name] === val ? "active" : ""}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Stock Info */}
        <div className="stock">
          <div className="green-dot" />
          <p>{selectedVariant?.availableForSale ? "In stock, ready to ship" : "Out of stock"}</p>
        </div>

        {/* Description */}
        <div className="description">
          <h3>DESCRIPTION</h3>
          <div
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
        </div>
      </div>
    </div>
    <Footer/></>
  );
}
