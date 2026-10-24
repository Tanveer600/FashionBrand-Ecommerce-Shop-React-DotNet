import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkRegisterFormData } from "../utils/checkRegisterFormData";
import { signupRequest } from "../redux/slice/userSlice";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("1. Register button clicked!");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log("2. Form Data:", data);

    const isValid = checkRegisterFormData(data);
    console.log("3. Is Valid Utility Check:", isValid);
    if (!isValid) {
      console.log("Validation failed inside checkRegisterFormData!");
      return;
    }

    // Front-end validation for password confirmation match
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const payload = {
      firstName: data.name,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      phoneNumber: "03000000000",
      address: "Lahore",
    };

    console.log("4. Dispatching payload to Saga:", payload);

    try {
      dispatch(signupRequest(payload));
      console.log("5. Signup action dispatched successfully!");

      toast.success("User registered successfully!");
      navigate("/login");
    } catch (error: any) {
      console.log("6. Error caught:", error);
      toast.error("An error occurred. Please try again");
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white flex items-center justify-center px-4 py-16">
      <form
        onSubmit={handleRegister}
        className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center w-full bg-[#121212] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl"
      >
        <h2 className="text-3xl sm:text-4xl text-center font-serif tracking-wide text-white mb-2">
          Create Account
        </h2>
        <p className="text-neutral-400 text-xs uppercase tracking-[0.2em] -mt-4 mb-2">
          Register to get started
        </p>

        <div className="flex flex-col gap-4 w-full">
          {/* First Name & Last Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
              >
                First Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter first name"
                required
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
                name="lastname"
                className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
            >
              Your Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold uppercase tracking-widest text-neutral-400"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="bg-[#161616] border border-white/10 text-white placeholder-neutral-500 text-base py-3 px-4 w-full rounded-xl outline-none focus:border-amber-500 transition-colors"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-[0.99] mt-2 cursor-pointer"
        >
          Register
        </button>

        <Link
          to="/login"
          className="text-sm text-neutral-400 hover:text-white transition-colors tracking-wide mt-2"
        >
          Already have an account?{" "}
          <span className="text-amber-400 font-semibold underline underline-offset-4">
            Login now
          </span>
          .
        </Link>
      </form>
    </div>
  );
};

export default Register;