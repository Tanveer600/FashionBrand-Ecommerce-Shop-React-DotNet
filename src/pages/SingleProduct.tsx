import {
  Button,
  Dropdown,
  ProductItem,
} from "../components";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addProductToTheCart } from "../redux/slice/cartSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getProductById, getAllProducts } from "../redux/slice/productSlice";
import { formatCategoryName } from "../utils/formatCategoryName";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_API_URL || "";

const SingleProduct = () => {
  const [size, setSize] = useState<string>("xs");
  const [color, setColor] = useState<string>("black");
  const [quantity, setQuantity] = useState<number>(1);
  
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Redux store
  const { selectedProduct, result: rawProducts } = useAppSelector((state: any) => state.products || {});

  useEffect(() => {
    if (params.id) {
      dispatch(getProductById(params.id));
    }
    dispatch(getAllProducts());
  }, [dispatch, params.id]);

  const getImageUrl = (imgpath: string) => {
    if (!imgpath) return "";
    return imgpath.startsWith("http") ? imgpath : `${BACKEND_URL}${imgpath}`;
  };

  const mappedProducts = (rawProducts || []).map((item: any) => {
    const rawImg = item.imageUrl || item.ImageUrl || item.image || "";
    return {
      id: item.id || item.Id,
      title: item.name || item.Name || "",
      description: item.description || item.Description || "",
      price: item.price || item.Price || 0,
      stock: item.stockQuantity || item.StockQuantity || item.stock || 0,
      popularity: item.popularity || item.Popularity || 0,
      image: getImageUrl(rawImg),
      category: item.category?.name || item.Category?.Name || item.category || "",
    };
  });

  const targetProduct = selectedProduct || mappedProducts.find((p: any) => String(p.id) === String(params.id));
  const rawTargetImg = targetProduct?.imageUrl || targetProduct?.ImageUrl || targetProduct?.image || "";

  const currentProduct = targetProduct ? {
    id: targetProduct.id || targetProduct.Id,
    title: targetProduct.name || targetProduct.Name || targetProduct.title || "",
    description: targetProduct.description || targetProduct.Description || "",
    price: targetProduct.price || targetProduct.Price || 0,
    stock: targetProduct.stockQuantity || targetProduct.StockQuantity || targetProduct.stock || 0,
    popularity: targetProduct.popularity || targetProduct.Popularity || 0,
    image: getImageUrl(rawTargetImg),
    category: targetProduct.category?.name || targetProduct.Category?.Name || targetProduct.category || "",
  } : null;

  const sizesList = [
    { id: "xs", label: "XS" },
    { id: "sm", label: "SM" },
    { id: "m", label: "M" },
    { id: "lg", label: "LG" },
    { id: "xl", label: "XL" },
    { id: "2xl", label: "2XL" },
  ];

  const colorsList = [
    { id: "black", label: "BLACK", hex: "#000000" },
    { id: "red", label: "RED", hex: "#ef4444" },
    { id: "blue", label: "BLUE", hex: "#3b82f6" },
    { id: "white", label: "WHITE", hex: "#ffffff" },
    { id: "rose", label: "ROSE", hex: "#f43f5e" },
    { id: "green", label: "GREEN", hex: "#10b981" },
  ];

  const handleAddToCart = () => {
    if (currentProduct) {
      const maxStock = currentProduct.stock || 1;

      if (quantity > maxStock) {
        toast.error(`Aap available stock (${maxStock}) se zyada add nahi kar sakte!`);
        return;
      }

      dispatch(
        addProductToTheCart({
          id: `${currentProduct.id}-${size}-${color}`,
          productId: currentProduct.id,
          image: currentProduct.image,
          imageUrl: currentProduct.image,
          title: currentProduct.title,
          category: currentProduct.category,
          price: currentProduct.price,
          quantity,
          size,
          color,
          popularity: currentProduct.popularity,
          stock: currentProduct.stock,
        })
      );
      toast.success("Product added to the cart");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12 max-[400px]:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Product Image */}
        <div className="lg:col-span-7 overflow-hidden rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center min-h-[450px] max-h-[650px] shadow-2xl relative group">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Product Details & Selectors */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="border-b border-white/10 pb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500 font-semibold mb-2">
              {formatCategoryName(currentProduct?.category || "")}
            </p>
            <h1 className="text-3xl lg:text-4xl font-serif text-white tracking-wide">{currentProduct?.title}</h1>
            <p className="text-3xl font-bold text-amber-400 mt-3">${currentProduct?.price}</p>
          </div>

          {/* Size Selector */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs tracking-widest text-neutral-400 uppercase">
              <span>Select Size</span>
              <span className="text-amber-500 font-medium">{size.toUpperCase()}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {sizesList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSize(item.id)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-lg border tracking-wider transition-all duration-200 ${
                    size === item.id
                      ? "bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20"
                      : "bg-[#161616] text-neutral-300 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs tracking-widest text-neutral-400 uppercase">
              <span>Select Color</span>
              <span className="text-amber-500 font-medium">{color.toUpperCase()}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colorsList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setColor(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    color === item.id
                      ? "bg-[#222222] text-white border-amber-500 ring-1 ring-amber-500"
                      : "bg-[#161616] text-neutral-400 border-white/10 hover:border-white/30 hover:text-neutral-200"
                  }`}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/20" 
                    style={{ backgroundColor: item.hex }} 
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector with Available Stock Display & Restriction */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs tracking-widest text-neutral-400 uppercase">
              <span>Quantity</span>
              <span>Available Stock: <strong className="text-amber-400">{currentProduct?.stock || 0}</strong></span>
            </div>
            <div className="flex items-center w-36 bg-[#161616] border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-9 flex items-center justify-center text-white hover:bg-white/10 rounded-md transition-colors font-bold cursor-pointer"
              >
                -
              </button>
              <span className="flex-1 text-center text-white text-sm font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => {
                  const maxStock = currentProduct?.stock || 1;
                  if (quantity < maxStock) {
                    setQuantity((prev) => prev + 1);
                  } else {
                    toast.error(`Maximum stock limit is ${maxStock}!`);
                  }
                }}
                className="w-10 h-9 flex items-center justify-center text-white hover:bg-white/10 rounded-md transition-colors font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Super Attractive Add to Cart Button */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-white to-amber-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-[2px]" />
              <div className="relative w-full bg-amber-500 group-hover:bg-amber-400 text-black font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl">
                <span>Add To Cart</span>
                <span className="text-lg leading-none">→</span>
              </div>
            </button>
            <p className="text-neutral-400 text-xs text-right tracking-wide">
              Delivery estimated on Friday, July 26
            </p>
          </div>

          {/* Accordion / Dropdowns */}
          <div className="border-t border-white/10 pt-6 space-y-3 [&_button]:text-white [&_button]:font-medium [&_h3]:text-white [&_span]:text-white [&_p]:text-neutral-300">
            <div className="bg-[#141414] border border-white/10 rounded-xl p-3 hover:border-white/20 transition-colors">
              <Dropdown dropdownTitle="Description">
                <p className="text-neutral-300 text-sm leading-relaxed pt-2">
                  {currentProduct?.description || "No description available for this product."}
                </p>
              </Dropdown>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-xl p-3 hover:border-white/20 transition-colors">
              <Dropdown dropdownTitle="Product Details">
                <p className="text-neutral-300 text-sm pt-2">
                  Stock Quantity: <span className="text-amber-400 font-semibold">{currentProduct?.stock}</span> | Popularity: <span className="text-amber-400 font-semibold">{currentProduct?.popularity}</span>
                </p>
              </Dropdown>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-xl p-3 hover:border-white/20 transition-colors">
              <Dropdown dropdownTitle="Delivery Details">
                <p className="text-neutral-300 text-sm pt-2">
                  Standard shipping available. Delivered within 3-5 business days.
                </p>
              </Dropdown>
            </div>
          </div>

        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-24 border-t border-white/10 pt-16">
        <h2 className="text-white text-3xl font-serif mb-12 text-center tracking-wide">
          Similar Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {mappedProducts.slice(0, 3).map((product: any) => (
            <ProductItem
              key={product?.id}
              id={product?.id}
              image={product?.image}
              title={product?.title}
              category={product?.category}
              price={product?.price}
              popularity={product?.popularity}
              stock={product?.stock}
              description={product?.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;