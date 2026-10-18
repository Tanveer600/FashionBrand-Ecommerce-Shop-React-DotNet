import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { createProduct } from "../redux/slice/productSlice";
import { getAllCategories } from "../redux/slice/categorySlice"; // Apne category slice ke action ka naam yahan match kar lein

const AddProductForm = () => {
  const dispatch = useAppDispatch();

  // Redux store se categories get karna
  const { result: categories = [] } = useAppSelector((state: any) => state.categories || {});
console.log("Categories from Redux store:", categories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [popularity, setPopularity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Component load hone par categories fetch karna
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("Price", price);
    formData.append("StockQuantity", stockQuantity);
    formData.append("Popularity", popularity);
    formData.append("CategoryId", categoryId);
    
    if (imageFile) {
      formData.append("ImageUrl", imageFile);
    }

    // Dispatching the createProduct action with FormData
    dispatch(createProduct(formData));
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Popularity</label>
            <input
              type="number"
              value={popularity}
              onChange={(e) => setPopularity(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id || cat.Id} value={cat.id || cat.Id}>
                  {cat.name || cat.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Product Image</label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-secondaryBrown text-white p-3 rounded font-semibold hover:opacity-90 transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;