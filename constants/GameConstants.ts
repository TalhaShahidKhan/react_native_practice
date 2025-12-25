import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const GameConstants = {
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  GRAVITY: 0.6,
  JUMP_STRENGTH: -10,
  PIPE_SPEED: 3,
  PIPE_WIDTH: 60,
  PIPE_GAP: 200,
  BIRD_WIDTH: 40,
  BIRD_HEIGHT: 30,
  GROUND_HEIGHT: 100,
  GAME_TICK: 16, // ~60 FPS
};
