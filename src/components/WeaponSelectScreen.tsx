import { useState } from "react";
import { GAME_BALANCE, type WeaponId } from "../config/gameBalance";
import { SceneShell } from "./SceneShell";
import { WeaponArt } from "./WeaponArt";

interface WeaponSelectScreenProps { onConfirm: (weapon: WeaponId) => void }

const WEAPON_INFO: Record<WeaponId, { description: string; strength: string; dots: number }> = {
  magnifier: { description: "軽く扱いやすい。繊細な一撃向き。", strength: "ひかえめ", dots: 1 },
  pipe: { description: "標準的な威力。迷ったときの一本。", strength: "標準", dots: 2 },
  skateboard: { description: "非常に強い。力加減は超慎重に！", strength: "つよい", dots: 3 },
};

export function WeaponSelectScreen({ onConfirm }: WeaponSelectScreenProps) {
  const [selected, setSelected] = useState<WeaponId>("pipe");
  return (
    <SceneShell eyebrow="CHOOSE YOUR TOOL" title="相棒を選べ！">
      <p className="instruction">殴る速さが同じでも、武器によってダメージが変わります。</p>
      <div className="weapon-grid">
        {(Object.keys(GAME_BALANCE.weapons) as WeaponId[]).map((id) => {
          const weapon = GAME_BALANCE.weapons[id];
          const info = WEAPON_INFO[id];
          return <button key={id} className={`weapon-card ${selected === id ? "weapon-card--selected" : ""}`} onClick={() => setSelected(id)} aria-pressed={selected === id}>
            <span className="selected-ribbon">SELECTED</span>
            <WeaponArt weapon={id} className="weapon-card__art" />
            <strong>{weapon.label}</strong>
            <span className="power-row">威力 <b>{"●".repeat(info.dots)}{"○".repeat(3 - info.dots)}</b> <em>×{weapon.power}</em></span>
            <small>{info.description}</small>
            <span className="radio-mark">{selected === id ? "✓" : ""}</span>
          </button>;
        })}
      </div>
      <button className="button button--primary confirm-weapon" onClick={() => onConfirm(selected)}>この武器で挑戦 <span>→</span></button>
    </SceneShell>
  );
}
