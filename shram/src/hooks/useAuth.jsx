import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useGetUserQuery } from "../redux/features/authSlice";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const { data: user = [] } = useGetUserQuery(userId);
  // console.log("userId:", userId);
  // console.log("token:", token);

  useEffect(() => {
    getToken("token");
  }, []);

  const getToken = async (key) => {
    let data = await SecureStore.getItemAsync(key);
    // const result = JSON.parse(data);
    // const decoded = jwtDecode(result);
    const decoded = jwtDecode(data);
    setUserId(data);

    if (data) {
      setToken(data);
    } else {
      setToken("No Token");
    }
  };

  if (user) {
    // const decoded = jwtDecode(token);
    // const user = decoded.user;
    return { user };
  }

  return { user: null };
};

export default useAuth;
