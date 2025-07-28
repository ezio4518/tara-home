import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";
import { FaCheckCircle } from "react-icons/fa";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
        setProductData(product);
        setImage(product.image[0]);
    }
  }, [productId, products]);

  const handleAddToCart = (id) => {
    addToCart(id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1000);
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        <div className="flex-1 text-[#40350A]">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price} / {productData.unit || 'piece'}
          </p>
          <p className="mt-5 text-[#A1876F] md:w-4/5">
            {productData.description}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => handleAddToCart(productData._id)}
              className="bg-[#40350A] text-[#F0E1C6] px-8 py-3 text-sm active:bg-[#2e2607] cursor-pointer"
            >
              ADD TO CART
            </button>

            {addedToCart && (
              <span
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #40350A",
                  color: "#40350A",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.9rem",
                  userSelect: "none",
                }}
              >
                <FaCheckCircle />
                Product added
              </span>
            )}
          </div>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-[#A1876F] mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-20 text-[#40350A]">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-[#A1876F]">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0 min-h-screen"></div>
  );
};

export default Product;