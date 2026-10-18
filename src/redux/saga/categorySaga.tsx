import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects'
import categoryService from '../services/categoryService'
import {
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
} from '../slice/categorySlice' // Apne category slice ka path yahan adjust kar lein
import toast from 'react-hot-toast'

// ================= WORKER SAGAS =================

function* getCategoriesSaga(): Generator<any, void, any> {
  try {
    const data = yield call(categoryService.getAll)
    yield put(setAllCategories(data))
  } catch (e) {
    yield put(setAllCategories([]))
  }
}

function* fetchCategoryByIdSaga(action: any): Generator<any, void, any> {
  try {
    const categoryId = action.payload.id || action.payload
    const res: any = yield call(categoryService.getById, categoryId)
    const responseData = res?.Data ?? res?.data ?? res
    if ((res?.Success ?? res?.success) || responseData) {
      yield put(setSelectedCategory(responseData))
    }
  } catch (e) {
    yield put(setIsLoading(false))
  }
}

function* createCategorySaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(categoryService.create, action.payload)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      const newCategory = res?.Data ?? res?.data ?? action.payload
      yield put(createCategoryCompleted(newCategory))
      toast.success(res?.Message || res?.message || "Category created successfully")
      yield put(getAllCategories())
    } else {
      toast.error(res?.Message || res?.message || "Category creation failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* updateCategorySaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(categoryService.update, action.payload)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      const updatedCategory = res?.Data ?? res?.data ?? action.payload
      yield put(updateCategoryCompleted(updatedCategory))
      yield put(setSelectedCategory(updatedCategory))
      toast.success(res?.Message || res?.message || "Category updated successfully")
      yield put(getAllCategories())
    } else {
      toast.error(res?.Message || res?.message || "Category update failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* deleteCategorySaga(action: any): Generator<any, void, any> {
  try {
    const categoryId = action.payload.id || action.payload
    const res: any = yield call(categoryService.delete, categoryId)
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      yield put(deleteCategoryCompleted(categoryId))
      toast.success(res?.Message || res?.message || "Category deleted successfully")
      yield put(getAllCategories())
    } else {
      toast.error(res?.Message || res?.message || "Category deletion failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* getPagedCategoriesSaga(action: any): Generator<any, void, any> {
  try {
    const { pageNumber = 1, pageSize = 10 } = action.payload || {}
    const data = yield call(categoryService.getPaged, pageNumber, pageSize)
    yield put(setPagedCategories(data))
  } catch (e) {
    yield put(setPagedCategories(null))
  }
}

function* searchCategoriesSaga(action: any): Generator<any, void, any> {
  try {
    const { name, take = 10 } = action.payload || {}
    const data = yield call(categoryService.search, name, take)
    yield put(setSearchedCategories(data))
  } catch (e) {
    yield put(setSearchedCategories([]))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetCategories() {
  yield takeLatest(getAllCategories.type, getCategoriesSaga)
}
function* watchGetCategoryById() {
  yield takeLatest(getCategoryById.type, fetchCategoryByIdSaga)
}
function* watchCreateCategory() {
  yield takeLatest(createCategory.type, createCategorySaga)
}
function* watchUpdateCategory() {
  yield takeLatest(updateCategory.type, updateCategorySaga)
}
function* watchDeleteCategory() {
  yield takeLatest(deleteCategory.type, deleteCategorySaga)
}
function* watchGetPagedCategories() {
  yield takeLatest(getPagedCategories.type, getPagedCategoriesSaga)
}
function* watchSearchCategories() {
  yield takeLatest(searchCategories.type, searchCategoriesSaga)
}

// ================= ROOT CATEGORY SAGA =================

export function* categorySaga(): Generator<any, void, any> {
  yield all([
    fork(watchGetCategories),
    fork(watchGetCategoryById),
    fork(watchCreateCategory),
    fork(watchUpdateCategory),
    fork(watchDeleteCategory),
    fork(watchGetPagedCategories),
    fork(watchSearchCategories),
  ])
} 