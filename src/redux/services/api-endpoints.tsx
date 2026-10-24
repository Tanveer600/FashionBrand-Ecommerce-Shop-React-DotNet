export const API_ENDPOINTS = {
  USERS: {
    SIGNUP: '/api/user/signup',
    LOGIN: '/api/user/login',
    CREATE: '/api/user',                            // POST
    GET_ALL: '/api/user',                           // GET
    GET_BY_ID: (id: string | number) => `/api/user/${id}`,            // GET /api/user/1
    UPDATE: (id: string | number) => `/api/user/${id}`,               // PUT /api/user/1
    DELETE: (id: string | number) => `/api/user/${id}`,               // DELETE /api/user/1
    CHANGE_PASSWORD: '/api/user/change-password',
    FORGOT_PASSWORD: '/api/user/forgot-password',
    RESET_PASSWORD: '/api/user/reset-password',
    UPDATE_EMAIL: '/api/user/update-email',
    ACTIVATE: (id: string | number, isActive: boolean) => `/api/user/${id}/activate?isActive=${isActive}`, // PATCH
  },
  PAYMENTS: {
    PROCESS_JAZZCASH: '/api/payment/process-jazzcash', // POST
  },
  
  CART: {
    GET_CART: (userId: string | number) => `/api/cart/${userId}`,     // GET /api/cart/1
    ADD_ITEM: '/api/cart/add',                       // POST
    UPDATE_QUANTITY: (cartItemId: string | number, quantity: number | string) => `/api/cart/items/${cartItemId}/quantity?quantity=${quantity}`, // PUT
    REMOVE_ITEM: (cartItemId: string | number) => `/api/cart/items/${cartItemId}`, // DELETE /api/cart/items/1
    CLEAR_CART: (userId: string | number) => `/api/cart/clear/${userId}`          // DELETE /api/cart/clear/1
  },
  CATEGORIES: {
    CREATE: '/api/category',                                                    // POST[cite: 4]
    GET_ALL: '/api/category',                                                   // GET[cite: 4]
    GET_BY_ID: (id: string | number) => `/api/category/${id}`,                  // GET /api/category/1[cite: 4]
    GET_PAGED: (pageNumber: number = 1, pageSize: number = 10) => `/api/category/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`, // GET[cite: 4]
    SEARCH: (name?: string, take: number = 10) => `/api/category/search?name=${name || ''}&take=${take}`, // GET[cite: 4]
    UPDATE: (id: string | number) => `/api/category/${id}`,                     // PUT /api/category/1[cite: 4]
    DELETE: (id: string | number) => `/api/category/${id}`                      // DELETE /api/category/1[cite: 4]
  },
  PRODUCTS: {
    GET_ALL_LIST: '/api/product/all',                                                             // GET
    GET_PAGED: (pageNumber: number = 1, pageSize: number = 10) => `/api/product?pageNumber=${pageNumber}&pageSize=${pageSize}`, // GET
    GET_BY_ID: (id: string | number) => `/api/product/${id}`,                                    // GET /api/product/1
    SEARCH: (name?: string, take: number = 10) => `/api/product/search?name=${name || ''}&take=${take}`, // GET
    CREATE: '/api/product',                                                                       // POST
    UPDATE: (id: string | number) => `/api/product/${id}`,                                       // PUT /api/product/1
    DELETE: (id: string | number) => `/api/product/${id}`                                        // DELETE /api/product/1
  },
  ORDERS: {
    GET_ALL_LIST: '/api/order/all',                                                                  // GET /api/order/all
    GET_PAGED: (pageNumber: number = 1, pageSize: number = 10) => `/api/order?pageNumber=${pageNumber}&pageSize=${pageSize}`, // GET /api/order
    GET_BY_ID: (id: string | number) => `/api/order/${id}`,                                          // GET /api/order/1
    SEARCH: (name?: string, take: number = 10) => `/api/order/search?name=${name || ''}&take=${take}`, // GET /api/order/search
    CREATE: '/api/order',                                                                            // POST /api/order
    UPDATE: (id: string | number) => `/api/order/${id}`,                                             // PUT /api/order/1
    DELETE: (id: string | number) => `/api/order/${id}`                                              // DELETE /api/order/1
  }
};