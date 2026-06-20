interface RemorseGaugeProps {
  value: number;
  className?: string;
}

export function RemorseGauge({ value, className = "" }: RemorseGaugeProps) {
  return (
    <div className={`remorse-gauge ${className}`} role="progressbar" aria-label="犯人の反省度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <span className="remorse-gauge__label">反省度</span>
      <div className="remorse-gauge__track">
        <span className="remorse-gauge__shine" />
        <span className="remorse-gauge__fill" style={{ height: `${value}%` }} />
        <i /><i /><i />
      </div>
      <span className="remorse-gauge__arrow">◀</span>
    </div>
  );
}
