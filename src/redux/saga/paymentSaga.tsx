import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import paymentService from '../services/paymentService'
import {
  processJazzCashPayment,
  processJazzCashPaymentCompleted,
  processJazzCashPaymentFailed,
} from '../slice/paymentSlice' // Apne payment slice ka path yahan adjust kar lein
import toast from 'react-hot-toast'

// ================= WORKER SAGA =================

function* processJazzCashPaymentSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(paymentService.processJazzCashPayment, action.payload)
    const isSuccess = res?.Success ?? res?.success ?? res?.data?.success ?? true

    if (isSuccess) {
      const paymentData = res?.Data ?? res?.data ?? res
      yield put(processJazzCashPaymentCompleted(paymentData))
      toast.success(res?.Message || res?.message || "JazzCash Payment Processed Successfully")
    } else {
      const errorMsg = res?.Message || res?.message || "Payment Processing Failed"
      yield put(processJazzCashPaymentFailed(errorMsg))
      toast.error(errorMsg)
    }
  } catch (e: any) {
    const errorMsg = e.response?.data?.Message || e.response?.data?.message || e.message || "Something went wrong during payment"
    yield put(processJazzCashPaymentFailed(errorMsg))
    toast.error(errorMsg)
  }
}

// ================= WATCHER SAGA =================

function* watchProcessJazzCashPayment() {
  yield takeLatest(processJazzCashPayment.type, processJazzCashPaymentSaga)
}

// ================= ROOT PAYMENT SAGA =================

export function* paymentSaga(): Generator<any, void, any> {
  yield all([
    fork(watchProcessJazzCashPayment),
  ])
}