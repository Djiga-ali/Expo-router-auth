import { View, Text, ScrollView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router/src/exports";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../../../../src/hooks/useAuth";
import {
  useGetMobileRefreshMutation,
  useGetMobileRefreshTwoQuery,
  // useGetUserQuery,
  useLogoutSessionMutation,
} from "../../../../src/redux/features/authSlice";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import JWT from "expo-jwt";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectLoggedInUser,
} from "../../../../src/redux/features/authExtraSlice";
import HomePage from "../../../../src/components/home/HomePage";
// reoad screen

const HomeSceen = () => {
  // const { user } = useAuth();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [loggedIn, setLoggedIn] = useState("true");
  const [userData, setUserData] = useState(null);
  const [userData2, setUserData2] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loginToken, setLoginToken] = useState(null);

  const [logoutSession, { isLoading: Loading }] = useLogoutSessionMutation();

  const {
    data: refreshData = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMobileRefreshTwoQuery(refreshToken);

  const [
    getMobileRefresh,
    { data: refreshTokenData = [], isLoading: myLoading },
  ] = useGetMobileRefreshMutation();

  const myToken = useSelector(selectCurrentToken);
  const loggedInUser = useSelector(selectLoggedInUser);
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
    // getMobileRefresh(refreshToken);
  };

  if (isLoading || Loading || myLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (Loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (refreshToken && !myToken && error?.data?.message === "Forbidden") {
    router.replace("auth/login");
  }

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("loggedIn");
      await SecureStore.deleteItemAsync("refreshToken");
      await AsyncStorage.removeItem("user");
      await logoutSession();
      setUserId(null);
      setUserData(null);
      router.replace("auth/login");
    } catch (e) {
      // remove error
      console.log(e);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Link href="home">
            <Text className="text-red-500">Home</Text>
          </Link>
          <Link href="home/about">
            <Text>About</Text>
          </Link>
          <Link href="auth/login">
            <Text>Login</Text>
          </Link>
          <Link href="auth/register">
            <Text>Register</Text>
          </Link>
          <Text>HomeSceen</Text>
        </View>
        <View>
          <HomePage />
        </View>

        <View>
          <Text>ACCESS TOKEN : {myToken}</Text>
          <Text>REFRESH TOKEN: {refreshToken}</Text>
        </View>
        <View>{/* <Text>{JSON.stringify(userId, null, 4)}</Text> */}</View>

        <Button title="Logout" className="w-full h-10 mt-3" onPress={logout} />
        <Text>
          {loggedInUser ? (
            <Text>
              LOGGEIN USER :{JSON.stringify(loggedInUser?._id, null, 4)}
            </Text>
          ) : (
            "No user"
          )}
        </Text>

        <Button
          title="Refresh"
          className="w-full h-10 mt-3"
          // onPress={runRefresf}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeSceen;
