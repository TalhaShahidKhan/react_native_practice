import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const Layout = () => {
  return (
    <View>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="about" />
      </Stack>
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({});
