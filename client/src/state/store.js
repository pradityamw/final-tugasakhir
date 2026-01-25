import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/UserSlice";
import { productApi } from "./api/productApi";
import { shipmentApi } from "./api/shipmentApi";
import { paymentApi } from "./api/paymentApi";
import { orderApi } from "./api/orderApi";
import { cartApi } from "./api/cartApi";
import { userApi } from "./api/userApi";
import { storeApi } from "./api/storeApi";
import { chatApi } from "./api/chatApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [productApi.reducerPath]: productApi.reducer,
    [shipmentApi.reducerPath]: shipmentApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      shipmentApi.middleware,
      paymentApi.middleware,
      orderApi.middleware,
      cartApi.middleware,
      userApi.middleware,
      storeApi.middleware,
      chatApi.middleware,
    ]),
});

export default store;
