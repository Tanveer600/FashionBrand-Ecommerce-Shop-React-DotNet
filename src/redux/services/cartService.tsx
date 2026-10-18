import apiClient from './axios-instance';
import { API_ENDPOINTS } from './api-endpoints';

const cartService = {
  // User ID ki base par cart get karne ke liye (/api/cart/{userId})
  getCartByUserId: async (userId: string | number) => {
    const res: any = await apiClient.get(API_ENDPOINTS.CART.GET_CART(userId));
    return res?.data?.data || res?.data;
  },

  // Cart mein item add karne ke liye (/api/cart/add)
  addItem: async (payload: { userId?: number; productId?: number; quantity?: number; [key: string]: any }) => {
    const res: any = await apiClient.post(API_ENDPOINTS.CART.ADD_ITEM, payload);
    return res?.data;
  },

  // Cart item ki quantity update karne ke liye (/api/cart/items/{cartItemId}/quantity?quantity={quantity})
  updateQuantity: async (cartItemId: string | number, quantity: number | string) => {
    const res: any = await apiClient.put(API_ENDPOINTS.CART.UPDATE_QUANTITY(cartItemId, quantity));
    return res?.data;
  },

  // Cart mein se specific item remove karne ke liye (/api/cart/items/{cartItemId})
  removeItem: async (cartItemId: string | number) => {
    const res: any = await apiClient.delete(API_ENDPOINTS.CART.REMOVE_ITEM(cartItemId));
    return res?.data;
  },

  // Poora cart clear karne ke liye (/api/cart/clear/{userId})
  clearCart: async (userId: string | number) => {
    const res: any = await apiClient.delete(API_ENDPOINTS.CART.CLEAR_CART(userId));
    return res?.data;
  },
};

export default cartService;