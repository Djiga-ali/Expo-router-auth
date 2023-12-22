import { View, Text, ScrollView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router/src/exports";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../../../../src/hooks/useAuth";
import {
  useGetMobileRefreshMutation,
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

const HomeSceen = () => {
  // const { user } = useAuth();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [loggedIn, setLoggedIn] = useState("true");
  const [userData, setUserData] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loginToken, setLoginToken] = useState(null);

  // const { data: user = [] } = useGetUserQuery(userId);
  const [logoutSession, { isLoading, isSuccess, isError, error }] =
    useLogoutSessionMutation();
  const [getMobileRefresh] = useGetMobileRefreshMutation();
  const myToken = useSelector(selectCurrentToken);
  const loggedInUser = useSelector(selectLoggedInUser);
  const router = useRouter();
  // console.log("userId:", userId);
  // console.log("token:", token);

  useEffect(() => {
    storeData();
  }, [myToken]);

  const storeData = async () => {
    try {
      if (loggedInUser) {
        await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));

        // await SecureStore.setItemAsync("token", JSON.stringify(myToken));
        // await AsyncStorage.setItem("token", JSON.stringify(myToken));
        // await AsyncStorage.setItem("loggedIn", JSON.stringify(loggedIn));
        // await SecureStore.setItemAsync("loggedIn", loggedIn);
      }
    } catch (error) {
      // saving error
      console.log(error);
    }
  };

  useEffect(() => {
    getToken("token");
  }, [myToken]);

  const getToken = async (key) => {
    try {
      const data = await SecureStore.getItemAsync(key);
      const rToken = await SecureStore.getItemAsync("refreshToken");
      const user = await AsyncStorage.getItem("user");
      // const data = await AsyncStorage.getItem(key);

      // const data = await SecureStore.getItemAsync(key);
      const result = JSON.parse(data);
      const userResult = JSON.parse(user);
      // const rTokenResult = JSON.parse(rToken);
      setUserId(result);
      setUserData(userResult);
      setRefreshToken(rToken);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!myToken && userData) {
      const runRefresf = async () => {
        const { accessToken, user } = await getMobileRefresh(refreshToken);
        if (accessToken) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          setUserData(user);
          setLoginToken(accessToken);
        }
      };
      runRefresf();
    }
  }, []);

  // useEffect(() => {
  //   removeKey("loggedIn");
  // }, []);

  const removeKey = async (key) => {
    await AsyncStorage.removeItem(key);
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("loggedIn");
      await SecureStore.deleteItemAsync("refreshToken");
      await AsyncStorage.removeItem("user");
      // await AsyncStorage.removeItem("token");
      // await AsyncStorage.removeItem("loggedIn");
      await logoutSession();
      // await SecureStore.deleteItemAsync("token");
      // await AsyncStorage.removeItem("user");
      setUserId(null);
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
            <Text>Home</Text>
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
          <Text>Authenticated: {authenticated}</Text>
        </View>
        <View>
          <Text>User token: {userId}</Text>
        </View>
        <View>
          <Text>My token ::: {myToken}</Text>
          <Text>refreshToken:: : {refreshToken}</Text>
        </View>
        <View>{/* <Text>{JSON.stringify(userId, null, 4)}</Text> */}</View>
        <View>
          <Text>
            {myToken ? (
              <Text>userData :: {JSON.stringify(userData, null, 4)}</Text>
            ) : (
              "No user"
            )}
          </Text>
          {/* <Text>{JSON.stringify(userData, null, 4)}</Text> */}
        </View>
        <Button title="Logout" className="w-full h-10 mt-3" onPress={logout} />
        <Text>loginToken:: : {loginToken}</Text>
        <Text>loggedInUser ::{JSON.stringify(loggedInUser, null, 4)}</Text>
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
