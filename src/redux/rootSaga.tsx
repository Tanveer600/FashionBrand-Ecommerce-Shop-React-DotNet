import { all, fork } from 'redux-saga/effects'
import {userSaga} from './saga/userSaga'  
import { categorySaga } from './saga/categorySaga'
import { productSaga } from './saga/productSaga'
import { orderSaga } from './saga/orderSaga'
export default function* rootSaga() {
  yield all([
    
    fork(userSaga),
    fork(categorySaga),
    fork(productSaga),
    fork(orderSaga),
  
  ])
}
