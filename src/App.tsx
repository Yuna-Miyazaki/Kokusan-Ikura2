import { useMemo, useState } from "react";
import type { WeaponId } from "./config/gameBalance";
import { randomIntInclusive } from "./gameLogic";
import type { GameResult, Screen } from "./types/game";
import { ActionSelectScreen } from "./components/ActionSelectScreen";
import { HitScreen } from "./components/HitScreen";
import { PersuasionScreen } from "./components/PersuasionScreen";
import { ResultScreen } from "./components/ResultScreen";
import { TitleScreen } from "./components/TitleScreen";
import { WeaponSelectScreen } from "./components/WeaponSelectScreen";

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [weapon, setWeapon] = useState<WeaponId>("pipe");
  const [result, setResult] = useState<GameResult | null>(null);
  const [initialRemorse, setInitialRemorse] = useState(() => randomIntInclusive(0, 100));
  const debug = useMemo(() => new URLSearchParams(window.location.search).get("debug") === "true", []);

  const resolve = (gameResult: GameResult) => {
    setResult(gameResult);
    setScreen("result");
  };

  const restart = () => {
    setWeapon("pipe");
    setResult(null);
    setInitialRemorse(randomIntInclusive(0, 100));
    setScreen("title");
  };

  if (screen === "title") return <TitleScreen onStart={() => setScreen("action")} />;
  if (screen === "action") return <ActionSelectScreen onPersuade={() => { setInitialRemorse(randomIntInclusive(0, 100)); setScreen("persuasion"); }} onHit={() => setScreen("weapon")} />;
  if (screen === "persuasion") return <PersuasionScreen initialRemorse={initialRemorse} onResolved={resolve} />;
  if (screen === "weapon") return <WeaponSelectScreen onConfirm={(selected) => { setWeapon(selected); setScreen("hit"); }} />;
  if (screen === "hit") return <HitScreen weapon={weapon} debug={debug} onResolved={resolve} />;
  if (screen === "result" && result) return <ResultScreen result={result} onRestart={restart} />;
  return <TitleScreen onStart={() => setScreen("action")} />;
}
