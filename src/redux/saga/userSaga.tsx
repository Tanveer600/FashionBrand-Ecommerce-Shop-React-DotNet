import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects'
import userService from '../services/userService'
import {
  getAllUsers,
  setAllUsers,
  createUser,
  deleteUser,
  createUserCompleted,
  updateUser,
  updateUserCompleted,
  deleteUserCompleted,
  setIsLoading,
  signupRequest,
  signupSuccess,
  signupFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  setUser,
  setSelectedUser,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
} from '../slice/userSlice'
import toast from 'react-hot-toast'

// ================= WORKER SAGAS =================

function* getUsersSaga(): Generator<any, void, any> {
  try {
    const data = yield call(userService.getAll)
    yield put(setAllUsers(data))
  } catch (e) {
    yield put(setAllUsers([]))
  }
}

// Single User fetch karne ke liye (Profile page ke liye)
function* fetchUserByIdSaga(action: any): Generator<any, void, any> {
  try {
    const userId = action.payload.id
    const res: any = yield call(userService.getById, userId)
    const responseData = res?.Data ?? res?.data ?? res
    if ((res?.Success ?? res?.success) || responseData) {
      yield put(setSelectedUser(responseData))
    }
  } catch (e) {
    yield put(setIsLoading(false))
  }
}

function* createUserSaga(action: any): Generator<any, void, any> {
  try {
    const res = yield call(userService.create, action.payload)
    yield put(createUserCompleted(res))
    yield put(getAllUsers())
  } catch (e) {
    yield put(setIsLoading(false))
  }
}

function* signupSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(userService.signup, action.payload)
    if (res?.Success || res?.success) {
      const userData = res.Data || res.data
      yield put(signupSuccess(userData))
    } else {
      yield put(signupFailure(res?.Message || res?.message || 'Signup failed'))
    }
  } catch (e: any) {
    yield put(signupFailure(e.response?.data?.Message || e.response?.data?.message || e.message || 'Something went wrong'))
  }
}

function* updateUserSaga(action: any): Generator<any, void, any> {
  try {
    // action.payload poora object hai (e.g. { id, name, email, ... })
    const res: any = yield call(userService.update, action.payload)
    
    const isSuccess = res?.Success ?? res?.success ?? true
    if (isSuccess) {
      const updatedUser = res?.Data ?? res?.data ?? action.payload
      yield put(updateUserCompleted(updatedUser))
      yield put(setSelectedUser(updatedUser))
      toast.success("User updated successfully")
      yield put(getAllUsers()) // Table ya list refresh karne ke liye agar zaroorat ho
    } else {
      toast.error(res?.Message || res?.message || "User update failed")
      yield put(setIsLoading(false))
    }
  } catch (e: any) {
    toast.error(e.response?.data?.Message || e.response?.data?.message || "Something went wrong")
    yield put(setIsLoading(false))
  }
}

function* deleteUserSaga(action: any): Generator<any, void, any> {
  try {
    yield call(userService.delete, action.payload)
    yield put(deleteUserCompleted(action.payload))
    yield put(getAllUsers())
  } catch (e) {
    yield put(setIsLoading(false))
  }
}

function* loginSaga(action: any): Generator<any, void, any> {
  try {
    const { navigate, ...credentials } = action.payload
    const res: any = yield call(userService.login, credentials)
    yield delay(1000)

    const isSuccess = res?.Success ?? res?.success
    const responseData = res?.Data ?? res?.data

    if (isSuccess) {
      const token = responseData?.Token || responseData?.token
      if (token) {
        localStorage.setItem('token', token)
      }
      localStorage.setItem('user', JSON.stringify(responseData))
      
      yield put(loginSuccess(responseData))

      if (navigate) {
        navigate("/user-profile", { replace: true })
      }
    } else {
      yield put(loginFailure(res?.Message || res?.message || 'Invalid Email or Password'))
    }
  } catch (e: any) {
    yield put(loginFailure(e.response?.data?.Message || e.response?.data?.message || e.message || 'Something went wrong'))
  }
}

function* forgotPasswordSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(userService.forgotPassword, action.payload)
    if (res?.Success || res?.success) {
      yield put(forgotPasswordSuccess())
    } else {
      yield put(forgotPasswordFailure(res?.Message || res?.message || 'Email bhejny mein masla hua'))
    }
  } catch (e: any) {
    yield put(forgotPasswordFailure(e.response?.data?.Message || e.response?.data?.message || e.message))
  }
}

function* resetPasswordSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(userService.resetPassword, action.payload)
    if (res?.Success || res?.success) {
      yield put(resetPasswordSuccess())
    } else {
      yield put(resetPasswordFailure(res?.Message || res?.message || 'Password reset nahi ho saka'))
    }
  } catch (e: any) {
    yield put(resetPasswordFailure(e.response?.data?.Message || e.response?.data?.message || e.message))
  }
}

function* changePasswordSaga(action: any): Generator<any, void, any> {
  try {
    const res: any = yield call(userService.changePassword, action.payload)
    if (res?.Success || res?.success) {
      yield put(changePasswordSuccess())
    } else {
      yield put(changePasswordFailure(res?.Message || res?.message || 'Purana password galat hai'))
    }
  } catch (e: any) {
    yield put(changePasswordFailure(e.response?.data?.Message || e.response?.data?.message || e.message))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetUsers() {
  yield takeLatest(getAllUsers.type, getUsersSaga)
}
function* watchSetUser() {
  yield takeLatest(setUser.type, fetchUserByIdSaga)
}
function* watchCreateUser() {
  yield takeLatest(createUser.type, createUserSaga)
}
function* watchSignupUser() {
  yield takeLatest(signupRequest.type, signupSaga)
}
function* watchUpdateUser() {
  yield takeLatest(updateUser.type, updateUserSaga)
}
function* watchDeleteUser() {
  yield takeLatest(deleteUser.type, deleteUserSaga)
}
function* watchLoginUser() {
  yield takeLatest(loginRequest.type, loginSaga)
}
function* watchForgotPassword() {
  yield takeLatest(forgotPasswordRequest.type, forgotPasswordSaga)
}
function* watchResetPassword() {
  yield takeLatest(resetPasswordRequest.type, resetPasswordSaga)
}
function* watchChangePassword() {
  yield takeLatest(changePasswordRequest.type, changePasswordSaga)
}

// ================= ROOT USER SAGA =================

export function* userSaga(): Generator<any, void, any> {
  yield all([
    fork(watchGetUsers),
    fork(watchSetUser),
    fork(watchCreateUser),
    fork(watchSignupUser),
    fork(watchUpdateUser),
    fork(watchDeleteUser),
    fork(watchLoginUser),
    fork(watchForgotPassword),
    fork(watchResetPassword),
    fork(watchChangePassword),
  ])
}