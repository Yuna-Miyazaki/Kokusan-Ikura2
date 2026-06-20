import { GAME_BALANCE } from "../config/gameBalance";
import type { GameResult } from "../types/game";
import { Character } from "./Character";
import { SceneShell } from "./SceneShell";

interface ResultScreenProps { result: GameResult; onRestart: () => void }

const RESULT_COPY = {
  "detective-arrested": { label: "まさかの結末", title: "力加減を間違えた！", mark: "!?", className: "bad" },
  "culprit-arrested": { label: "事件解決", title: "見事、犯人逮捕！", mark: "解決", className: "good" },
  "culprit-escaped": { label: "逃走発生", title: "犯人に逃げられた！", mark: "逃", className: "escape" },
} as const;

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const copy = RESULT_COPY[result.outcome];
  const hit = result.metrics.route === "hit" ? result.metrics : null;
  const persuasion = result.metrics.route === "persuasion" ? result.metrics : null;

  return (
    <SceneShell compact>
      <div className={`result-layout result-layout--${copy.className}`}>
        <div className="result-visual">
          <span className="result-stamp">{copy.mark}</span>
          {result.outcome === "culprit-escaped" ? <Character mood="running" /> : <>
            <Character role="police" />
            <Character role={result.outcome === "detective-arrested" ? "detective" : "culprit"} mood="caught" />
          </>}
          <div className="motion-lines" />
        </div>
        <div className="result-copy">
          <p className="eyebrow">{copy.label}</p>
          <h1>{copy.title}</h1>
          <p className="result-comment">
            {result.outcome === "culprit-arrested" ? "絶妙な判断！事件は無事に解決しました。" : result.outcome === "culprit-escaped" ? "あと一歩だった！次こそ事件を解決しよう。" : "名探偵、勢いあまって御用となりました…。"}
          </p>
          <dl className="result-metrics">
            {hit && <>
              <div><dt>計測速度</dt><dd>{hit.speed}<small> px/s</small></dd></div>
              <div><dt>武器係数</dt><dd>×{hit.power}</dd></div>
              <div className="metric-total"><dt>最終ダメージ</dt><dd>{hit.damage}</dd></div>
            </>}
            {persuasion && <>
              <div><dt>最初の反省度</dt><dd>{persuasion.initialRemorse}<small> / 100</small></dd></div>
              <div className="metric-total"><dt>最終反省度</dt><dd>{persuasion.finalRemorse}<small> / 100</small></dd></div>
            </>}
          </dl>
          {hit && <p className="balance-recap">適切ゾーン：{GAME_BALANCE.damage.minimumSuccess}〜{GAME_BALANCE.damage.maximumSuccess}</p>}
          <button className="button button--primary button--large" onClick={onRestart}>もう一度遊ぶ <span>↻</span></button>
        </div>
      </div>
    </SceneShell>
  );
}
