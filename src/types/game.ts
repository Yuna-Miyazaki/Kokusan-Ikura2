import type { WeaponId } from "../config/gameBalance";

export type Screen = "title" | "action" | "persuasion" | "weapon" | "hit" | "result";
export type Outcome = "detective-arrested" | "culprit-arrested" | "culprit-escaped";
export type PersuasionMethod = "kind" | "logical" | "stern";

export interface HitMetrics {
  route: "hit";
  speed: number;
  weapon: WeaponId;
  power: number;
  damage: number;
}

export interface PersuasionMetrics {
  route: "persuasion";
  initialRemorse: number;
  finalRemorse: number;
  method: PersuasionMethod;
}

export type ResultMetrics = HitMetrics | PersuasionMetrics;

export interface GameResult {
  outcome: Outcome;
  metrics: ResultMetrics;
}
