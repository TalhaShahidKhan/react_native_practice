import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Logo from "../assets/favicon.png";
const HomePage = () => {
  return (
    <View style={styles.container}>
      <Image source={Logo} />
      <Text style={styles.title}>The Number 1</Text>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Reading List App</Text>
      <Link href="/about">About</Link>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
