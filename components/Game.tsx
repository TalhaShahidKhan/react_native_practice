import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { GameConstants } from "../constants/GameConstants";
import Bird from "./Bird";
import Pipe from "./Pipe";
import Score from "./Score";

const Game = () => {
  const [gameState, setGameState] = useState<"START" | "PLAYING" | "GAME_OVER">(
    "START"
  );
  const [birdY, setBirdY] = useState(GameConstants.SCREEN_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [birdRotation, setBirdRotation] = useState(0);
  const [pipes, setPipes] = useState<
    { x: number; gapTop: number; passed: boolean }[]
  >([]);
  const [score, setScore] = useState(0);

  // Refs for loop to access latest state without re-triggering effect
  const birdYRef = useRef(GameConstants.SCREEN_HEIGHT / 2);
  const pipesRef = useRef<{ x: number; gapTop: number; passed: boolean }[]>([]);
  const scoreRef = useRef(0);
  const gameStateRef = useRef<"START" | "PLAYING" | "GAME_OVER">("START");

  useEffect(() => {
    birdYRef.current = birdY;
  }, [birdY]);

  useEffect(() => {
    pipesRef.current = pipes;
  }, [pipes]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const startGame = () => {
    setGameState("PLAYING");
    setBirdY(GameConstants.SCREEN_HEIGHT / 2);
    setBirdVelocity(0);
    setBirdRotation(0);
    setPipes([]);
    setScore(0);

    birdYRef.current = GameConstants.SCREEN_HEIGHT / 2;
    pipesRef.current = [];
    scoreRef.current = 0;
    gameStateRef.current = "PLAYING";
  };

  const jump = () => {
    if (gameState === "PLAYING") {
      setBirdVelocity(GameConstants.JUMP_STRENGTH);
      setBirdRotation(-20);
    } else if (gameState === "START" || gameState === "GAME_OVER") {
      startGame();
    }
  };

  useEffect(() => {
    let loop: NodeJS.Timeout;
    if (gameState === "PLAYING") {
      loop = setInterval(() => {
        const currentBirdY = birdYRef.current;
        const currentPipes = pipesRef.current;

        // Update Physics
        setBirdVelocity((v) => v + GameConstants.GRAVITY);

        // We need to calculate new Y based on PREVIOUS Y + Velocity.
        // But since we are in a closure where we can't easily access the "next" velocity from the setBirdVelocity call immediately,
        // we will approximate or use a ref for velocity too if needed.
        // For simplicity, let's just use functional update for setBirdY but we need it for collision.
        // Let's use the REF for calculation to be checking "next frame" collision.

        // A better way for the loop is to manage ALL state in Ref and then sync to State for render,
        // OR just rely on the setStates and do collision check on the "rendered" state (delayed by 1 frame).
        // Delayed by 1 frame is usually fine for this simple game.

        // Let's stick to the React-way where we set state, but collision check might be tricky.
        // Actually, let's do the collision check on the calculated values BEFORE setting state.

        setBirdVelocity((v) => {
          const newVelocity = v + GameConstants.GRAVITY;
          const newY = birdYRef.current + newVelocity;

          // Update Rotation
          setBirdRotation((r) => Math.min(r + 2, 90));

          // Update Y
          setBirdY(Math.max(Math.min(newY, GameConstants.SCREEN_HEIGHT), -100)); // Clamp to avoid infinite fall

          // Check Collision (Ground)
          if (
            newY >=
            GameConstants.SCREEN_HEIGHT -
              GameConstants.GROUND_HEIGHT -
              GameConstants.BIRD_HEIGHT
          ) {
            setGameState("GAME_OVER");
          }

          // Check Collision (Pipes)
          const birdRect = {
            x: GameConstants.SCREEN_WIDTH / 2 - GameConstants.BIRD_WIDTH / 2,
            y: newY,
            width: GameConstants.BIRD_WIDTH,
            height: GameConstants.BIRD_HEIGHT,
          };

          // Move Pipes & Check
          setPipes((prevPipes) => {
            let newPipes = [...prevPipes];

            // Move
            newPipes = newPipes.map((p) => ({
              ...p,
              x: p.x - GameConstants.PIPE_SPEED,
            }));

            // Remove off-screen
            if (
              newPipes.length > 0 &&
              newPipes[0].x + GameConstants.PIPE_WIDTH < -50
            ) {
              newPipes.shift();
            }

            // Add new pipe
            if (
              newPipes.length === 0 ||
              newPipes[newPipes.length - 1].x < GameConstants.SCREEN_WIDTH - 200
            ) {
              const gapTop =
                Math.random() *
                  (GameConstants.SCREEN_HEIGHT -
                    GameConstants.GROUND_HEIGHT -
                    GameConstants.PIPE_GAP -
                    100) +
                50;
              newPipes.push({
                x: GameConstants.SCREEN_WIDTH,
                gapTop,
                passed: false,
              });
            }

            // Check Collisions
            newPipes.forEach((pipe) => {
              const pipeLeft = pipe.x;
              const pipeRight = pipe.x + GameConstants.PIPE_WIDTH;

              if (
                birdRect.x + birdRect.width > pipeLeft &&
                birdRect.x < pipeRight
              ) {
                if (
                  birdRect.y < pipe.gapTop ||
                  birdRect.y + birdRect.height >
                    pipe.gapTop + GameConstants.PIPE_GAP
                ) {
                  setGameState("GAME_OVER");
                }
              }

              // Score
              if (!pipe.passed && birdRect.x > pipeRight) {
                pipe.passed = true;
                setScore((s) => s + 1);
              }
            });

            return newPipes;
          });

          return newVelocity;
        });
      }, GameConstants.GAME_TICK);
    }
    return () => clearInterval(loop);
  }, [gameState]);

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <Score score={score} />
        <Bird y={birdY} rotation={birdRotation} />
        {pipes.map((pipe, index) => (
          <Pipe key={index} x={pipe.x} gapTop={pipe.gapTop} />
        ))}
        {/* Ground */}
        <View style={styles.ground} />

        {gameState === "START" && (
          <View style={styles.overlay}>
            <Text style={styles.title}>FLAPPY BIRD</Text>
            <Text style={styles.text}>Tap to Start</Text>
          </View>
        )}

        {gameState === "GAME_OVER" && (
          <View style={styles.overlay}>
            <Text style={styles.title}>Game Over</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.text}>Tap to Restart</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
    overflow: "hidden",
  },
  ground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: GameConstants.GROUND_HEIGHT,
    backgroundColor: "#D2B48C",
    borderTopWidth: 5,
    borderColor: "#8B4513",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    fontSize: 50,
    fontWeight: "900",
    color: "#FFD700",
    marginBottom: 20,
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  scoreText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
});

export default Game;
