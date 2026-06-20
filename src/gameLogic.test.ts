import { describe, expect, it } from "vitest";
import { calculateDamage, clampRemorse, judgeDamage } from "./gameLogic";

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
});
