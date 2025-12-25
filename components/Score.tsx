import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ScoreProps {
  score: number;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    zIndex: 10,
  },
  text: {
    fontSize: 60,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
});

export default Score;
