import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  result: [] as any[],
  selectedProduct: null,
  pagedProducts: null as any,
  searchedProducts: [] as any[],
  totalProducts: 0,
  showingProducts: 0,
  isLoading: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getAllProducts: (state) => {
      state.isLoading = true
      state.error = null
    },
    setAllProducts: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    
    getProductById: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
      state.isLoading = false
    },

    createProduct: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    createProductCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },

    updateProduct: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    updateProductCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id || x.Id === action.payload.Id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },

    deleteProduct: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    deleteProductCompleted: (state, action) => {
      const productId = action.payload.id || action.payload
      state.result = state.result.filter((x) => x.id !== productId && x.Id !== productId)
      state.isLoading = false
    },

    getPagedProducts: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setPagedProducts: (state, action) => {
      state.pagedProducts = action.payload
      state.isLoading = false
    },

    searchProducts: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setSearchedProducts: (state, action) => {
      state.searchedProducts = action.payload || []
      state.isLoading = false
    },

    setTotalProducts: (state, action: PayloadAction<number>) => {
      state.totalProducts = action.payload
    },
    setShowingProducts: (state, action: PayloadAction<number>) => {
      state.showingProducts = action.payload
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    resetProductError: (state) => {
      state.error = null
    },
  },
})

export const {
  getAllProducts,
  setAllProducts,
  getProductById,
  setSelectedProduct,
  createProduct,
  createProductCompleted,
  updateProduct,
  updateProductCompleted,
  deleteProduct,
  deleteProductCompleted,
  getPagedProducts,
  setPagedProducts,
  searchProducts,
  setSearchedProducts,
  setTotalProducts,
  setShowingProducts,
  setIsLoading,
  resetProductError,
} = productSlice.actions

export default productSlice.reducer