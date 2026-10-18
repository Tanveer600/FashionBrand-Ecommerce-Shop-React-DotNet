import { Link } from "react-router-dom";

const CategoryItem = ({ categoryTitle, image, link }: { categoryTitle: string; image: string; link: string }) => {
  return (
    <div className="w-full h-[320px] relative rounded-xl overflow-hidden shadow-sm group cursor-pointer">
      <Link to={`/shop/${link}`} className="block w-full h-full">
        {/* Image Container with object-cover and smooth transition */}
        <img 
          src={image} 
          alt={categoryTitle} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Title Badge */}
        <div className="absolute bottom-0 w-full p-4 text-center text-white">
          <h3 className="text-xl sm:text-2xl font-serif tracking-wide drop-shadow-md">{categoryTitle}</h3>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;