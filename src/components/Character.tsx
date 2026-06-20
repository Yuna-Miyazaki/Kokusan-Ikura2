interface CharacterProps {
  role?: "culprit" | "detective" | "police";
  mood?: "neutral" | "nervous" | "caught" | "running" | "thinking";
  className?: string;
}

export function Character({ role = "culprit", mood = "neutral", className = "" }: CharacterProps) {
  return (
    <div className={`character character--${role} character--${mood} ${className}`} aria-label={role === "culprit" ? "犯人" : role === "detective" ? "名探偵" : "警察官"}>
      <div className="character__hat"><span /></div>
      <div className="character__head">
        <span className="character__hair" />
        <span className="character__eye character__eye--left" />
        <span className="character__eye character__eye--right" />
        <span className="character__nose" />
        <span className="character__mouth" />
      </div>
      <div className="character__body">
        <span className="character__collar character__collar--left" />
        <span className="character__collar character__collar--right" />
        {role === "police" && <span className="character__badge">★</span>}
      </div>
      <div className="character__legs"><span /><span /></div>
    </div>
  );
}
