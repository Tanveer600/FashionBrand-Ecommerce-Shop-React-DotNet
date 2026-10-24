import { useState } from "react";
import { HiTrash as TrashIcon } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeProductFromTheCart } from "../redux/slice/cartSlice";
import { createOrder } from "../redux/slice/orderSlice";
import { useNavigate } from "react-router-dom";
import { processJazzCashPayment } from "../redux/slice/paymentSlice";
import toast from "react-hot-toast";
import { checkCheckoutFormData } from "../utils/checkCheckoutFormData";

const BACKEND_URL = import.meta.env.VITE_API_URL || "";

// Updated local payment methods for Pakistan (JazzCash & EasyPaisa)
const paymentMethods = [
  { id: "jazzcash", title: "JazzCash Mobile Account" },
  { id: "easypaisa", title: "EasyPaisa Mobile Account" },
  { id: "bank", title: "Bank Transfer" },
];

const Checkout = () => {
  const { productsInCart, subtotal } = useAppSelector((state: any) => state.cart || {});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State to track Payment Mode (Cash On Delivery vs Online Payment)
  const [paymentOption, setPaymentOption] = useState<"cod" | "online">("cod");

  // Helper function for absolute Image URL resolution
  const getImageUrl = (rawImgPath: string) => {
    if (!rawImgPath) return "";
    return rawImgPath.startsWith("http") ? rawImgPath : `${BACKEND_URL}${rawImgPath}`;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const checkoutData = {
      data,
      products: productsInCart,
      subtotal: subtotal,
    };

    if (!checkCheckoutFormData(checkoutData)) return;

    // User session recovery
    let storedUser: any = {};
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      storedUser = {};
    }

    const userId = String(
      storedUser.id || storedUser.Id || storedUser.userId || storedUser.UserId || "0"
    );
    const userEmail = (data.emailAddress as string) || storedUser.email || "";

    // Map cart items according to CreateOrderItemDto
    const orderItems = (productsInCart || []).map((item: any) => ({
      productId: Number(item.productId || item.id || item.Id) || 0,
      title: item.title || item.Name || "",
      imageUrl: getImageUrl(item.image || item.imageUrl || item.ImageUrl || ""),
      price: Number(item.price || item.Price) || 0,
      quantity: Number(item.quantity || item.Quantity) || 1,
      size: item.size || "",
      color: item.color || "",
    }));

    // Calculate billing amounts
    const shippingCost = subtotal ? 5 : 0;
    const tax = subtotal ? subtotal / 5 : 0;
    const totalAmount = subtotal ? subtotal + shippingCost + tax : 0;

    // Determine payment details dynamically based on selected Option
    const isCod = paymentOption === "cod";
    const selectedPaymentMethod = isCod
      ? "CashOnDelivery"
      : (data.paymentType as string) || "JazzCash";
    
    const paymentStatus = isCod ? "Pending" : "Completed";
    const transactionId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    const stripeToken = isCod ? "COD_PARCEL" : ((data.mobileNumber as string) || "ONLINE_PAID");

    // Payload formatted specifically for CreateOrderDto
    const orderPayload = {
      userId: userId,
      email: userEmail,
      firstName: (data.firstName as string) || "",
      lastName: (data.lastName as string) || "",
      address: (data.address as string) || "",
      city: (data.city as string) || "",
      country: (data.country as string) || "Pakistan",
      postalCode: (data.postalCode as string) || "",
      phone: (data.phone as string) || "",
      paymentMethod: selectedPaymentMethod,
      paymentStatus: paymentStatus,
      transactionId: transactionId,
      stripeToken: stripeToken,
      subTotal: subtotal,
      shippingCost: shippingCost,
      tax: tax,
      totalAmount: totalAmount,
      orderItems: orderItems,
    };

    try {
      // Agar online payment (JazzCash/EasyPaisa) select ki hai toh payment action dispatch karein
      if (!isCod) {
        dispatch(
          processJazzCashPayment({
            mobileNumber: data.mobileNumber as string,
            amount: totalAmount,
          })
        );
      }

      // Redux-Saga action dispatching via createOrder
      dispatch(createOrder(orderPayload));

      // Store order summary for confirmation view & redirect
      localStorage.setItem("lastOrder", JSON.stringify(orderPayload));
      toast.success("Order has been placed successfully");
      navigate("/order-confirmation");
    } catch (error: any) {
      console.error("Order submit error:", error);
      toast.error("Payment or Order creation failed");
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white mx-auto max-w-screen-2xl">
      <div className="pb-24 pt-12 px-5 max-[400px]:px-3">
        <h1 className="text-3xl font-serif tracking-wide text-white mb-8 border-b border-white/10 pb-4">
          Checkout
        </h1>

        <form
          onSubmit={handleCheckoutSubmit}
          className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16"
        >
          {/* Left Panel: Contact & Shipping Form */}
          <div className="lg:col-span-7">
            <div>
              <h2 className="text-xl font-serif text-white tracking-wide border-b border-white/10 pb-3">
                Contact Information
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                >
                  Email Address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    id="email-address"
                    name="emailAddress"
                    autoComplete="email"
                    className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                    required={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <h2 className="text-xl font-serif text-white tracking-wide border-b border-white/10 pb-3">
                Shipping Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="first-name"
                      name="firstName"
                      autoComplete="given-name"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="last-name"
                      name="lastName"
                      autoComplete="family-name"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    Company (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    Street Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="apartment"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="apartment"
                      id="apartment"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    Country
                  </label>
                  <div className="mt-2">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm cursor-pointer [&>option]:bg-[#141414] [&>option]:text-white"
                      required={true}
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postal-code"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    Postal Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="postalCode"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                      required={true}
                    />
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="paymentOption"
                    className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                  >
                    Payment Preference
                  </label>
                  <div className="mt-2">
                    <select
                      id="paymentOption"
                      name="paymentOption"
                      value={paymentOption}
                      onChange={(e) =>
                        setPaymentOption(e.target.value as "cod" | "online")
                      }
                      className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm cursor-pointer [&>option]:bg-[#141414] [&>option]:text-white"
                    >
                      <option value="cod">Cash on Delivery (Pay when parcel arrives)</option>
                      <option value="online">Pay Online (JazzCash / EasyPaisa / Bank)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Payment Method Choices */}
            {paymentOption === "online" && (
              <div className="mt-10 border-t border-white/10 pt-8 transition-all duration-300">
                <h2 className="text-xl font-serif text-white tracking-wide mb-4">
                  Online Payment Gateway
                </h2>

                <fieldset className="mt-4">
                  <legend className="sr-only">Payment type</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-x-8 sm:space-y-0">
                    {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                      <div key={paymentMethod.id} className="flex items-center">
                        <input
                          id={paymentMethod.id}
                          name="paymentType"
                          type="radio"
                          value={paymentMethod.title}
                          defaultChecked={paymentMethodIdx === 0}
                          className="h-4 w-4 border-white/20 bg-[#141414] text-amber-500 focus:ring-amber-500 focus:ring-offset-black"
                        />
                        <label
                          htmlFor={paymentMethod.id}
                          className="ml-3 block text-sm font-medium text-neutral-300"
                        >
                          {paymentMethod.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                  <div className="col-span-4">
                    <label
                      htmlFor="mobile-number"
                      className="block text-xs font-semibold uppercase tracking-widest text-neutral-400"
                    >
                      Mobile Account Number
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="mobile-number"
                        name="mobileNumber"
                        placeholder="03001234567"
                        className="block w-full bg-[#141414] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-colors text-sm"
                        required={paymentOption === "online"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Order Summary */}
          <div className="mt-10 lg:mt-0 lg:col-span-5">
            <h2 className="text-xl font-serif text-white tracking-wide mb-6">Order Summary</h2>

            <div className="border border-white/10 bg-[#121212] rounded-2xl shadow-2xl p-6">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-white/10">
                {productsInCart.map((product: any) => {
                  const prodId = product?.id || product?.Id;
                  const rawImg =
                    product?.image ||
                    product?.imageUrl ||
                    product?.ImageUrl ||
                    "";
                  const resolvedImg = getImageUrl(rawImg);

                  return (
                    <li key={prodId} className="flex py-5 sm:py-6">
                      <div className="flex-shrink-0">
                        <img
                          src={resolvedImg}
                          alt={product?.title}
                          className="w-20 h-20 object-cover rounded-xl border border-white/10 bg-[#141414]"
                        />
                      </div>

                      <div className="ml-5 flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-serif text-white font-medium hover:text-amber-400 transition-colors">
                              {product?.title}
                            </h4>
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-400">
                              {product?.color && (
                                <span className="uppercase px-2 py-0.5 rounded bg-[#1c1c1c] border border-white/10">
                                  {product.color}
                                </span>
                              )}
                              {product?.size && (
                                <span className="uppercase px-2 py-0.5 rounded bg-[#1c1c1c] border border-white/10">
                                  {product.size}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-white/5 rounded-full transition-colors"
                              onClick={() =>
                                dispatch(
                                  removeProductFromTheCart({ id: prodId })
                                )
                              }
                            >
                              <span className="sr-only">Remove</span>
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-1 items-end justify-between pt-3">
                          <p className="text-sm font-bold text-amber-400">
                            ${product?.price}
                          </p>

                          <p className="text-xs text-neutral-400 uppercase tracking-widest">
                            Qty: <span className="text-white font-semibold">{product?.quantity}</span>
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <dl className="space-y-4 border-t border-white/10 pt-6 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">Subtotal</dt>
                  <dd className="font-semibold text-white">
                    ${subtotal}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">Shipping</dt>
                  <dd className="font-semibold text-white">
                    ${subtotal ? 5 : 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">Taxes</dt>
                  <dd className="font-semibold text-white">
                    ${subtotal ? (subtotal / 5).toFixed(2) : 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <dt className="text-base font-medium text-white">Total</dt>
                  <dd className="text-xl font-bold text-amber-400">
                    ${subtotal ? (subtotal + 5 + subtotal / 5).toFixed(2) : 0}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 border-t border-white/10 pt-6">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-[0.99]"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;