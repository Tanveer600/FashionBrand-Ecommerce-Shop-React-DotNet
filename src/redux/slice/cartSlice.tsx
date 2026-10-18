import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartState = {
  productsInCart: any[];
  subtotal: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: CartState = {
  productsInCart: [],
  subtotal: 0,
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Backend se cart fetch karne ke liye (agar zaroorat ho)
    setCartData: (state, action: PayloadAction<any[]>) => {
      state.productsInCart = action.payload || [];
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    addProductToTheCart: (state, action: PayloadAction<any>) => {
      const product = state.productsInCart.find(
        (p) => p.id === action.payload.id || p.Id === action.payload.id
      );
      if (product) {
        state.productsInCart = state.productsInCart.map((p) => {
          if (p.id === action.payload.id || p.Id === action.payload.id) {
            return {
              ...p,
              quantity: (p.quantity || p.Quantity || 1) + (action.payload.quantity || 1),
            };
          }
          return p;
        });
      } else {
        state.productsInCart.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    removeProductFromTheCart: (
      state,
      action: PayloadAction<{ id: string | number }>
    ) => {
      state.productsInCart = state.productsInCart.filter(
        (product) => product.id !== action.payload.id && product.Id !== action.payload.id
      );
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    updateProductQuantity: (
      state,
      action: PayloadAction<{ id: string | number; quantity: number }>
    ) => {
      state.productsInCart = state.productsInCart.map((product) => {
        if (product.id === action.payload.id || product.Id === action.payload.id) {
          return {
            ...product,
            quantity: action.payload.quantity,
          };
        }
        return product;
      });
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    calculateTotalPrice: (state) => {
      state.subtotal = state.productsInCart.reduce(
        (acc, product) => {
          const price = product.price || product.Price || 0;
          const quantity = product.quantity || product.Quantity || 1;
          return acc + price * quantity;
        },
        0
      );
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetCartError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCartData,
  addProductToTheCart,
  removeProductFromTheCart,
  updateProductQuantity,
  calculateTotalPrice,
  setIsLoading,
  resetCartError,
} = cartSlice.actions;

export default cartSlice.reducer;