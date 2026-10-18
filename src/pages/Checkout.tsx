import { useState } from "react";
import { HiTrash as TrashIcon } from "react-icons/hi2";
import { Button } from "../components";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeProductFromTheCart } from "../redux/slice/cartSlice";
import { createOrder } from "../redux/slice/orderSlice";
import { useNavigate } from "react-router-dom";
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
      transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000),
      stripeToken: stripeToken,
      subTotal: subtotal,
      shippingCost: shippingCost,
      tax: tax,
      totalAmount: totalAmount,
      orderItems: orderItems,
    };

    try {
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
    <div className="mx-auto max-w-screen-2xl">
      <div className="pb-24 pt-16 px-5 max-[400px]:px-3">
        <h2 className="sr-only">Checkout</h2>

        <form
          onSubmit={handleCheckoutSubmit}
          className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
        >
          <div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Contact information
              </h2>

              <div className="mt-4">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    name="emailAddress"
                    autoComplete="email"
                    className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                    required={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      name="firstName"
                      autoComplete="given-name"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      name="lastName"
                      autoComplete="family-name"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="apartment"
                      id="apartment"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    >
                      <option>Pakistan</option>
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="postalCode"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                {/* Dropdown for Payment Preference right below Phone field */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="paymentOption"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Preference
                  </label>
                  <div className="mt-1">
                    <select
                      id="paymentOption"
                      name="paymentOption"
                      value={paymentOption}
                      onChange={(e) =>
                        setPaymentOption(e.target.value as "cod" | "online")
                      }
                      className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm bg-white"
                    >
                      <option value="cod">Cash on Delivery (Pay when parcel arrives)</option>
                      <option value="online">Pay Online (JazzCash / EasyPaisa / Bank)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Payment Section for JazzCash / EasyPaisa */}
            {paymentOption === "online" && (
              <div className="mt-10 border-t border-gray-200 pt-10 transition-all duration-300">
                <h2 className="text-lg font-medium text-gray-900">Online Payment Gateway</h2>

                <fieldset className="mt-4">
                  <legend className="sr-only">Payment type</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                      <div key={paymentMethod.id} className="flex items-center">
                        <input
                          id={paymentMethod.id}
                          name="paymentType"
                          type="radio"
                          value={paymentMethod.title}
                          defaultChecked={paymentMethodIdx === 0}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />

                        <label
                          htmlFor={paymentMethod.id}
                          className="ml-3 block text-sm font-medium text-gray-700"
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
                      className="block text-sm font-medium text-gray-700"
                    >
                      JazzCash / EasyPaisa Mobile Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="mobile-number"
                        name="mobileNumber"
                        placeholder="03001234567"
                        className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm"
                        required={paymentOption === "online"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {productsInCart.map((product: any) => {
                  const prodId = product?.id || product?.Id;
                  const rawImg =
                    product?.image ||
                    product?.imageUrl ||
                    product?.ImageUrl ||
                    "";
                  const resolvedImg = getImageUrl(rawImg);

                  return (
                    <li key={prodId} className="flex px-4 py-6 sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          src={resolvedImg}
                          alt={product?.title}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>

                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                              {product?.title}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {product?.color}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {product?.size}
                            </p>
                          </div>

                          <div className="ml-4 flow-root flex-shrink-0">
                            <button
                              type="button"
                              className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
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

                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            ${product?.price}
                          </p>

                          <div className="ml-4">
                            <p className="text-base">
                              Quantity: {product?.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${subtotal}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${subtotal ? 5 : 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Taxes</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${subtotal ? subtotal / 5 : 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    ${subtotal ? subtotal + 5 + subtotal / 5 : 0}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <Button text="Confirm Order" mode="brown" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;