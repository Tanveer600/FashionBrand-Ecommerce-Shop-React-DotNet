import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [] as any[],
  selectedCategory: null,
  pagedCategories: null as any,
  searchedCategories: [] as any[],
  isLoading: false,
  error: null,
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    getAllCategories: (state) => {
      state.isLoading = true
      state.error = null
    },
    setAllCategories: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    
    getCategoryById: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
      state.isLoading = false
    },

    createCategory: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    createCategoryCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },

    updateCategory: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    updateCategoryCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id || x.Id === action.payload.Id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },

    deleteCategory: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    deleteCategoryCompleted: (state, action) => {
      const categoryId = action.payload.id || action.payload
      state.result = state.result.filter((x) => x.id !== categoryId && x.Id !== categoryId)
      state.isLoading = false
    },

    getPagedCategories: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setPagedCategories: (state, action) => {
      state.pagedCategories = action.payload
      state.isLoading = false
    },

    searchCategories: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    setSearchedCategories: (state, action) => {
      state.searchedCategories = action.payload || []
      state.isLoading = false
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    resetCategoryError: (state) => {
      state.error = null
    },
  },
})

export const {
  getAllCategories,
  setAllCategories,
  getCategoryById,
  setSelectedCategory,
  createCategory,
  createCategoryCompleted,
  updateCategory,
  updateCategoryCompleted,
  deleteCategory,
  deleteCategoryCompleted,
  getPagedCategories,
  setPagedCategories,
  searchCategories,
  setSearchedCategories,
  setIsLoading,
  resetCategoryError,
} = categorySlice.actions

export default categorySlice.reducer