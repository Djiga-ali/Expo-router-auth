import { apiSlice } from "../api/apiSlice";
import { logOutMySession, getLogin } from "./authExtraSlice";

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login ****
    loginSession: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data);
          const { accessToken, user, refreshToken } = data;
          dispatch(getLogin({ accessToken, user, refreshToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    // Logout ***
    logoutSession: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(logOutMySession());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),

    // Refresh for mobile ***
    // getMobileRefresh: builder.mutation({
    getMobileRefresh: builder.mutation({
      query: (refreshToken) => ({
        url: `/auth/refresh/${refreshToken}`,
        method: "POST",
        // body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data);
          const { accessToken, user } = data;
          dispatch(getLogin({ accessToken, user }));
        } catch (err) {
          console.log(err);
        }
      },
    }),

    // get user
    getAuthenticatedUser: builder.query({
      query: (userId) => `/auth/get-user/${userId}`,
      // https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
      providesTags: ["User"],
    }),
  }),
});
export const {
  useLoginSessionMutation,
  useLogoutSessionMutation,
  // useGetUserQuery,
  useGetAuthenticatedUserQuery,
  // useGetMobileRefreshQuery,
  useGetMobileRefreshMutation,
} = authSlice;
