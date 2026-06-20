import type { ReactNode } from "react";

interface SceneShellProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  compact?: boolean;
}

export function SceneShell({ children, eyebrow, title, compact = false }: SceneShellProps) {
  return (
    <main className={`game-shell ${compact ? "game-shell--compact" : ""}`}>
      <div className="mansion-bg" aria-hidden="true">
        <span className="window window--left" /><span className="window window--right" />
        <span className="lamp">✦</span><span className="bookcase" /><span className="desk" />
      </div>
      <section className="game-card">
        {(eyebrow || title) && <header className="screen-heading">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h1>{title}</h1>}
        </header>}
        {children}
      </section>
    </main>
  );
}
