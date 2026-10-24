import { HiBars3, HiOutlineUser, HiOutlineMagnifyingGlass, HiOutlineShoppingBag } from "react-icons/hi2";
import { Link } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { useState } from "react";
import { useAppSelector } from "../hooks"; // useAppSelector hook import kar liya hai

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Cart state se products fetch kar rahe hain total count ke liye
  const { productsInCart } = useAppSelector((state: any) => state.cart);

  // Total quantity calculate karne ke liye (agar items ki quantity bhi count karni ho)
  const totalItemsCount = productsInCart?.reduce((total: number, item: any) => total + (item.quantity || 1), 0) || 0;

  return (
    <>
      <header className="max-w-screen-2xl flex justify-between items-center py-4 px-5 text-white mx-auto max-sm:px-5 max-[400px]:px-3 border-b border-white/10 bg-[#0a0a0a]">
        {/* Menu Icon */}
        <HiBars3 
          className="text-2xl max-sm:text-xl cursor-pointer hover:text-amber-500 transition-colors" 
          onClick={() => setIsSidebarOpen(true)} 
        />
        
        {/* Logo */}
        <Link
          to="/"
          className="text-4xl font-light tracking-[1.08px] max-sm:text-3xl max-[400px]:text-2xl font-serif hover:opacity-90 transition-opacity"
        >
          FASHION
        </Link>

        {/* Right Icons */}
        <div className="flex gap-4 items-center max-sm:gap-3">
          <Link to="/search" className="hover:text-amber-500 transition-colors">
            <HiOutlineMagnifyingGlass className="text-2xl max-sm:text-xl" />
          </Link>
          <Link to="/login" className="hover:text-amber-500 transition-colors">
            <HiOutlineUser className="text-2xl max-sm:text-xl" />
          </Link>
          
          {/* Cart Icon with Counter Badge */}
          <Link to="/cart" className="relative hover:text-amber-500 transition-colors">
            <HiOutlineShoppingBag className="text-2xl max-sm:text-xl" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {totalItemsCount}
              </span>
            )}
          </Link>
        </div>
      </header>
      
      <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  );
};

export default Header;