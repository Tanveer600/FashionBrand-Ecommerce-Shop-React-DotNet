import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import orderService from '../services/orderService' // Apne order service ka path yahan adjust kar lein
import {
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
} from '../slice/orderSlice' // Apne order slice ka path yahan adjust kar lein
import toast from 'react-hot-toast'

// ================= WORKER SAGAS =================

function* getOrdersSaga(): Generator<any, void, any> {
  try {
    const data = yield call(orderService.getAllList)
    yield put(setAllOrders(data))
  } catch (e) {
    yield put(setAllOrders([]))
  }
}

function* fetchOrderByIdSaga(action: any): Generator<any, void, any> {
  try {
    const orderId = action.payload.id || action.payload
    const res: any = yield call(orderService.getById, orderId)
    const responseData = res?.Data ?? res?.data ?? res
    if ((res?.Success ?? res?.success) || responseData) {
      yield put(setSelectedOrder(responseData))
    }
  } catch (e) {
    yield put(setIsLoading(false))
  }
}

function* createOrderSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(orderService.create, action.payload)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      const newOrder = res?.Data ?? res?.data ?? action.payload
      yield put(createOrderCompleted(newOrder))
      toast.success(res?.Message || res?.message || "Order placed successfully")
      yield put(getAllOrders())
    } else {
      toast.error(res?.Message || res?.message || "Order creation failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* updateOrderSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(orderService.update, action.payload)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      const updatedOrder = res?.Data ?? res?.data ?? action.payload
      yield put(updateOrderCompleted(updatedOrder))
      yield put(setSelectedOrder(updatedOrder))
      toast.success(res?.Message || res?.message || "Order updated successfully")
      yield put(getAllOrders())
    } else {
      toast.error(res?.Message || res?.message || "Order update failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* deleteOrderSaga(action: any): Generator<any, void, any> {
  try {
    const orderId = action.payload.id || action.payload
    const res: any = yield call(orderService.delete, orderId)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      yield put(deleteOrderCompleted(orderId))
      toast.success(res?.Message || res?.message || "Order deleted successfully")
      yield put(getAllOrders())
    } else {
      toast.error(res?.Message || res?.message || "Order deletion failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* getPagedOrdersSaga(action: any): Generator<any, void, any> {
  try {
    const { pageNumber = 1, pageSize = 10 } = action.payload || {}
    const data = yield call(orderService.getPaged, pageNumber, pageSize)
    yield put(setPagedOrders(data))
  } catch (e) {
    yield put(setPagedOrders(null))
  }
}

function* searchOrdersSaga(action: any): Generator<any, void, any> {
  try {
    const { name, take = 10 } = action.payload || {}
    const data = yield call(orderService.search, name, take)
    yield put(setSearchedOrders(data))
  } catch (e) {
    yield put(setSearchedOrders([]))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetOrders() {
  yield takeLatest(getAllOrders.type, getOrdersSaga)
}
function* watchGetOrderById() {
  yield takeLatest(getOrderById.type, fetchOrderByIdSaga)
}
function* watchCreateOrder() {
  yield takeLatest(createOrder.type, createOrderSaga)
}
function* watchUpdateOrder() {
  yield takeLatest(updateOrder.type, updateOrderSaga)
}
function* watchDeleteOrder() {
  yield takeLatest(deleteOrder.type, deleteOrderSaga)
}
function* watchGetPagedOrders() {
  yield takeLatest(getPagedOrders.type, getPagedOrdersSaga)
}
function* watchSearchOrders() {
  yield takeLatest(searchOrders.type, searchOrdersSaga)
}

// ================= ROOT ORDER SAGA =================

export function* orderSaga(): Generator<any, void, any> {
  yield all([
    fork(watchGetOrders),
    fork(watchGetOrderById),
    fork(watchCreateOrder),
    fork(watchUpdateOrder),
    fork(watchDeleteOrder),
    fork(watchGetPagedOrders),
    fork(watchSearchOrders),
  ])
}