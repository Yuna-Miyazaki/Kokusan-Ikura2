import { Character } from "./Character";
import { SceneShell } from "./SceneShell";

interface ActionSelectScreenProps {
  onPersuade: () => void;
  onHit: () => void;
}

export function ActionSelectScreen({ onPersuade, onHit }: ActionSelectScreenProps) {
  return (
    <SceneShell eyebrow="CASE 01　犯人を追いつめた！" title="さて、どうする？">
      <div className="action-scene">
        <div className="speech-bubble">ま、待て！<br />話せばわかる…かも？</div>
        <Character mood="nervous" className="action-culprit" />
        <span className="question-mark question-mark--one">?</span>
        <span className="question-mark question-mark--two">!</span>
      </div>
      <div className="action-grid">
        <button className="choice-button choice-button--talk" onClick={onPersuade}>
          <span className="choice-button__icon">💬</span>
          <span><strong>説得する</strong><small>言葉で心を動かす</small></span>
          <b>→</b>
        </button>
        <button className="choice-button choice-button--hit" onClick={onHit}>
          <span className="choice-button__icon">💥</span>
          <span><strong>殴る</strong><small>絶妙な力加減でポコン！</small></span>
          <b>→</b>
        </button>
      </div>
      <p className="route-hint">どちらを選んでも、結末はあなた次第。</p>
    </SceneShell>
  );
}
