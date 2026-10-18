import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [] as any[], // Yahan `as any[]` add kar dein
  currentUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  selectedUser: null,
  isLoading: false,
  error: null,
  passwordResetStatus: {
    forgotEmailSent: false, // Kya link email ho gaya?
    resetSuccessful: false, // Kya naya password lag gaya?
    changeSuccessful: false, // Kya purana password update ho gaya?
  },
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    loginRequest: (state,action) => {
      state.isLoading = true
      state.error = null // Naya login shuru hote hi purana error saaf
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.currentUser = action.payload;
      state.error = null
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload // Yahan error message save hota hai
    },
    resetError: (state) => {
      state.error = null
    },
    loginUser: (state, action) => {
      state.isLoading = true
    },
 
    getAllUsers: (state) => {
      state.isLoading = true
    },
    createUser: (state) => {
      state.isLoading = true
    },
    updateUser: (state) => {
      state.isLoading = true
    },
    deleteUser: (state) => {
      state.isLoading = true
    },
  setUser: (state, action) => {
  state.isLoading = true
  state.selectedUser = action.payload // Agar selected user set karna hai
},
    logout: (state) => {
      state.currentUser = null
      state.error = null
      state.isLoading = false
    },
    setAllUsers: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    createUserCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateUserCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteUserCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    forgotPasswordRequest: (state) => {
      state.isLoading = true
      state.error = null
      state.passwordResetStatus.forgotEmailSent = false // Naya request shuru
    },
    forgotPasswordSuccess: (state) => {
      state.isLoading = false
      state.error = null
      state.passwordResetStatus.forgotEmailSent = true // Confirm mail chali gayi
    },
    forgotPasswordFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload // Back-end error message
      state.passwordResetStatus.forgotEmailSent = false
    },

    // 2. Reset Password (Step 2: Naya password set karna)
    resetPasswordRequest: (state) => {
      state.isLoading = true
      state.error = null
      state.passwordResetStatus.resetSuccessful = false
    },
    resetPasswordSuccess: (state) => {
      state.isLoading = false
      state.error = null
      state.passwordResetStatus.resetSuccessful = true // Naya password set ho gaya
    },
    resetPasswordFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
      state.passwordResetStatus.resetSuccessful = false
    },

    // 3. Change Password (Jab login ho aur profile se change karein)
    changePasswordRequest: (state) => {
      state.isLoading = true
      state.error = null
      state.passwordResetStatus.changeSuccessful = false
    },
    changePasswordSuccess: (state) => {
      state.isLoading = false
      state.error = null
      state.passwordResetStatus.changeSuccessful = true // Purana password badal gaya
    },
    changePasswordFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
      state.passwordResetStatus.changeSuccessful = false
    },
signupRequest: (state, action) => {
      state.isLoading = true
      state.error = null
    },
    signupSuccess: (state, action) => {
      state.isLoading = false
      state.currentUser = action.payload
      state.error = null
    },
    signupFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    clearPasswordStatus: (state) => {
      state.passwordResetStatus = {
        forgotEmailSent: false,
        resetSuccessful: false,
        changeSuccessful: false,
      }
      state.error = null
    },
  },
})

export const {
  signupRequest,
  signupSuccess,
  signupFailure,
  getAllUsers,
  setAllUsers,
  setSelectedUser,
  loginRequest,
  loginFailure,
  resetError,
  loginSuccess,
  createUser,
  updateUser,
  setUser,
  deleteUser,
  createUserCompleted,
  updateUserCompleted,
  deleteUserCompleted,
  setIsLoading,
  loginUser,
  logout,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  clearPasswordStatus,
} = userSlice.actions

export default userSlice.reducer