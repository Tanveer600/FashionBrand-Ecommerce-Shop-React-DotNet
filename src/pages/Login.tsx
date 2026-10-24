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
        navigate,
      })
    );
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white flex items-center justify-center px-4 py-16">
      <form
        onSubmit={handleLogin}
        className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center w-full bg-[#121212] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl"
      >
        <h2 className="text-3xl sm:text-4xl text-center font-serif tracking-wide text-white mb-2">
          Welcome Back!
        </h2>
        <p className="text-neutral-400 text-xs uppercase tracking-[0.2em] -mt-4 mb-2">
          Login to your account
        </p>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Your Email
            </label>
            <input
              type="email"
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter email address"
              name="email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Your Password
            </label>
            <input
              type="password"
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter password"
              name="password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-[0.99] mt-2 cursor-pointer"
        >
          Login
        </button>

        <Link
          to="/register"
          className="text-sm text-neutral-400 hover:text-white transition-colors tracking-wide mt-2"
        >
          Don’t have an account?{" "}
          <span className="text-amber-400 font-semibold underline underline-offset-4">Register now</span>.
        </Link>
      </form>
    </div>
  );
};

export default Login;