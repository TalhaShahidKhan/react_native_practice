import React from "react";
import { View } from "react-native";
import { GameConstants } from "../constants/GameConstants";

interface PipeProps {
  x: number;
  gapTop: number;
}

const Pipe: React.FC<PipeProps> = ({ x, gapTop }) => {
  const pipeWidth = GameConstants.PIPE_WIDTH;
  const gapHeight = GameConstants.PIPE_GAP;

  return (
    <>
      {/* Top Pipe */}
      <View
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: pipeWidth,
          height: gapTop,
          backgroundColor: "#228B22",
          borderBottomWidth: 3,
          borderColor: "#006400",
        }}
      />
      {/* Bottom Pipe */}
      <View
        style={{
          position: "absolute",
          left: x,
          top: gapTop + gapHeight,
          width: pipeWidth,
          height: GameConstants.SCREEN_HEIGHT - (gapTop + gapHeight),
          backgroundColor: "#228B22",
          borderTopWidth: 3,
          borderColor: "#006400",
        }}
      />
    </>
  );
};

export default Pipe;
