import { useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoginStatus } from "../features/auth/authSlice";
import { setUser, updateUser as updateAction } from "../redux/slice/userSlice";
import { RootState, store } from "../store";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Is line ko replace kar dein:
const { selectedUser, isLoading } = useSelector((state: RootState) => (state as any).users);
console.log("🚀 0. UserProfile component rendered, selectedUser from Redux:", selectedUser);
  // C# UpdateUserDto ke mutabiq keys set ki hain
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

  // Get user profile on load based on userId
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please login to view this page");
      navigate("/login");
    } else {
      dispatch(setUser({ id: userId })); 
    }
  }, [dispatch, navigate]);

  // Redux se data milne par form state ko populate karna
  useEffect(() => {
    if (selectedUser) {
      setFormDataState({
        FirstName: (selectedUser as any).firstName || (selectedUser as any).FirstName || "",
        LastName: (selectedUser as any).lastName || (selectedUser as any).LastName || "",
        Email: (selectedUser as any).email || (selectedUser as any).Email || "",
        Password: (selectedUser as any).password || (selectedUser as any).Password || "",
        PhoneNumber: (selectedUser as any).phoneNumber || (selectedUser as any).PhoneNumber || "",
        Address: (selectedUser as any).address || (selectedUser as any).Address || "",
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
      // 'data:' ki nesting hata kar direct properties bhejien taake C# DTO se match ho jaye
      dispatch(updateAction({ id: userId, ...formDataState } as any));
      toast.success("User update request sent!");
    } else {
      toast.error("Please login to view this page");
      navigate("/login");
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-24 px-5">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <form className="flex flex-col gap-6" onSubmit={handleUpdateSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter first name"
            id="firstname"
            name="FirstName"
            value={formDataState.FirstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter last name"
            id="lastname"
            name="LastName"
            value={formDataState.LastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter email address"
            id="email"
            name="Email"
            value={formDataState.Email}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter password"
            id="password"
            name="Password"
            value={formDataState.Password}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phonenumber">Phone Number</label>
          <input
            type="text"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter phone number"
            id="phonenumber"
            name="PhoneNumber"
            value={formDataState.PhoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter address"
            id="address"
            name="Address"
            value={formDataState.Address}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" text={isLoading ? "Updating..." : "Update Profile"} mode="brown" />
        <Link
          to="/order-history"
          className="bg-white text-black text-center text-xl border border-gray-400 font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center max-md:text-base"
        >
          Order History
        </Link>
        <Button onClick={logout} text="Logout" mode="white" />
      </form>
    </div>
  );
};

export default UserProfile;