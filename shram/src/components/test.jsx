import { View, Text, Button, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useLoginSessionMutation,
  useLogoutSessionMutation,
} from "../../../../src/redux/features/authSlice";
import useAuth from "../../../../src/hooks/useAuth";

const HomeScreen = () => {
  const { user } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persist, setPersist] = useState("persist");
  const dispatch = useDispatch();
  const [loginSession, { isLoading, isSuccess, isError, error }] =
    useLoginSessionMutation();
  const [logoutSession] = useLogoutSessionMutation();
  // const token = useSelector(selectCurrentToken);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken, user, refreshToken } = await loginSession({
        email,
        password,
      }).unwrap();
      console.log("accessToken:", accessToken);
      await SecureStore.setItemAsync("token", accessToken);
      // await SecureStore.setItemAsync("user", JSON.stringify(user));
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem(
        "loggedIn",
        JSON.stringify({ loggedIn: true })
      );
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      // router.replace("home/about");
    } catch (error) {
      console.log(error);
    }
  };

  // if (user) {
  //   router.replace("home/about");
  // }

  // useEffect(() => {
  //   logout();
  // }, []);

  const logout = async () => {
    await logoutSession();
    await SecureStore.deleteItemAsync("token");
    await AsyncStorage.removeItem("user");
    await SecureStore.deleteItemAsync("refreshToken");
  };

  useEffect(() => {
    getDataFromLocalStorage("token");
  }, []);

  //
  const getDataFromLocalStorage = async (key) => {
    let data = await SecureStore.getItemAsync(key);

    if (data) {
      setToken(data);
    } else {
      setToken("No token");
    }
  };

  useEffect(() => {}, []);
  // if (user) {
  //   router.replace("home/about");
  // }

  if (isLoading) {
    return (
      <View>
        <Text>Loading ...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="">
      {/* <PersistLogin /> */}
      <View className="top-10  w-screen h-screen">
        <View className="w-full h-full justify-center items-center pl-5 pr-5">
          <TextInput
            // defaultValue={email}
            onChangeText={(e) => setEmail(e)}
            placeholder="Email"
            className="w-full h-10 border border-slate-300 pl-2"
            // onChangeText={onChangeNumber}
            value={email}

            // keyboardType="numeric"
          />
          <TextInput
            // defaultValue={password}
            // A DEVELOPPER
            //       editable
            // multiline
            // numberOfLines={4}
            // maxLength={40}
            value={password}
            onChangeText={(e) => setPassword(e)}
            placeholder="Password"
            secureTextEntry={true}
            className="w-full h-10 border mt-4 mb-4 border-slate-300 pl-2"
          />

          <Button
            title="Login"
            className="w-full h-10 mt-3"
            onPress={(handleSubmit, router.replace("home/about"))}
          />
          <View className="w-full h-10 mt-3">
            <Text></Text>
          </View>
          <Button
            title="Logout"
            className="w-full h-10 mt-3"
            onPress={logout}
          />
        </View>
      </View>
      <View>
        {/* <Text>{token}</Text> */}
        {/* <Text>{password}</Text> */}
        <Text>{JSON.stringify(user, null, 4)}</Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
