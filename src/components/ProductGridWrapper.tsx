import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAllProducts, setShowingProducts, setTotalProducts } from "../redux/slice/productSlice";

const BACKEND_URL = import.meta.env.VITE_API_URL || "";

const ProductGridWrapper = ({
  searchQuery,
  sortCriteria,
  category,
  page,
  limit,
  children,
}: {
  searchQuery?: string;
  sortCriteria?: string;
  category?: string;
  page?: number;
  limit?: number;
  children: any;
}) => {
  const dispatch = useAppDispatch();
  
  // Sab kuch ab aik hi 'state.products' slice se aa raha hai
  const productStore = useAppSelector((state: any) => state.products) || {};
  console.log("Product store from Redux:", productStore);
  const rawProducts = productStore.result || [];
  const isLoading = productStore.isLoading || false;
  const totalProducts = productStore.totalProducts || 0;

  // Component load hone par backend se products fetch karna via Redux Saga
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Backend properties ko template ke mutabiq map karna aur absolute image URL banana
  const mappedProducts = (rawProducts || []).map((item: any) => {
    const rawImg = item.imageUrl || item.ImageUrl || item.image;
    const finalImage = rawImg 
      ? (rawImg.startsWith("http") ? rawImg : `${BACKEND_URL}${rawImg}`)
      : "";

    return {
      id: item.id || item.Id,
      title: item.name || item.Name || "",
      description: item.description || item.Description || "",
      price: item.price || item.Price || 0,
      stock: item.stockQuantity || item.StockQuantity || item.stock || 0,
      popularity: item.popularity || item.Popularity || 0,
      image: finalImage,
      category: item.category?.name || item.Category?.Name || item.category || "",
    };
  });

  // Filtering, searching, and sorting logic
  let filteredProducts = mappedProducts.filter((product: any) =>
    product.title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  if (category) {
    filteredProducts = filteredProducts.filter((product: any) =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (totalProducts !== filteredProducts.length) {
    dispatch(setTotalProducts(filteredProducts.length));
  }

  if (sortCriteria === "price-asc") {
    filteredProducts.sort((a: any, b: any) => a.price - b.price);
  } else if (sortCriteria === "price-desc") {
    filteredProducts.sort((a: any, b: any) => b.price - a.price);
  } else if (sortCriteria === "popularity") {
    filteredProducts.sort((a: any, b: any) => b.popularity - a.popularity);
  }

  let finalProducts = filteredProducts;
  if (limit) {
    finalProducts = filteredProducts.slice(0, limit);
    dispatch(setShowingProducts(finalProducts.length));
  } else if (page) {
    finalProducts = filteredProducts.slice(0, page * 9);
    dispatch(setShowingProducts(finalProducts.length));
  } else {
    dispatch(setShowingProducts(filteredProducts.length));
  }

const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as any, { products: finalProducts });
    }
    return null;
  });

  if (isLoading && mappedProducts.length === 0) {
    return <div className="text-center py-20 text-gray-400">Loading products from server...</div>;
  }

  return childrenWithProps;
};

export default ProductGridWrapper;