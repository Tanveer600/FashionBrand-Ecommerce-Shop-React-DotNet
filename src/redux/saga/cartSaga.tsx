import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import cartService from '../services/cartService' // Apne cart service ka path adjust kar lein
import {
  addProductToTheCart,
  removeProductFromTheCart,
  updateProductQuantity,
  setIsLoading,
} from '../slice/cartSlice' // Apne cart slice ka path adjust kar lein
import toast from 'react-hot-toast'

// ================= WORKER SAGAS =================

function* addProductToTheCartSaga(action: any): Generator<any, void, any> {
  try {
    // Agar backend par cart item sync karni ho
    const res: any = yield call(cartService.addItem, action.payload)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (!isSuccess) {
      toast.error(res?.Message || res?.message || "Failed to sync cart with server")
    }
  } catch (e: any) {
    console.error("Cart sync error:", e)
  }
}

function* removeProductFromTheCartSaga(action: any): Generator<any, void, any> {
  try {
    const targetId = action.payload.id || action.payload
    // Agar backend se item delete karni ho
    yield call(cartService.removeItem, targetId)
  } catch (e: any) {
    console.error("Cart remove error:", e)
  }
}

function* updateProductQuantitySaga(action: any): Generator<any, void, any> {
  try {
    const { id, quantity } = action.payload || {}
    // Agar backend par quantity update karni ho
    yield call(cartService.updateQuantity, id, quantity)
  } catch (e: any) {
    console.error("Cart update quantity error:", e)
  }
}

// ================= WATCHER SAGAS =================

function* watchAddProduct() {
  yield takeLatest(addProductToTheCart.type, addProductToTheCartSaga)
}

function* watchRemoveProduct() {
  yield takeLatest(removeProductFromTheCart.type, removeProductFromTheCartSaga)
}

function* watchUpdateQuantity() {
  yield takeLatest(updateProductQuantity.type, updateProductQuantitySaga)
}

// ================= ROOT CART SAGA =================

export function* cartSaga(): Generator<any, void, any> {
  yield all([
    fork(watchAddProduct),
    fork(watchRemoveProduct),
    fork(watchUpdateQuantity),
  ])
}