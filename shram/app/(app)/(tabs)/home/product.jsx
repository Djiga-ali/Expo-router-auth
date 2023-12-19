import { View, Text, ScrollView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router/src/exports";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../../src/redux/features/authExtraSlice";

const ProductScreen = () => {
  const [userId, setUserId] = useState(null);

  const myToken = useSelector(selectCurrentToken);

  useEffect(() => {
    getToken();
  }, [userId]);

  const getToken = async () => {
    try {
      const data = await AsyncStorage.getItem("token");
      const result = JSON.parse(data);
      setUserId(result);
    } catch (error) {
      console.log(error);
    }
    // }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUserId(null);
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
          <Link href="home/product">
            <Text>Product</Text>
          </Link>
          <Link href="auth/login">
            <Text>Login</Text>
          </Link>
          <Link href="auth/register">
            <Text>Register</Text>
          </Link>
          <Text>Product</Text>
        </View>
        <View>{/* <Text>{JSON.stringify(user, null, 4)}</Text>  */}</View>
        <View>{/* <Text>{JSON.stringify(user, null, 4)}</Text>  */}</View>
        {/* <Button
          title="Set token"
          className="w-full h-10 mt-3"
          onPress={setToken}
        /> */}
        <View>{/* <Text>{JSON.stringify(user, null, 4)}</Text>  */}</View>
        <View>
          <Text>myToken:{myToken}</Text>
          <View>
            <Text>{JSON.stringify(userId, null, 4)}</Text>
          </View>
        </View>
        <Button
          title="Get token"
          className="w-full h-10 mt-3"
          onPress={getToken}
        />
        <View>{/* <Text>{JSON.stringify(user, null, 4)}</Text>  */}</View>
        <View>
          <Text></Text>
        </View>
        <Button
          title="Remove token"
          className="w-full h-10 mt-3"
          onPress={removeToken}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductScreen;
