import React from "react";
import { Link } from "react-router-dom";
import { formatCategoryName } from "../utils/formatCategoryName";
import { useAppDispatch } from "../hooks";
import { setSelectedProduct } from "../redux/slice/productSlice";

const ProductItem = ({
  id,
  image,
  title,
  category,
  price,
  popularity,
  stock,
  description,
}: {
  id: string | number;
  image: string;
  title: string;
  category: string;
  price: number;
  popularity: number;
  stock: number;
  description?: string;
}) => {
  const dispatch = useAppDispatch();

  const handleProductClick = () => {
    dispatch(
      setSelectedProduct({
        id,
        image,
        title,
        category,
        price,
        popularity,
        stock,
        description,
      })
    );
  };

  return (
    <div className="w-full max-w-[320px] flex flex-col bg-[#141414] border border-white/10 rounded-2xl p-3.5 shadow-xl hover:border-amber-500/40 transition-all duration-300 group mx-auto">
      {/* Product Image Container (Height compact kar di hai: 260px) */}
      <Link
        to={`/product/${id}`}
        onClick={handleProductClick}
        className="w-full h-[260px] max-md:h-[220px] overflow-hidden rounded-xl bg-[#1a1a1a] relative block"
      >
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        {stock <= 0 && (
          <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full font-medium shadow-md">
            Sold Out
          </span>
        )}
      </Link>

      {/* Product Info (Tightened gap for compact look) */}
      <div className="flex flex-col items-center text-center gap-1 mt-3 px-1">
        <p className="text-[#a3a3a3] text-[10px] uppercase tracking-[0.2em] font-medium">
          {formatCategoryName(category)}
        </p>

        <Link
          to={`/product/${id}`}
          onClick={handleProductClick}
          className="text-white hover:text-amber-400 transition-colors text-sm tracking-wide font-serif truncate w-full"
        >
          <h2>{title}</h2>
        </Link>

        <p className="text-amber-400 font-bold text-base tracking-wider mt-0.5">
          ${price.toLocaleString()}
        </p>
      </div>

      {/* Action Buttons (Clean & Compact) */}
      <div className="w-full flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
        <Link
          to={`/product/${id}`}
          onClick={handleProductClick}
          className="text-black bg-white hover:bg-amber-400 text-center text-[11px] font-semibold tracking-wider uppercase py-2.5 w-full flex items-center justify-center rounded-lg transition-colors"
        >
          View Product
        </Link>
        <Link
          to={`/product/${id}`}
          onClick={handleProductClick}
          className="bg-[#1c1c1c] text-white hover:bg-white/10 text-center text-[11px] font-semibold tracking-wider uppercase border border-white/10 py-2.5 w-full flex items-center justify-center rounded-lg transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;