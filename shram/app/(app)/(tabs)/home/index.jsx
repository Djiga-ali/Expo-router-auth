import { View, Text } from "react-native";
import React from "react";
import { useAuth } from "../../../../context/Context";

const HomeScreen = () => {
  const { token, user, refreshToken, loggedIn } = useAuth();
  return (
    <View>
      <Text className="text-lg font-bold text-red-600">{token}</Text>
      <Text>{user}</Text>
      <Text>{refreshToken}</Text>
      <Text>{loggedIn}</Text>
    </View>
  );
};

export default HomeScreen;
