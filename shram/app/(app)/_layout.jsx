import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import { Button } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};
const AppLayout = () => {
  return (
    <Stack initialRouteName="index" screenOptions={{}}>
      {/* Group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="index"
        options={{
          // headerTitle: "",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AppLayout;
