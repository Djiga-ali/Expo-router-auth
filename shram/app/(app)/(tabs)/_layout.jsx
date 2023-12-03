import { View, Text, Pressable, Image, TextInput } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Tabs } from "expo-router/tabs";

// Icons
import { Ionicons } from "@expo/vector-icons";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerLeft: () => (
          <View>
            <Text>Logo</Text>
          </View>
        ),
        headerTitle: () => (
          <View>
            <Text>Title</Text>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="ios-home-outline" size={24} color="#475569" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
