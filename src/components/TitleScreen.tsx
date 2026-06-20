import { Character } from "./Character";
import { SceneShell } from "./SceneShell";

interface TitleScreenProps { onStart: () => void }

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <SceneShell compact>
      <div className="title-layout">
        <div className="title-copy">
          <p className="eyebrow">COMICAL DETECTIVE GAME</p>
          <h1 className="logo-title"><span>謎解きは</span><strong><em>拳</em>の後で</strong></h1>
          <p className="lead">犯人への対応を選び、事件を終わらせよう。<br />ただし、力加減には注意。</p>
          <button className="button button--primary button--large" onClick={onStart}>ゲーム開始 <span>→</span></button>
          <p className="tiny-note">マウス・タッチ操作対応　／　プレイ時間 約1分</p>
        </div>
        <div className="title-scene" aria-hidden="true">
          <div className="spotlight" />
          <Character role="detective" className="title-detective" />
          <div className="culprit-silhouette"><span>?</span></div>
          <div className="comic-burst">事件だ！</div>
        </div>
      </div>
    </SceneShell>
  );
}
