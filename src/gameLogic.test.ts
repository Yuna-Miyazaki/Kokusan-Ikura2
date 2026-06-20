import { describe, expect, it } from "vitest";
import { calculateDamage, clampRemorse, confessionProbability, generateInitialRemorse, judgeDamage, resolvePersuasion } from "./gameLogic";

describe("ゲームバランス", () => {
  it("速度と武器係数からダメージを計算する", () => {
    expect(calculateDamage(800, 0.75)).toBe(600);
    expect(calculateDamage(800, 1.45)).toBe(1160);
  });

  it("550未満は犯人逃走", () => {
    expect(judgeDamage(549)).toBe("culprit-escaped");
  });

  it("550〜1050は犯人逮捕", () => {
    expect(judgeDamage(550)).toBe("culprit-arrested");
    expect(judgeDamage(1050)).toBe("culprit-arrested");
  });

  it("1050超過は名探偵逮捕", () => {
    expect(judgeDamage(1051)).toBe("detective-arrested");
  });

  it("説得時の反省度を0〜100に収める", () => {
    expect(clampRemorse(-12)).toBe(0);
    expect(clampRemorse(48.4)).toBe(48);
    expect(clampRemorse(125)).toBe(100);
  });

  it("初期反省度は高い値ほど出にくい分布にする", () => {
    expect(generateInitialRemorse(() => 0)).toBe(0);
    expect(generateInitialRemorse(() => 0.5)).toBe(25);
    expect(generateInitialRemorse(() => 0.9999)).toBe(100);
  });

  it("反省度50未満では自白しない", () => {
    expect(confessionProbability(49)).toBe(0);
    expect(resolvePersuasion(49, () => 0)).toBe("culprit-escaped");
  });

  it("自白確率は反省度50で20%、100で100%になる", () => {
    expect(confessionProbability(50)).toBeCloseTo(0.2);
    expect(confessionProbability(75)).toBeCloseTo(0.6);
    expect(confessionProbability(100)).toBe(1);
    expect(resolvePersuasion(50, () => 0.19)).toBe("culprit-arrested");
    expect(resolvePersuasion(50, () => 0.2)).toBe("culprit-escaped");
  });
});
