import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  paymentResult: null as any,
  isProcessingPayment: false,
  paymentError: null as string | null,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    processJazzCashPayment: (state, action: PayloadAction<any>) => {
      state.isProcessingPayment = true
      state.paymentError = null
    },
    processJazzCashPaymentCompleted: (state, action: PayloadAction<any>) => {
      state.paymentResult = action.payload
      state.isProcessingPayment = false
    },
    processJazzCashPaymentFailed: (state, action: PayloadAction<string>) => {
      state.paymentError = action.payload
      state.isProcessingPayment = false
    },
    resetPaymentState: (state) => {
      state.paymentResult = null
      state.isProcessingPayment = false
      state.paymentError = null
    },
  },
})

export const {
  processJazzCashPayment,
  processJazzCashPaymentCompleted,
  processJazzCashPaymentFailed,
  resetPaymentState,
} = paymentSlice.actions

export default paymentSlice.reducer