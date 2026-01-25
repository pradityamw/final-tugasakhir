import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/chat`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getChatHistory: builder.query({
      query: (username) => `/history/${username}`,
    }),
  }),
});

export const { useGetChatHistoryQuery } = chatApi;
