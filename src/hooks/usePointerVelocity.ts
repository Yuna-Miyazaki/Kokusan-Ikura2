import { useCallback, useRef, useState } from "react";
import { GAME_BALANCE } from "../config/gameBalance";

interface PointerSample {
  x: number;
  y: number;
  time: number;
}

export function usePointerVelocity() {
  const samplesRef = useRef<PointerSample[]>([]);
  const speedRef = useRef(0);
  const [displaySpeed, setDisplaySpeed] = useState(0);

  const reset = useCallback((x: number, y: number, time = performance.now()) => {
    samplesRef.current = [{ x, y, time }];
    speedRef.current = 0;
    setDisplaySpeed(0);
  }, []);

  const record = useCallback((x: number, y: number, time = performance.now()) => {
    const samples = [...samplesRef.current, { x, y, time }]
      .filter((sample) => time - sample.time <= GAME_BALANCE.velocity.windowMs)
      .slice(-GAME_BALANCE.velocity.sampleCount);
    samplesRef.current = samples;

    if (samples.length < 2) return 0;
    let distance = 0;
    for (let index = 1; index < samples.length; index += 1) {
      distance += Math.hypot(samples[index].x - samples[index - 1].x, samples[index].y - samples[index - 1].y);
    }
    const elapsedSeconds = (samples[samples.length - 1].time - samples[0].time) / 1000;
    const speed = elapsedSeconds > 0 ? Math.min(distance / elapsedSeconds, GAME_BALANCE.damage.maximumSpeed) : 0;
    speedRef.current = speed;
    setDisplaySpeed(speed);
    return speed;
  }, []);

  return { reset, record, speedRef, displaySpeed };
}
