import {
  HiCheck as CheckIcon,
  HiXMark as XMarkIcon,
  HiQuestionMarkCircle as QuestionMarkCircleIcon,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link } from "react-router-dom";
import { updateProductQuantity, removeProductFromTheCart } from "../redux/slice/cartSlice"; 
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_API_URL || "";

const Cart = () => {
  const { productsInCart, subtotal } = useAppSelector((state: any) => state.cart);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white mx-auto max-w-screen-2xl px-5 max-[400px]:px-3">
      <div className="pb-24 pt-12">
        <h1 className="text-3xl font-serif tracking-wide text-white sm:text-4xl border-b border-white/10 pb-6">
          Shopping Cart
        </h1>

        {productsInCart.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <p className="text-neutral-400 text-lg">Your cart is currently empty.</p>
            <Link
              to="/shop"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <form className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16" onSubmit={(e) => e.preventDefault()}>
            {/* Cart Items List */}
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul
                role="list"
                className="divide-y divide-white/10 border-b border-t border-white/10"
              >
                {productsInCart.map((product: any) => {
                  const prodId = product.id || product.Id;
                  const rawImg = product.image || product.imageUrl || product.ImageUrl || "";
                  const finalImg = rawImg.startsWith("http") ? rawImg : `${BACKEND_URL}${rawImg}`;

                  return (
                    <li key={prodId} className="flex py-6 sm:py-8">
                      {/* Product Thumbnail */}
                      <div className="flex-shrink-0 overflow-hidden rounded-xl bg-[#141414] border border-white/10">
                        <img
                          src={finalImg}
                          alt={product.title}
                          className="h-28 w-28 object-cover object-center sm:h-36 sm:w-36"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-base font-serif">
                                <Link
                                  to={`/product/${product.productId || prodId}`}
                                  className="font-medium text-white hover:text-amber-400 transition-colors"
                                >
                                  {product.title}
                                </Link>
                              </h3>
                            </div>
                            
                            {/* Color & Size Variant Chips */}
                            <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                              {product.color && (
                                <span className="uppercase px-2.5 py-1 rounded-md bg-[#161616] border border-white/10">
                                  {product.color}
                                </span>
                              )}
                              {product.size && (
                                <span className="uppercase px-2.5 py-1 rounded-md bg-[#161616] border border-white/10">
                                  {product.size}
                                </span>
                              )}
                            </div>

                            <p className="mt-3 text-base font-bold text-amber-400">
                              ${product.price}
                            </p>
                          </div>

                          {/* Quantity & Delete */}
                          <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center gap-3">
                            <label htmlFor={`quantity-${prodId}`} className="text-xs tracking-wider uppercase text-neutral-400">
                              Qty:
                            </label>
                            
                            {/* Custom Styled Quantity Input */}
                            <div className="flex items-center bg-[#141414] border border-white/10 rounded-lg overflow-hidden">
                              <input
                                type="number"
                                id={`quantity-${prodId}`}
                                min="1"
                                className="w-16 h-8 text-center bg-transparent text-white font-semibold text-sm focus:outline-none"
                                value={product?.quantity}
                                onChange={(e) => {
                                  dispatch(
                                    updateProductQuantity({
                                      id: prodId,
                                      quantity: parseInt(e.target.value) || 1,
                                    })
                                  );
                                }}
                              />
                            </div>

                            {/* Remove Item Button */}
                            <div className="absolute right-0 top-0 sm:relative sm:right-auto sm:top-auto sm:ml-auto">
                              <button
                                type="button"
                                className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-white/5 rounded-full transition-colors"
                                onClick={() => {
                                  dispatch(
                                    removeProductFromTheCart({ id: prodId })
                                  );
                                  toast.error("Product removed from the cart");
                                }}
                              >
                                <span className="sr-only">Remove</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* In Stock / Out of Stock Indicator */}
                        <p className="mt-4 flex items-center space-x-1.5 text-xs">
                          {product?.stock !== false ? (
                            <>
                              <CheckIcon className="h-4 w-4 flex-shrink-0 text-emerald-400" aria-hidden="true" />
                              <span className="text-emerald-400 font-medium">In stock</span>
                            </>
                          ) : (
                            <>
                              <XMarkIcon className="h-4 w-4 flex-shrink-0 text-rose-500" aria-hidden="true" />
                              <span className="text-rose-500 font-medium">Out of stock</span>
                            </>
                          )}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Order Summary Panel */}
            <section
              aria-labelledby="summary-heading"
              className="mt-12 bg-[#121212] border border-white/10 rounded-2xl px-6 py-8 sm:p-8 lg:col-span-5 lg:mt-0 shadow-2xl"
            >
              <h2
                id="summary-heading"
                className="text-xl font-serif text-white border-b border-white/10 pb-4"
              >
                Order Summary
              </h2>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">Subtotal</dt>
                  <dd className="font-semibold text-white">${subtotal}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <dt className="flex items-center text-neutral-400">
                    <span>Shipping estimate</span>
                    <a href="#" className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors">
                      <span className="sr-only">Learn more about shipping</span>
                      <QuestionMarkCircleIcon className="h-4 w-4 text-amber-500" aria-hidden="true" />
                    </a>
                  </dt>
                  <dd className="font-semibold text-white">
                    ${subtotal === 0 ? 0 : 5.0}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <dt className="flex items-center text-neutral-400">
                    <span>Tax estimate</span>
                    <a href="#" className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors">
                      <span className="sr-only">Learn more about tax</span>
                      <QuestionMarkCircleIcon className="h-4 w-4 text-amber-500" aria-hidden="true" />
                    </a>
                  </dt>
                  <dd className="font-semibold text-white">
                    ${(subtotal / 5).toFixed(2)}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base">
                  <dt className="font-medium text-white">Order total</dt>
                  <dd className="font-bold text-amber-400 text-xl">
                    ${subtotal === 0 ? 0 : (subtotal + subtotal / 5 + 5).toFixed(2)}
                  </dd>
                </div>
              </dl>

              {productsInCart.length > 0 && (
                <div className="mt-8">
                  <Link
                    to="/checkout"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-[0.99]"
                  >
                    Proceed To Checkout
                  </Link>
                </div>
              )}
            </section>
          </form>
        )}
      </div>
    </div>
  );
};

export default Cart;