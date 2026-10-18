
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './redux/rootSaga';
import userReducer from './redux/slice/userSlice';
import categoryReducer from './redux/slice/categorySlice';
import productReducer from './redux/slice/productSlice';
import cartReducer from "./features/cart/cartSlice";
import shopReducer from "./features/shop/shopSlice";
import authReducer from "./features/auth/authSlice";
// 1. Saga middleware initialize karein
const sagaMiddleware = createSagaMiddleware();

// 2. Store configure karein (cart, shop, auth filhal hata diye hain)
export const store = configureStore({
  reducer: {
    users: userReducer,
    categories: categoryReducer,
    products:productReducer,
    cart: cartReducer,
    shop: shopReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

// 3. Root saga run karein
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

