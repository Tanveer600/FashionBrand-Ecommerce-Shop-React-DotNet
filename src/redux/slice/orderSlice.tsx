import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [] as any[],
  selectedOrder: null,
  pagedOrders: null as any,
  searchedOrders: [] as any[],
  isLoading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    getAllOrders: (state) => {
      state.isLoading = true
      state.error = null
    },
    setAllOrders: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    
    getOrderById: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
      state.isLoading = false
    },

    createOrder: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    createOrderCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },

    updateOrder: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    updateOrderCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id || x.Id === action.payload.Id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },

    deleteOrder: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    deleteOrderCompleted: (state, action) => {
      const orderId = action.payload.id || action.payload
      state.result = state.result.filter((x) => x.id !== orderId && x.Id !== orderId)
      state.isLoading = false
    },

    getPagedOrders: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setPagedOrders: (state, action) => {
      state.pagedOrders = action.payload
      state.isLoading = false
    },

    searchOrders: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setSearchedOrders: (state, action) => {
      state.searchedOrders = action.payload || []
      state.isLoading = false
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    resetOrderError: (state) => {
      state.error = null
    },
  },
})

export const {
  getAllOrders,
  setAllOrders,
  getOrderById,
  setSelectedOrder,
  createOrder,
  createOrderCompleted,
  updateOrder,
  updateOrderCompleted,
  deleteOrder,
  deleteOrderCompleted,
  getPagedOrders,
  setPagedOrders,
  searchOrders,
  setSearchedOrders,
  setIsLoading,
  resetOrderError,
} = orderSlice.actions

export default orderSlice.reducer