import type { WeaponId } from "../config/gameBalance";

interface WeaponArtProps {
  weapon: WeaponId;
  className?: string;
}

export function WeaponArt({ weapon, className = "" }: WeaponArtProps) {
  if (weapon === "magnifier") {
    return (
      <svg className={className} viewBox="0 0 160 120" role="img" aria-label="大きな虫眼鏡">
        <circle cx="62" cy="48" r="34" fill="#bfeaff" stroke="#27324b" strokeWidth="9" />
        <circle cx="52" cy="38" r="9" fill="#fff" opacity=".75" />
        <path d="M87 75 L137 112" stroke="#27324b" strokeWidth="17" strokeLinecap="round" />
        <path d="M90 77 L134 109" stroke="#e15e50" strokeWidth="9" strokeLinecap="round" />
      </svg>
    );
  }
  if (weapon === "pipe") {
    return (
      <svg className={className} viewBox="0 0 180 110" role="img" aria-label="探偵風の長いキセル">
        <path d="M26 32 C25 63 40 78 66 76 L145 56" fill="none" stroke="#27324b" strokeWidth="16" strokeLinecap="round" />
        <path d="M28 34 C29 59 42 68 65 67 L145 48" fill="none" stroke="#b9783f" strokeWidth="9" strokeLinecap="round" />
        <path d="M143 40 Q174 37 167 58 Q160 76 137 63 Z" fill="#d6a85f" stroke="#27324b" strokeWidth="7" />
        <path d="M20 23 Q44 19 42 36 Q38 49 18 43 Z" fill="#d6a85f" stroke="#27324b" strokeWidth="7" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 190 105" role="img" aria-label="小型のスケートボード">
      <path d="M22 26 Q26 17 38 22 C70 33 120 33 153 21 Q170 15 174 29 C164 59 37 64 22 26Z" fill="#f2cf4a" stroke="#27324b" strokeWidth="7" />
      <path d="M50 36 L64 48 M91 37 L103 50 M133 34 L143 46" stroke="#e15e50" strokeWidth="7" strokeLinecap="round" />
      <circle cx="55" cy="69" r="12" fill="#75c8c5" stroke="#27324b" strokeWidth="6" />
      <circle cx="145" cy="66" r="12" fill="#75c8c5" stroke="#27324b" strokeWidth="6" />
    </svg>
  );
}
