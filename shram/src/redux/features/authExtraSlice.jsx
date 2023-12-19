import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

const authExtraSlice = createSlice({
  name: "auth",
  initialState: { token: null, refreToken: null, user: null },
  reducers: {
    getLogin: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.token = accessToken;
      state.refreToken = refreshToken;
      state.user = user;
    },
    logOutMySession: (state, action) => {
      state.token = null;
      state.refreToken = null;
      state.user = null;
    },
  },
});

export const { getLogin, logOutMySession } = authExtraSlice.actions;

export default authExtraSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
