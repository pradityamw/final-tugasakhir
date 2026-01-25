import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/products`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/show-products",
    }),
    getProduct: builder.query({
      query: (name) => `${name}`,
    }),
    giveReview: builder.mutation({
      query: ({ id, body }) => ({
        url: `/give-review/${id}`,
        method: "POST",
        body,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          productApi.endpoints.getProducts.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
    deleteProducts: builder.mutation({
      query: (id) => ({
        url: `/delete-all`,
        method: "DELETE",
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          productApi.endpoints.getProducts.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
    addProduct: builder.mutation({
      query: (body) => ({
        url: `/add-product`,
        method: "POST",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          productApi.endpoints.getProducts.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
    editProduct: builder.mutation({
      query: ({ body, id }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          productApi.endpoints.getProducts.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
    uploadProducts: builder.mutation({
      query: (body) => ({
        url: "/upload-products",
        method: "POST",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          productApi.endpoints.getProducts.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGiveReviewMutation,
  useDeleteProductMutation,
  useDeleteProductsMutation,
  useAddProductMutation,
  useUploadProductsMutation,
  useEditProductMutation,
} = productApi;
