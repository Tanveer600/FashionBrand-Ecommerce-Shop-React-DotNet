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
  description, // Agar description pass ho rahi hai
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

  // Jab user click kare toh yeh product object Redux mein save ho jaye ga
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
    <div className="w-[400px] flex flex-col gap-2 justify-center max-md:w-[300px]">
      <Link
        to={`/product/${id}`}
        onClick={handleProductClick}
        className="w-full h-[300px] max-md:h-[200px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center"
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </Link>
      <Link
        to={`/product/${id}`}
        onClick={handleProductClick}
        className="text-black text-center text-3xl tracking-[1.02px] max-md:text-2xl truncate"
      >
        <h2>{title}</h2>
      </Link>
      <p className="text-secondaryBrown text-lg tracking-wide text-center max-md:text-base">
        {formatCategoryName(category)}{" "}
      </p>
      <p className="text-black text-2xl text-center font-bold max-md:text-xl">
        ${price}
      </p>
      <div className="w-full flex flex-col gap-1">
        <Link
          to={`/product/${id}`}
          onClick={handleProductClick}
          className="text-white bg-secondaryBrown text-center text-xl font-normal tracking-[0.6px] leading-[48px] w-full h-12 flex items-center justify-center max-md:text-base rounded-md"
        >
          View product
        </Link>
        <Link
          to={`/product/${id}`}
          onClick={handleProductClick}
          className="bg-white text-black text-center text-xl border border-[rgba(0,0,0,0.40)] font-normal tracking-[0.6px] leading-[48px] w-full h-12 flex items-center justify-center max-md:text-base rounded-md"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;