import { View, Text } from "react-native";
import React from "react";
import { Stack, useRouter, Redirect } from "expo-router";
import useAuth from "../../../../src/hooks/useAuth";

const DashboardLayout = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    // router.replace("home");
    return <Redirect href="/home" />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="about" options={{ headerShown: false }} /> */}
    </Stack>
  );
};

export default DashboardLayout;
