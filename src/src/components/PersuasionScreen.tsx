import { useState } from "react";
import { GAME_BALANCE } from "../config/gameBalance";
import { clampRemorse, getPersuasionBonus, resolvePersuasion } from "../gameLogic";
import type { GameResult, PersuasionMethod } from "../types/game";
import { Character } from "./Character";
import { RemorseGauge } from "./RemorseGauge";
import { SceneShell } from "./SceneShell";

interface PersuasionScreenProps {
  initialRemorse: number;
  onResolved: (result: GameResult) => void;
}

const METHODS: Array<{ id: PersuasionMethod; title: string; detail: string; bonus: string }> = [
  { id: "kind", title: "優しく諭す", detail: "相手の気持ちに寄り添う", bonus: "反省度 +25 UP" },
  { id: "logical", title: "論理的に説明する", detail: "証拠を順番に示す", bonus: "反省度 +18 UP" },
  { id: "stern", title: "強い口調で注意する", detail: "ビシッと一喝する", bonus: "反省度 +10〜30 UP" },
];

function MethodSketch({ method }: { method: PersuasionMethod }) {
  if (method === "kind") return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M13 37 C18 25 27 22 32 31 C38 20 50 25 50 35 C49 44 40 50 32 55 C23 50 14 46 13 37Z" />
      <path d="M15 20 C21 14 29 13 35 15 M19 12 C25 8 31 8 37 10" />
    </svg>
  );
  if (method === "logical") return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="9" y="10" width="17" height="13" rx="3" />
      <rect x="38" y="26" width="17" height="13" rx="3" />
      <rect x="9" y="43" width="17" height="13" rx="3" />
      <path d="M27 17 C38 17 43 19 45 25 M39 32 C30 33 24 36 20 42" />
      <path d="M41 20 L46 25 L40 27 M25 37 L20 42 L26 44" />
    </svg>
  );
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M31 8 C30 21 29 35 30 43" />
      <path d="M17 14 C20 25 22 33 24 39 M45 13 C40 25 38 33 36 39" />
      <path d="M30 51 C36 50 39 54 36 58 C32 61 26 59 26 55 C26 53 28 52 30 51Z" />
    </svg>
  );
}

export function PersuasionScreen({ initialRemorse, onResolved }: PersuasionScreenProps) {
  const [isTalking, setIsTalking] = useState(false);
  const [selected, setSelected] = useState<PersuasionMethod | null>(null);

  const choose = (method: PersuasionMethod) => {
    if (isTalking) return;
    setSelected(method);
    setIsTalking(true);
    const finalRemorse = clampRemorse(initialRemorse + getPersuasionBonus(method));
    const outcome = resolvePersuasion(finalRemorse);
    window.setTimeout(() => onResolved({
      outcome,
      metrics: { route: "persuasion", initialRemorse, finalRemorse, method },
    }), 1050);
  };

  return (
    <SceneShell eyebrow="PERSUASION" title="どんな言葉をかける？">
      <div className={`persuasion-scene ${isTalking ? "persuasion-scene--active" : ""}`}>
        <RemorseGauge value={initialRemorse} className="persuasion-remorse-gauge" />
        <Character role="detective" mood="thinking" />
        <div className="talk-cloud">{selected ? "なるほど…\nその話は…" : "言葉を選んで\n心を動かそう"}</div>
        <Character mood="nervous" />
      </div>
      <p className="instruction">反省度ゲージの様子を読み、いちばん響きそうな方法をひとつ選ぼう。</p>
      <div className="persuasion-options">
        {METHODS.map((method) => <button key={method.id} disabled={isTalking} className={selected === method.id ? "selected" : ""} onClick={() => choose(method.id)}>
          <span className={`method-icon method-icon--${method.id}`}><MethodSketch method={method.id} /></span>
          <span><strong>{method.title}</strong><small>{method.detail}</small></span>
          <b>{method.bonus}</b>
        </button>)}
      </div>
      <div className="threshold-note">反省度が {GAME_BALANCE.persuasion.confessionThreshold} 以上なら、自白のチャンス！</div>
    </SceneShell>
  );
}
