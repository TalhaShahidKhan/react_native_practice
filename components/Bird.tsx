import React from "react";
import { View } from "react-native";
import { GameConstants } from "../constants/GameConstants";

interface BirdProps {
  y: number;
  rotation: number;
}

const Bird: React.FC<BirdProps> = ({ y, rotation }) => {
  return (
    <View
      style={{
        position: "absolute",
        left: GameConstants.SCREEN_WIDTH / 2 - GameConstants.BIRD_WIDTH / 2,
        top: y,
        width: GameConstants.BIRD_WIDTH,
        height: GameConstants.BIRD_HEIGHT,
        backgroundColor: "#FFD700",
        transform: [{ rotate: `${rotation}deg` }],
      }}
    />
  );
};

export default Bird;
