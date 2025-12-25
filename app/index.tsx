import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import Game from "../components/Game";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden />
      <Game />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
