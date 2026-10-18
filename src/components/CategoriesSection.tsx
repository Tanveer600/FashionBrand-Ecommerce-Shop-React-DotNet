import { useState, useEffect } from "react";
import CategoryItem from "./CategoryItem";
import { useAppDispatch, useAppSelector } from "../hooks"; 
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../redux/slice/categorySlice"; 
import { RootState } from "../store";

// Vite environment variable se base URL uthana (Professional Standard)
const BACKEND_URL = import.meta.env.VITE_API_URL || "";
console.log('Backend URL:', BACKEND_URL);
const CategoriesSection = () => {
  const dispatch = useAppDispatch();
  const { result: categories, isLoading } = useAppSelector(
    (state: RootState) => (state as any).categories
  );
  console.log('categories:', categories);

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<any>(null);
  
  // Model Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleOpenAddForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName("");
    setDescription("");
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (cat: any) => {
    setIsEditing(true);
    setCurrentId(cat.id || cat.Id);
    setName(cat.name || cat.Name || "");
    setDescription(cat.description || cat.Description || "");
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // FormData ka use taake file aur data multipart/form-data format mein jaye
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    if (imageFile) {
      formData.append("ImageFile", imageFile);
    }

    if (isEditing) {
      formData.append("Id", currentId);
      dispatch(updateCategory(formData));
    } else {
      dispatch(createCategory(formData));
    }

    setIsFormOpen(false);
    setName("");
    setDescription("");
    setImageFile(null);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleDelete = (catId: any) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(catId));
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-200 pb-6 gap-4">
        <div>
          <span className="text-sm uppercase tracking-widest text-gray-500 font-semibold">Collections</span>
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-900 tracking-tight mt-1">
            Our Categories
          </h2>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-neutral-800 transition-all duration-300 shadow-sm hover:shadow cursor-pointer flex items-center gap-2"
        >
          <span>+</span> Add Category
        </button>
      </div>

      {/* Modal Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-serif font-medium mb-6 text-gray-900 border-b pb-3">
              {isEditing ? "Edit Category" : "New Category"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Special Edition"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter a brief overview..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-2">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer border border-gray-200 bg-gray-50 rounded-xl"
                />
                {imageFile && (
                  <p className="text-xs text-gray-500 mt-2 italic">Selected: {imageFile.name}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-sm font-medium transition cursor-pointer shadow"
                >
                  {isEditing ? "Update Changes" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clean Grid Layout */}
      {isLoading && (!categories || categories.length === 0) ? (
        <div className="text-center py-24 text-gray-400 font-light tracking-wide">Loading collections...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories && categories.length > 0 ? (
            categories.map((cat: any) => {
              const catId = cat.id || cat.Id;
              const catName = cat.name || cat.Name;
              const rawImgPath = cat.imageUrl || cat.image || cat.Image;

              // Environment-based URL mapping for images
              const catImage = rawImgPath 
                ? (rawImgPath.startsWith("http") ? rawImgPath : `${BACKEND_URL}${rawImgPath}`)
                : "luxury category 1.png";
              
              return (
                <div 
                  key={catId} 
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-2">
                    <CategoryItem
                      categoryTitle={catName}
                      image={catImage}
                      link={`shop/${(catName || "").toLowerCase().replace(/\s+/g, '-')}`}
                    />
                  </div>

                  <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate max-w-[120px]" title={cat.description || cat.Description}>
                      {cat.description || cat.Description || "No description"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditForm(cat)}
                        className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(catId)}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              No categories found. Click "+ Add Category" to start building your store.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;