import React from "react";
import { useSpring, animated } from "@react-spring/web";

const AnimatedCount = ({ count }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: count,
    delay: 200,
    config: { tension: 150, friction: 14 },
  });

  return (
    <animated.span>
      {number.to((n) => n.toFixed(0))}
    </animated.span>
  );
};

export default AnimatedCount;
