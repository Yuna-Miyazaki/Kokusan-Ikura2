import { useState } from "react";
import { GAME_BALANCE } from "../config/gameBalance";
import { clampRemorse, getPersuasionBonus, resolvePersuasion } from "../gameLogic";
import type { GameResult, PersuasionMethod } from "../types/game";
import { Character } from "./Character";
import { SceneShell } from "./SceneShell";

interface PersuasionScreenProps {
  initialRemorse: number;
  onResolved: (result: GameResult) => void;
}

const METHODS: Array<{ id: PersuasionMethod; icon: string; title: string; detail: string; bonus: string }> = [
  { id: "kind", icon: "☕", title: "優しく諭す", detail: "相手の気持ちに寄り添う", bonus: "+25" },
  { id: "logical", icon: "🧩", title: "論理的に説明する", detail: "証拠を順番に示す", bonus: "+18" },
  { id: "stern", icon: "⚡", title: "強い口調で注意する", detail: "ビシッと一喝する", bonus: "+10〜30" },
];

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
        <Character role="detective" mood="thinking" />
        <div className="talk-cloud">{selected ? "なるほど…\nその話は…" : "言葉を選んで\n心を動かそう"}</div>
        <Character mood="nervous" />
      </div>
      <p className="instruction">犯人の反省度は見えません。いちばん響きそうな方法をひとつ選ぼう。</p>
      <div className="persuasion-options">
        {METHODS.map((method) => <button key={method.id} disabled={isTalking} className={selected === method.id ? "selected" : ""} onClick={() => choose(method.id)}>
          <span className="method-icon">{method.icon}</span>
          <span><strong>{method.title}</strong><small>{method.detail}</small></span>
          <b>{method.bonus}</b>
        </button>)}
      </div>
      <div className="threshold-note">反省度が {GAME_BALANCE.persuasion.confessionThreshold} 以上なら、自白のチャンス！</div>
    </SceneShell>
  );
}
