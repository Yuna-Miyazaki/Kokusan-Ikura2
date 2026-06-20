import { GAME_BALANCE, type WeaponId } from "./config/gameBalance";
import type { Outcome, PersuasionMethod } from "./types/game";

export function calculateDamage(speed: number, weaponPower: number): number {
  return Math.round(Math.max(0, speed) * weaponPower);
}

export function judgeDamage(damage: number): Outcome {
  if (damage < GAME_BALANCE.damage.minimumSuccess) return "culprit-escaped";
  if (damage <= GAME_BALANCE.damage.maximumSuccess) return "culprit-arrested";
  return "detective-arrested";
}

export function clampRemorse(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function randomIntInclusive(minimum: number, maximum: number, random = Math.random): number {
  return Math.floor(random() * (maximum - minimum + 1)) + minimum;
}

export function getPersuasionBonus(method: PersuasionMethod, random = Math.random): number {
  const settings = GAME_BALANCE.persuasion;
  if (method === "kind") return settings.kindBonus;
  if (method === "logical") return settings.logicalBonus;
  return randomIntInclusive(settings.sternBonusMin, settings.sternBonusMax, random);
}

export function resolvePersuasion(finalRemorse: number, random = Math.random): Outcome {
  if (finalRemorse < GAME_BALANCE.persuasion.confessionThreshold) return "culprit-escaped";
  return random() < finalRemorse / 100 ? "culprit-arrested" : "culprit-escaped";
}

export function weaponPower(weapon: WeaponId): number {
  return GAME_BALANCE.weapons[weapon].power;
}
