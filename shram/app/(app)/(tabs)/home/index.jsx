import { View, Text, ScrollView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router/src/exports";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../../../../src/hooks/useAuth";
import {
  useGetUserQuery,
  useLogoutSessionMutation,
} from "../../../../src/redux/features/authSlice";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import JWT from "expo-jwt";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../../src/redux/features/authExtraSlice";

const HomeSceen = () => {
  // const { user } = useAuth();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const { data: user = [] } = useGetUserQuery(userId);
  const [logoutSession, { isLoading, isSuccess, isError, error }] =
    useLogoutSessionMutation();
  const myToken = useSelector(selectCurrentToken);
  const router = useRouter();
  // console.log("userId:", userId);
  // console.log("token:", token);

  useEffect(() => {
    storeData();
  }, [myToken]);

  const storeData = async () => {
    try {
      if (myToken) {
        await AsyncStorage.setItem("token", JSON.stringify(myToken));
      }
    } catch (error) {
      // saving error
      console.log(error);
    }
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const data = await AsyncStorage.getItem("token");
        // const data = await SecureStore.getItemAsync(key);
        const result = JSON.parse(data);
        // const decoded = JWT.decode(result);
        // const decoded = jwtDecode(data);
        setUserId(result);
        // if (result) {
        //   setUserId(result);
        // } else {
        // setUserId("No user");
        // }
      } catch (error) {
        console.log(error);
      }
    };

    getToken();
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
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
          <Text>User token: {userId}</Text>
        </View>
        <View>
          <Text>My token : {myToken}</Text>
        </View>
        <View>{/* <Text>{JSON.stringify(userId, null, 4)}</Text> */}</View>
        <View>{/* <Text>{JSON.stringify(user, null, 4)}</Text>  */}</View>
        <Button title="Logout" className="w-full h-10 mt-3" onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeSceen;
