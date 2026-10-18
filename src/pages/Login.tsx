import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkLoginFormData } from "../utils/checkLoginFormData";
import { loginRequest } from "../redux/slice/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🚀 1. Login button clicked, handleLogin triggered!");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log("📦 2. Form data collected:", data);

    const isValid = checkLoginFormData(data);
    console.log("🔍 3. Form validation result:", isValid);

    if (!isValid) {
      console.log("❌ 4. Form validation failed, stopping execution.");
      return;
    }
    
    console.log("🔥 5. Dispatching loginRequest action to Redux-Saga...");
    dispatch(
      loginRequest({
        email: data.email,
        password: data.password,
        navigate, // ✅ Yahan navigate pass kiya gaya hai
      })
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="max-w-5xl mx-auto flex flex-col gap-5 max-sm:gap-3 items-center justify-center max-sm:px-5 w-full px-4"
      >
        <h2 className="text-5xl text-center mb-5 font-thin max-md:text-4xl max-sm:text-3xl max-[450px]:text-xl max-[450px]:font-normal">
          Welcome Back! Login here:
        </h2>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Your email</label>
            <input
              type="email"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter email address"
              name="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Your password</label>
            <input
              type="password"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter password"
              name="password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#5c4033] text-white py-3 px-6 text-xl w-full cursor-pointer hover:opacity-90 transition"
        >
          Login
        </button>

        <Link
          to="/register"
          className="text-xl max-md:text-lg max-[450px]:text-sm"
        >
          Don’t have an account?{" "}
          <span className="text-secondaryBrown">Register now</span>.
        </Link>
      </form>
    </div>
  );
};

export default Login;