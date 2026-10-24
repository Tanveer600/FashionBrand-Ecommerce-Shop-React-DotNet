import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { logout } from "../redux/slice/userSlice"; // Yahan loginUser aur setUser bhi import kar liye hain

const SidebarMenu = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (prev: boolean) => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // userSlice se currentUser ko get kar rahe hain
  const { currentUser } = useAppSelector((state) => state.users);
  console.log("SidebarMenu - currentUser:", currentUser); // Debugging ke liye console log
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    dispatch(logout()); // userSlice ki logout action
    navigate("/login");
  };

  useEffect(() => {
    if (isSidebarOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <>
      {(isSidebarOpen || isAnimating) && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Sidebar Drawer Container */}
          <div
            className={`absolute top-0 left-0 w-80 max-w-[85vw] h-full bg-[#121212] border-r border-white/10 shadow-2xl flex flex-col pointer-events-auto transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Top Bar: Close Button */}
            <div className="flex justify-end p-5">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <HiXMark className="text-2xl" />
              </button>
            </div>

            {/* Brand Logo inside Sidebar */}
            <div className="flex justify-center pb-6 border-b border-white/10 px-6">
              <Link
                to="/"
                onClick={() => setIsSidebarOpen(false)}
                className="font-serif text-3xl tracking-[0.2em] text-white font-medium hover:opacity-90 transition-opacity"
              >
                FASHION
              </Link>
            </div>

            {/* Navigation Links List */}
            <div className="flex flex-col overflow-y-auto flex-grow py-4 px-6 space-y-1 custom-scrollbar">
              <Link
                to="/"
                onClick={() => setIsSidebarOpen(false)}
                className="py-3 text-neutral-300 hover:text-amber-400 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsSidebarOpen(false)}
                className="py-3 text-neutral-300 hover:text-amber-400 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block"
              >
                Shop
              </Link>
              <Link
                to="/search"
                onClick={() => setIsSidebarOpen(false)}
                className="py-3 text-neutral-300 hover:text-amber-400 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block"
              >
                Search
              </Link>

              {currentUser ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsSidebarOpen(false);
                  }}
                  className="py-3 text-left text-rose-400 hover:text-rose-300 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block w-full cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsSidebarOpen(false)}
                    className="py-3 text-neutral-300 hover:text-amber-400 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsSidebarOpen(false)}
                    className="py-3 text-neutral-300 hover:text-amber-400 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <Link
                to="/cart"
                onClick={() => setIsSidebarOpen(false)}
                className="py-3 text-neutral-300 hover:text-amber-400 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block"
              >
                Cart
              </Link>

              {/* ADMIN ONLY LINKS: currentUser ka role check ho raha hai */}
              {currentUser && currentUser.role === "admin" && (
                <>
                  <Link
                    to="/addproductform"
                    onClick={() => setIsSidebarOpen(false)}
                    className="py-3 text-neutral-300 hover:text-amber-400 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block"
                  >
                    Add Product
                  </Link>
                  <Link
                    to="/category"
                    onClick={() => setIsSidebarOpen(false)}
                    className="py-3 text-neutral-300 hover:text-amber-400 border-b border-white/5 text-sm tracking-widest uppercase transition-colors block"
                  >
                    Categories
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarMenu;