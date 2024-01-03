import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  useGetMobileRefreshTwoQuery,
  useGetUserQuery,
} from "../redux/features/authSlice";
import {
  selectCurrentToken,
  selectLoggedInUser,
} from "../redux/features/authExtraSlice";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

const useAuth = () => {
  const [userData, setUserData] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const {
    data: refreshData = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMobileRefreshTwoQuery(refreshToken);

  const myToken = useSelector(selectCurrentToken);
  const user = useSelector(selectLoggedInUser);
  const router = useRouter();

  useEffect(() => {
    getToken("refreshToken");
  }, [myToken]);

  const getToken = async (key) => {
    try {
      const rToken = await SecureStore.getItemAsync(key);
      setRefreshToken(rToken);
      // }
    } catch (e) {
      console.log(e?.error?.data?.message);
      // console.log("No refresh token");
    }
  };

  //Test 3 ::::::
  useEffect(() => {
    if (refreshToken && !myToken) {
      refreshMyToken();
    }
  }, [refreshData]);

  const refreshMyToken = () => {
    setUserData(refreshData?.user);
  };

  // if (refreshToken && !myToken && error?.data?.message === "Forbidden") {
  //   router.replace("auth/login");
  // }

  if (user) {
    // const decoded = jwtDecode(token);
    // const user = decoded.user;
    return { user };
  }

  return { user: null };
};

export default useAuth;
