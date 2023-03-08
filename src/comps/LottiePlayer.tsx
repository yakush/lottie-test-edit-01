import React from "react";
import styles from "./LottiePlayer.module.css";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import { useLottieContext } from "../LottieContext";

type Props = {
  //children?: React.ReactNode;
};

const LottiePlayer: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();

  return (
    <Player
      autoplay
      loop
      src={lottie.json}
      // style={{ height: "300px", width: "300px" }}
    >
      <Controls visible={true} buttons={["play", "repeat", "frame", "debug"]} />
    </Player>
  );
};

export default LottiePlayer;
