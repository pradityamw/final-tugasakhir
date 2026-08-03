import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/products`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/show-products",
      providesTags: ["Products"],
    }),
    getProduct: builder.query({
      query: (name) => `${name}`,
      providesTags: (result, error, name) => [{ type: "Product", id: name }, "Products"],
    }),
    giveReview: builder.mutation({
      query: ({ id, body }) => ({
        url: `/give-review/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    deleteProducts: builder.mutation({
      query: (id) => ({
        url: `/delete-all`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    addProduct: builder.mutation({
      query: (body) => ({
        url: `/add-product`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    editProduct: builder.mutation({
      query: ({ body, id }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    uploadProducts: builder.mutation({
      query: (body) => ({
        url: "/upload-products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products", "Product"],
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
