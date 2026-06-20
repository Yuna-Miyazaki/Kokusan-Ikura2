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

const SPEED_SEGMENTS = 14;

function SpeedMeter({ speed, power }: { speed: number; power: number }) {
  const maximumSpeed = GAME_BALANCE.damage.maximumSpeed;
  const speedPercent = Math.min(100, Math.max(0, speed / maximumSpeed * 100));
  const activeSegments = speed === 0 ? 0 : Math.ceil(speedPercent / 100 * SPEED_SEGMENTS);
  const successStart = Math.min(100, GAME_BALANCE.damage.minimumSuccess / power / maximumSpeed * 100);
  const successEnd = Math.min(100, GAME_BALANCE.damage.maximumSuccess / power / maximumSpeed * 100);

  return (
    <div className="speed-meter" role="meter" aria-label="現在のスピード" aria-valuemin={0} aria-valuemax={maximumSpeed} aria-valuenow={Math.round(speed)}>
      <span className="speed-meter__title">SPEED</span>
      <div className="speed-meter__body">
        <div className="speed-meter__sweetspot" style={{ bottom: `${successStart}%`, height: `${Math.max(4, successEnd - successStart)}%` }}><span>GOOD</span></div>
        <div className="speed-meter__segments" aria-hidden="true">
          {Array.from({ length: SPEED_SEGMENTS }, (_, index) => {
            const isActive = index >= SPEED_SEGMENTS - activeSegments;
            return <i key={index} className={isActive ? "is-active" : ""} />;
          })}
        </div>
        <span className="speed-meter__needle" style={{ bottom: `calc(${speedPercent}% - 8px)` }}>◀</span>
      </div>
      <span className="speed-meter__caption">POWER</span>
    </div>
  );
}

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
          <p>武器の照準マークを、犯人の頭の光る円へ当てよう！勢いが弱すぎても強すぎても失敗だ。</p>
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
          <SpeedMeter speed={displaySpeed} power={power} />
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
            <span className="weapon-center-mark" aria-hidden="true" />
          </div>
          <div className="target-person" aria-label="犯人の頭">
            <div ref={headRef} className={`target-head ${debug ? "target-head--debug" : ""}`}><span>!</span></div>
            <div className="target-zone-indicator" aria-hidden="true"><span>HIT ZONE</span></div>
            <div className="target-shoulders" />
          </div>
          <div className="aim-label">光る円を狙え！<span>↓</span></div>
          {impact && <div className="impact-word">ポコン！</div>}
        </div>
        <p className="drag-note"><span>☝</span> 武器を押したまま動かし、照準マークと光る円を重ねよう</p>
      </div>
    </SceneShell>
  );
}
