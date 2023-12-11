import React from "react";
import Spritesheet from "react-responsive-spritesheet";
import sprites from "./imgs/sprites.png";

export default function SpriteAnimation() {
  return (
    <Spritesheet
      image={sprites}
      direction={"forward"}
      widthFrame={64}
      heightFrame={64}
      steps={9}
      fps={12}
      loop={true}
    />
  );
}
