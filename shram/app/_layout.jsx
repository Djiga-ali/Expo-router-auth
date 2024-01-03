import { View, Text } from "react-native";
import React from "react";
import { Slot } from "expo-router";
// redux tool-kit
import { Provider, useSelector } from "react-redux";
import store from "../src/redux/api/store";
import UserProvider from "../src/context/Context";
// import store from "../redux/api/store";
// import UserProvider from "../context/Context";
import "../global.css";
// Nativewind

const RootLayout = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <Slot />
      </UserProvider>
    </Provider>
  );
};

export default RootLayout;
