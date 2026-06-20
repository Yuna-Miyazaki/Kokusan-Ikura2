export const GAME_BALANCE = {
  damage: {
    minimumSuccess: 550,
    maximumSuccess: 1050,
    maximumSpeed: 2200,
  },
  velocity: {
    sampleCount: 6,
    windowMs: 130,
  },
  persuasion: {
    confessionThreshold: 40,
    kindBonus: 25,
    logicalBonus: 18,
    sternBonusMin: 10,
    sternBonusMax: 30,
  },
  weapons: {
    magnifier: { power: 0.75, label: "虫眼鏡" },
    pipe: { power: 1.0, label: "キセル" },
    skateboard: { power: 1.45, label: "スケートボード" },
  },
} as const;

export type WeaponId = keyof typeof GAME_BALANCE.weapons;
