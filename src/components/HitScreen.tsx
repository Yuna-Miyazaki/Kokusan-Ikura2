import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { GAME_BALANCE, type WeaponId } from "../config/gameBalance";
import { calculateDamage, judgeDamage } from "../gameLogic";
import { usePointerVelocity } from "../hooks/usePointerVelocity";
import type { GameResult, Outcome } from "../types/game";
import { SceneShell } from "./SceneShell";
import { WeaponArt } from "./WeaponArt";

interface HitScreenProps {
  weapon: WeaponId;
  debug: boolean;
  onResolved: (result: GameResult) => void;
}

interface Point { x: number; y: number }

function segmentHitsCircle(start: Point, end: Point, center: Point, radius: number): boolean {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((center.x - start.x) * dx + (center.y - start.y) * dy) / lengthSquared));
  return Math.hypot(start.x + t * dx - center.x, start.y + t * dy - center.y) <= radius;
}

export function HitScreen({ weapon, debug, onResolved }: HitScreenProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const weaponRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, pointerId: -1, startPointer: { x: 0, y: 0 }, startDelta: { x: 0, y: 0 }, centerOffset: { x: 0, y: 0 } });
  const deltaRef = useRef<Point>({ x: 0, y: 0 });
  const lastCenterRef = useRef<Point | null>(null);
  const lockedRef = useRef(false);
  const [delta, setDelta] = useState<Point>({ x: 0, y: 0 });
  const [impact, setImpact] = useState<Outcome | null>(null);
  const { reset, record, displaySpeed } = usePointerVelocity();
  const power = GAME_BALANCE.weapons[weapon].power;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (lockedRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = event.currentTarget.getBoundingClientRect();
    const center = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startPointer: { x: event.clientX, y: event.clientY },
      startDelta: deltaRef.current,
      centerOffset: { x: center.x - event.clientX, y: center.y - event.clientY },
    };
    lastCenterRef.current = center;
    reset(event.clientX, event.clientY, performance.now());
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId || lockedRef.current) return;
    event.preventDefault();
    const now = performance.now();
    const speed = record(event.clientX, event.clientY, now);
    const nextDelta = {
      x: drag.startDelta.x + event.clientX - drag.startPointer.x,
      y: drag.startDelta.y + event.clientY - drag.startPointer.y,
    };
    deltaRef.current = nextDelta;
    setDelta(nextDelta);

    const center = { x: event.clientX + drag.centerOffset.x, y: event.clientY + drag.centerOffset.y };
    const headBounds = headRef.current?.getBoundingClientRect();
    const previousCenter = lastCenterRef.current ?? center;
    lastCenterRef.current = center;
    if (!headBounds) return;
    const headCenter = { x: headBounds.left + headBounds.width / 2, y: headBounds.top + headBounds.height / 2 };
    const hit = segmentHitsCircle(previousCenter, center, headCenter, headBounds.width / 2);
    if (!hit) return;

    lockedRef.current = true;
    dragRef.current.active = false;
    const damage = calculateDamage(speed, power);
    const outcome = judgeDamage(damage);
    setImpact(outcome);
    window.setTimeout(() => onResolved({
      outcome,
      metrics: { route: "hit", speed: Math.round(speed), weapon, power, damage },
    }), 950);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId === event.pointerId) dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <SceneShell compact>
      <div className={`hit-screen ${impact ? `hit-screen--impact hit-screen--${impact}` : ""}`}>
        <header className="hit-heading">
          <p className="eyebrow">FIND THE SWEET SPOT</p>
          <h1>絶妙な一撃を決めろ！</h1>
          <p>武器をドラッグして、犯人の頭へ当てよう！勢いが弱すぎても強すぎても失敗だ。</p>
        </header>
        {debug && <aside className="debug-panel">
          <strong>DEBUG MONITOR</strong>
          <span>現在の速度 <b>{Math.round(displaySpeed)} px/s</b></span>
          <span>選択武器 <b>{GAME_BALANCE.weapons[weapon].label}</b></span>
          <span>武器係数 <b>×{power}</b></span>
          <span>予測ダメージ <b>{calculateDamage(displaySpeed, power)}</b></span>
          <span>境界値 <b>&lt;{GAME_BALANCE.damage.minimumSuccess} / {GAME_BALANCE.damage.maximumSuccess}&lt;</b></span>
        </aside>}
        <div className="hit-arena" ref={arenaRef}>
          <div className="speed-guide" aria-hidden="true"><span>弱</span><i /><span>適切</span><i /><span>強</span></div>
          <div
            ref={weaponRef}
            className={`draggable-weapon draggable-weapon--${weapon}`}
            style={{ transform: `translate3d(${delta.x}px, ${delta.y}px, 0)` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="button"
            aria-label={`${GAME_BALANCE.weapons[weapon].label}をドラッグ`}
            tabIndex={0}
          >
            <span className="grab-label">つかむ！</span>
            <WeaponArt weapon={weapon} />
          </div>
          <div className="target-person" aria-label="犯人の頭">
            <div ref={headRef} className={`target-head ${debug ? "target-head--debug" : ""}`}><span>!</span></div>
            <div className="target-shoulders" />
          </div>
          <div className="aim-label">ここを狙え！<span>↓</span></div>
          {impact && <div className="impact-word">ポコン！</div>}
        </div>
        <p className="drag-note"><span>☝</span> 武器を押したまま動かし、頭に当てよう</p>
      </div>
    </SceneShell>
  );
}
