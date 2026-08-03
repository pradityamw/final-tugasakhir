import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cartApi } from "./cartApi";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/order`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
    }),
    cartOrder: builder.mutation({
      query: (body) => ({
        url: "/create-from-cart",
        method: "POST",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(
            cartApi.endpoints.myCart.initiate(undefined, { forceRefetch: true })
          );
        } catch (e) {}
      },
    }),
    getMyOrder: builder.mutation({
      query: () => "/my-order",
      method: "GET",
    }),
    getOrders: builder.query({
      query: () => "/get-orders",
    }),
    inputResi: builder.mutation({
      query: ({ id, body }) => ({
        url: `/input-resi/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          orderApi.endpoints.getOrders.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useCartOrderMutation,
  useGetMyOrderMutation,
  useGetOrdersQuery,
  useInputResiMutation,
} = orderApi;
