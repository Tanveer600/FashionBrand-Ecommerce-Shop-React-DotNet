import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import productService from '../services/productService'
import {
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
  setIsLoading,
} from '../slice/productSlice' // Apne product slice ka path yahan adjust kar lein
import toast from 'react-hot-toast'

// ================= WORKER SAGAS =================

function* getProductsSaga(): Generator<any, void, any> {
  try {
    const data = yield call(productService.getAllList)
    yield put(setAllProducts(data))
  } catch (e) {
    yield put(setAllProducts([]))
  }
}

function* fetchProductByIdSaga(action: any): Generator<any, void, any> {
  try {
    const productId = action.payload.id || action.payload
    const res: any = yield call(productService.getById, productId)
    const responseData = res?.Data ?? res?.data ?? res
    if ((res?.Success ?? res?.success) || responseData) {
      yield put(setSelectedProduct(responseData))
    }
  } catch (e) {
    yield put(setIsLoading(false))
  }
}

function* createProductSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(productService.create, action.payload)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      const newProduct = res?.Data ?? res?.data ?? action.payload
      yield put(createProductCompleted(newProduct))
      toast.success(res?.Message || res?.message || "Product created successfully")
      yield put(getAllProducts())
    } else {
      toast.error(res?.Message || res?.message || "Product creation failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* updateProductSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(productService.update, action.payload)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      const updatedProduct = res?.Data ?? res?.data ?? action.payload
      yield put(updateProductCompleted(updatedProduct))
      yield put(setSelectedProduct(updatedProduct))
      toast.success(res?.Message || res?.message || "Product updated successfully")
      yield put(getAllProducts())
    } else {
      toast.error(res?.Message || res?.message || "Product update failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* deleteProductSaga(action: any): Generator<any, void, any> {
  try {
    const productId = action.payload.id || action.payload
    const res: any = yield call(productService.delete, productId)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      yield put(deleteProductCompleted(productId))
      toast.success(res?.Message || res?.message || "Product deleted successfully")
      yield put(getAllProducts())
    } else {
      toast.error(res?.Message || res?.message || "Product deletion failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* getPagedProductsSaga(action: any): Generator<any, void, any> {
  try {
    const { pageNumber = 1, pageSize = 10 } = action.payload || {}
    const data = yield call(productService.getPaged, pageNumber, pageSize)
    yield put(setPagedProducts(data))
  } catch (e) {
    yield put(setPagedProducts(null))
  }
}

function* searchProductsSaga(action: any): Generator<any, void, any> {
  try {
    const { name, take = 10 } = action.payload || {}
    const data = yield call(productService.search, name, take)
    yield put(setSearchedProducts(data))
  } catch (e) {
    yield put(setSearchedProducts([]))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetProducts() {
  yield takeLatest(getAllProducts.type, getProductsSaga)
}
function* watchGetProductById() {
  yield takeLatest(getProductById.type, fetchProductByIdSaga)
}
function* watchCreateProduct() {
  yield takeLatest(createProduct.type, createProductSaga)
}
function* watchUpdateProduct() {
  yield takeLatest(updateProduct.type, updateProductSaga)
}
function* watchDeleteProduct() {
  yield takeLatest(deleteProduct.type, deleteProductSaga)
}
function* watchGetPagedProducts() {
  yield takeLatest(getPagedProducts.type, getPagedProductsSaga)
}
function* watchSearchProducts() {
  yield takeLatest(searchProducts.type, searchProductsSaga)
}

// ================= ROOT PRODUCT SAGA =================

export function* productSaga(): Generator<any, void, any> {
  yield all([
    fork(watchGetProducts),
    fork(watchGetProductById),
    fork(watchCreateProduct),
    fork(watchUpdateProduct),
    fork(watchDeleteProduct),
    fork(watchGetPagedProducts),
    fork(watchSearchProducts),
  ])
}