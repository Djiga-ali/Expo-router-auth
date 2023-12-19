import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getLogin } from "../features/authExtraSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.1.46:8000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
// https://redux-toolkit.js.org/rtk-query/api/createApi
// const baseQueryForRefresh = async (args, api, extraOptions) => {
//   console.log(args); // request url, method, body
//   console.log(api); // signal, dispatch, getState()
//   console.log(extraOptions); //custom like {shout: true}

//   let login = await baseQuery(args, api, extraOptions);

//   // If you want, handle other status codes, too
//   // L'erreur 403 Forbidden décrit un accès refusé, limité ou interdit à une ressource ou un contenu spécifique.
//   if (login?.error?.status === 403) {
//     // console.log("sending refresh token");

//     // send refresh token to get new access token
//     // https://redux-toolkit.js.org/rtk-query/api/createApi
//     const refresh = await baseQuery("/auth/refresh", api, extraOptions);

//     if (refresh?.data) {
//       // store the new token
//       api.dispatch(getLogin({ ...refresh.data }));

//       // retry original query with new access token
//       login = await baseQuery(args, api, extraOptions);
//     } else {
//       if (refresh?.error?.status === 403) {
//         refresh.error.data.message = "Please login again!";
//       }
//       return refresh;
//     }
//   }

//   return result;
// };

export const apiSlice = createApi({
  baseQuery: baseQuery,
  // baseQuery: baseQueryForRefresh,
  tagTypes: [
    "Shop",
    "Product",
    "Category",
    "Message",
    "MultiChat",
    "Sponsored",
    "User",
  ],
  endpoints: (builder) => ({}),
});

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const apiSlice = createApi({
//   reducerPath: "api", // optional
//   baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.1.98:8000" }),
//   tagTypes: ["User"],
//   endpoints: (builder) => ({}),
// });
