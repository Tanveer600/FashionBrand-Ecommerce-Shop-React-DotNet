import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slice/userSlice'
import categoryReducer from './slice/categorySlice'
import productReducer from './slice/productSlice'
import orderReducer from './slice/orderSlice'
const rootReducer = combineReducers({
  users: userReducer,
categories:categoryReducer,
products:productReducer,
orders: orderReducer,


})

export default rootReducer
