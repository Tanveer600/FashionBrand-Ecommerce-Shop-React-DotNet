import { HiChevronUp } from "react-icons/hi2";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

const ShowingPagination = ({
  page,
  category,
  setCurrentPage,
}: {
  page: number;
  category: string;
  setCurrentPage: (page: number) => void;
}) => {
  const { totalProducts, showingProducts } = useAppSelector((state) => state.shop);
  const navigate = useNavigate();

  return (
    <div className="px-5 max-[400px]:px-3 mt-16 mb-24">
      <div className="flex flex-col gap-6 justify-center items-center w-full max-w-md mx-auto">
        <p className="text-neutral-400 text-xs tracking-[0.2em] uppercase font-medium">
          Showing <span className="text-white font-bold">{showingProducts}</span> of <span className="text-white font-bold">{totalProducts}</span>
        </p>

        <button
          onClick={() => {
            setCurrentPage(page + 1);
            navigate(`/shop${category ? `/${category}` : ""}?page=${page + 1}`);
          }}
          className="w-full bg-[#161616] hover:bg-amber-500 text-white hover:text-black border border-white/10 font-semibold text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl transition-all duration-300 shadow-lg"
        >
          View More Products
        </button>

        <a 
          href="#gridTop" 
          className="flex justify-center items-center text-xs tracking-widest text-neutral-400 hover:text-amber-400 gap-2 mt-4 uppercase transition-colors"
        >
          Back to Top <HiChevronUp className="text-base" />
        </a>
      </div>
    </div>
  );
};

export default ShowingPagination;