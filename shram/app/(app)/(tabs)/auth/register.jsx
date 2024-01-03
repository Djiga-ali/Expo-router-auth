import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Link } from "expo-router/src/exports";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../../../../src/hooks/useAuth";

const RegisterScreen = () => {
  const { user } = useAuth();
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
          <Text>Register</Text>
        </View>
        <View>
          <Text>USER : {JSON.stringify(user, null, 4)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
