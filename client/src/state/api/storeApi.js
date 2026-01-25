import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/store`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getStoreData: builder.query({
      query: () => "/get-data",
    }),
    updateStore: builder.mutation({
      query: (body) => ({
        url: "/update-store",
        method: "PUT",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          storeApi.endpoints.getStoreData.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
  }),
});

export const { useGetStoreDataQuery, useUpdateStoreMutation } = storeApi;
