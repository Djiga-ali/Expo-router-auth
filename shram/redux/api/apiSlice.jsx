import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // optional
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.1.98:8000" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
