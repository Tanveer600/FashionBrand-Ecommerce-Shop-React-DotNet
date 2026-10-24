// import { Link } from "react-router-dom";

// const Banner = () => {
//   return (
//     <div className="banner w-full flex flex-col justify-end items-center max-sm:h-[550px] max-sm:gap-2">
//       <h2 className="text-white text-center text-6xl font-bold tracking-[1.86px] leading-[60px] max-sm:text-4xl max-[400px]:text-3xl">
//         Discover the Best <br />
//         Fashion Collection
//       </h2>
//       <h3 className="text-white text-3xl font-normal leading-[72px] tracking-[0.9px] max-sm:text-xl max-[400px]:text-lg">
//         The High-Quality Collection
//       </h3>
//       <div className="flex justify-center items-center gap-3 pb-10 max-[400px]:flex-col max-[400px]:gap-1 w-[420px] max-sm:w-[350px] max-[400px]:w-[300px]">
//       <Link to="/shop" className="bg-white text-black text-center text-xl border border-[rgba(0, 0, 0, 0.40)] font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center">
//           Shop Now
//         </Link>
//         <Link to="/shop" className="text-white border-white border-2 text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center">See Collection</Link>
//       </div>
//     </div>
//   );
// };
// export default Banner;
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAllProducts } from "../redux/slice/productSlice";

const BACKEND_URL = import.meta.env.VITE_API_URL || "";

const Banner = () => {
  const dispatch = useAppDispatch();
  const { result: rawProducts } = useAppSelector((state: any) => state.products || {});

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const getImageUrl = (imgpath: string) => {
    if (!imgpath) return "";
    return imgpath.startsWith("http") ? imgpath : `${BACKEND_URL}${imgpath}`;
  };

  // Pehle product ki imageUrl nikal rahe hain jo console mein nazar aa rahi hai
  const firstProduct = rawProducts && rawProducts.length > 0 ? rawProducts[0] : null;
  const rawImg = firstProduct?.imageUrl || firstProduct?.ImageUrl || firstProduct?.image || "";
  const dynamicBannerImg = rawImg ? getImageUrl(rawImg) : "";

  console.log("Banner Image URL:", dynamicBannerImg); // Debugging ke liye

  return (
    <div 
      className="w-full flex flex-col justify-end items-center max-sm:h-[550px] max-sm:gap-2 bg-cover bg-no-repeat transition-all duration-500"
      style={{
        height: "800px",
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%), url("${dynamicBannerImg}")`,
        backgroundPosition: "10% 25%",
      }}
    >
      <h2 className="text-white text-center text-6xl font-bold tracking-[1.86px] leading-[60px] max-sm:text-4xl max-[400px]:text-3xl">
        Discover the Best <br />
        Fashion Collection
      </h2>
      <h3 className="text-white text-3xl font-normal leading-[72px] tracking-[0.9px] max-sm:text-xl max-[400px]:text-lg">
        The High-Quality Collection
      </h3>
      <div className="flex justify-center items-center gap-3 pb-10 max-[400px]:flex-col max-[400px]:gap-1 w-[420px] max-sm:w-[350px] max-[400px]:w-[300px]">
        <Link to="/shop" className="bg-white text-black text-center text-xl border font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center">
          Shop Now
        </Link>
        <Link to="/shop" className="text-white border-white border-2 text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center">
          See Collection
        </Link>
      </div>
    </div>
  );
};

export default Banner;