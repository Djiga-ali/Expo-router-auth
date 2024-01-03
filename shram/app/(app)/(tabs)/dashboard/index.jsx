import { View, Text } from "react-native";
import React from "react";
import useAuth from "../../../../src/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <View>
      {/* JSON.stringify(value, replacer, space) */}
      <Text>USER : {JSON.stringify(user, null, 4)}</Text>
    </View>
  );
};

export default Dashboard;
