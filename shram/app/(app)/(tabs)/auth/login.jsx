import { View, Text, ScrollView, TextInput, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router/src/exports";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../../../../src/hooks/useAuth";
import { useDispatch } from "react-redux";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useLoginSessionMutation,
  useLogoutSessionMutation,
} from "../../../../src/redux/features/authSlice";

const LoginScreen = () => {
  //   const { user } = useAuth();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persist, setPersist] = useState("persist");
  const dispatch = useDispatch();
  const [loginSession, { isLoading, isSuccess, isError, error }] =
    useLoginSessionMutation();
  const [logoutSession] = useLogoutSessionMutation();
  const router = useRouter();

  // useEffect(() => {
  //   const storeData = async () => {
  //     try {
  //       await AsyncStorage.setItem("token", JSON.stringify(token));
  //     } catch (error) {
  //       // saving error
  //       console.log(error);
  //     }
  //   };
  //   storeData();
  // }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      try {
        const { accessToken, user, refreshToken } = await loginSession({
          email,
          password,
        }).unwrap();
        console.log("accessToken:", accessToken);

        if (accessToken) {
          // await AsyncStorage.setItem("user", JSON.stringify(user));
          await SecureStore.setItemAsync(
            "refreshToken",
            refreshToken
            // JSON.stringify(refreshToken)
          );
          // await SecureStore.setItemAsync("token", accessToken);
          // await SecureStore.setItemAsync("user", JSON.stringify(user));
          // await AsyncStorage.setItem("token", JSON.stringify(accessToken));
          setToken(accessToken);
          router.replace("home");
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  //   const logout = async () => {
  //     await logoutSession();
  //   };

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
          <Text>Login</Text>
        </View>
        <View>
          <TextInput
            onChangeText={(e) => setEmail(e)}
            placeholder="Email"
            className="w-full h-10 border border-slate-300 pl-2"
            // onChangeText={onChangeNumber}
            value={email}
          />
          <TextInput
            value={password}
            onChangeText={(e) => setPassword(e)}
            placeholder="Password"
            secureTextEntry={true}
            className="w-full h-10 border mt-4 mb-4 border-slate-300 pl-2"
          />

          <Button
            title="Login"
            className="w-full h-10 mt-3"
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
