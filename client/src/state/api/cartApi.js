import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/cart`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    myCart: builder.query({
      query: () => "/my-cart",
    }),
    createCart: builder.mutation({
      query: (body) => ({
        url: "/add-to-cart",
        method: "POST",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled,
          await dispatch(
            cartApi.endpoints.myCart.initiate(undefined, { forceRefetch: true })
          );
      },
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/delete-product/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled,
          await dispatch(
            cartApi.endpoints.myCart.initiate(undefined, { forceRefetch: true })
          );
      },
    }),
  }),
});

export const {
  useCreateCartMutation,
  useMyCartQuery,
  useDeleteProductMutation,
} = cartApi;
