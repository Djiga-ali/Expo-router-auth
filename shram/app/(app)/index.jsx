import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, Redirect } from "expo-router";

const FirstScreen = () => {
  return <Redirect href="/(tabs)/home" />;
};

export default FirstScreen;
