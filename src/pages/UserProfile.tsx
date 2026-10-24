import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoginStatus } from "../features/auth/authSlice";
import { setUser, updateUser as updateAction } from "../redux/slice/userSlice";
import { RootState, store } from "../store";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedUser, isLoading } = useSelector(
    (state: RootState) => (state as any).users
  );

  const [formDataState, setFormDataState] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    Address: "",
  });

  const getUserId = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    return storedUser.userId || storedUser.UserId || storedUser.id;
  };

  const logout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    store.dispatch(setLoginStatus(false));
    navigate("/login");
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please login to view this page");
      navigate("/login");
    } else {
      dispatch(setUser({ id: userId }));
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (selectedUser) {
      setFormDataState({
        FirstName:
          (selectedUser as any).firstName || (selectedUser as any).FirstName || "",
        LastName:
          (selectedUser as any).lastName || (selectedUser as any).LastName || "",
        Email: (selectedUser as any).email || (selectedUser as any).Email || "",
        Password:
          (selectedUser as any).password || (selectedUser as any).Password || "",
        PhoneNumber:
          (selectedUser as any).phoneNumber ||
          (selectedUser as any).PhoneNumber ||
          "",
        Address:
          (selectedUser as any).address || (selectedUser as any).Address || "",
      });
    }
  }, [selectedUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataState({ ...formDataState, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = getUserId();

    if (userId) {
      dispatch(updateAction({ id: userId, ...formDataState } as any));
      toast.success("User update request sent!");
    } else {
      toast.error("Please login to view this page");
      navigate("/login");
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white flex items-center justify-center px-4 py-16">
      <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center w-full bg-[#121212] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
        
        {/* Title Header */}
        <h2 className="text-3xl sm:text-4xl text-center font-serif tracking-wide text-white mb-1">
          User Profile
        </h2>
        <p className="text-neutral-400 text-xs uppercase tracking-[0.2em] -mt-4 mb-2">
          Manage your account settings
        </p>

        <form className="flex flex-col gap-4 w-full" onSubmit={handleUpdateSubmit}>
          
          {/* First & Last Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstname"
                className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="FirstName"
                value={formDataState.FirstName}
                onChange={handleInputChange}
                className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter first name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastname"
                className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="LastName"
                value={formDataState.LastName}
                onChange={handleInputChange}
                className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="Email"
              value={formDataState.Email}
              onChange={handleInputChange}
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter email address"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="Password"
              value={formDataState.Password}
              onChange={handleInputChange}
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter new password"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phonenumber"
              className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phonenumber"
              name="PhoneNumber"
              value={formDataState.PhoneNumber}
              onChange={handleInputChange}
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter phone number"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="Address"
              value={formDataState.Address}
              onChange={handleInputChange}
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter address"
            />
          </div>

          {/* Primary Action: Update Profile */}
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-[0.99] mt-2 cursor-pointer"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>

          {/* Secondary Action: Order History Link */}
          <Link
            to="/order-history"
            className="w-full text-center bg-[#161616] hover:bg-[#202020] border border-white/10 text-white font-semibold text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl transition-all duration-300 active:scale-[0.99]"
          >
            View Order History
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-semibold text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl transition-all duration-300 active:scale-[0.99] cursor-pointer mt-1"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;