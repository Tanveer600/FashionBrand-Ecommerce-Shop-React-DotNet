import {
  Button,
  Dropdown,
  ProductItem,
  QuantityInput,
  StandardSelectInput,
} from "../components";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addProductToTheCart } from "../redux/slice/cartSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getProductById, getAllProducts } from "../redux/slice/productSlice";
import WithSelectInputWrapper from "../utils/withSelectInputWrapper";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";
import { formatCategoryName } from "../utils/formatCategoryName";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_API_URL || "";

const SingleProduct = () => {
  const [size, setSize] = useState<string>("xs");
  const [color, setColor] = useState<string>("black");
  const [quantity, setQuantity] = useState<number>(1);
  
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Redux store se selected product aur all products get karna
  const { selectedProduct, result: rawProducts } = useAppSelector((state: any) => state.products || {});

  // Page refresh ya direct URL hit hone par product fetch karna
  useEffect(() => {
    if (params.id) {
      dispatch(getProductById(params.id));
    }
    dispatch(getAllProducts());
  }, [dispatch, params.id]);

  // Helper function to format image URL properly
  const getImageUrl = (imgpath: string) => {
    if (!imgpath) return "";
    return imgpath.startsWith("http") ? imgpath : `${BACKEND_URL}${imgpath}`;
  };

  // Backend properties ko map karna
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

  // Target product find karna (selectedProduct ya mappedProducts se matching ID)
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

  // defining HOC instances
  const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(
        addProductToTheCart({
          id: `${currentProduct.id}-${size}-${color}`, // Unique cart item ID based on variant
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
    <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3">
      <div className="grid grid-cols-3 gap-x-8 max-lg:grid-cols-1">
        <div className="lg:col-span-2 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center min-h-[400px]">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full flex flex-col gap-5 mt-9">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl">{currentProduct?.title}</h1>
            <div className="flex justify-between items-center">
              <p className="text-base text-secondaryBrown">
                {formatCategoryName(currentProduct?.category || "")}
              </p>
              <p className="text-base font-bold">${ currentProduct?.price }</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SelectInputUpgrade
              selectList={[
                { id: "xs", value: "XS" },
                { id: "sm", value: "SM" },
                { id: "m", value: "M" },
                { id: "lg", value: "LG" },
                { id: "xl", value: "XL" },
                { id: "2xl", value: "2XL" },
              ]}
              value={size}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSize(() => e.target.value)
              }
            />
            <SelectInputUpgrade
              selectList={[
                { id: "black", value: "BLACK" },
                { id: "red", value: "RED" },
                { id: "blue", value: "BLUE" },
                { id: "white", value: "WHITE" },
                { id: "rose", value: "ROSE" },
                { id: "green", value: "GREEN" },
              ]}
              value={color}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setColor(() => e.target.value)
              }
            />

            <QuantityInputUpgrade
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity(() => parseInt(e.target.value))
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button mode="brown" text="Add to cart" onClick={handleAddToCart} />
            <p className="text-secondaryBrown text-sm text-right">
              Delivery estimated on the Friday, July 26
            </p>
          </div>
          <div>
            <Dropdown dropdownTitle="Description">
              {currentProduct?.description || "No description available for this product."}
            </Dropdown>

            <Dropdown dropdownTitle="Product Details">
              Stock Quantity: {currentProduct?.stock} | Popularity: {currentProduct?.popularity}
            </Dropdown>

            <Dropdown dropdownTitle="Delivery Details">
              Standard shipping available. Delivered within 3-5 business days.
            </Dropdown>
          </div>
        </div>
      </div>

      {/* similar products */}
      <div>
        <h2 className="text-black/90 text-5xl mt-24 mb-12 text-center max-lg:text-4xl">
          Similar Products
        </h2>
        <div className="flex flex-wrap justify-between items-center gap-y-8 mt-12 max-xl:justify-start max-xl:gap-5 ">
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