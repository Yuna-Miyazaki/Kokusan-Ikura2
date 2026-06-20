# 名探偵の力加減！

説得またはコミカルな「ポコン！」で事件解決を目指す、Google Chrome向けの2Dミニゲームです。血や傷などの写実的な表現はありません。

## 起動方法

Node.js 20.19以降と Python 3.10以降を用意してください。

```bash
npm install
npm run build
python main.py
```

Chromeで `http://127.0.0.1:8000` を開きます。開発中は `npm run dev` でも起動できます。

## ルール

- 説得：3つの方法から1つを選びます。補正後の反省度が40未満なら逃走、40以上なら「反省度 ÷ 100」の確率で自白します。
- 殴る：虫眼鏡・キセル・スケートボードから選び、武器を犯人の黒い頭へドラッグします。
- 衝突直前130ms・最大6点のPointer Events履歴から速度を計測します。
- ダメージは `速度(px/s) × 武器係数`。550未満は逃走、550〜1050は犯人逮捕、1050超過は名探偵逮捕です。

`http://127.0.0.1:8000/?debug=true` では、速度・係数・予測ダメージ・当たり判定・境界値を表示します。

## バランス調整

すべての調整値は `src/config/gameBalance.ts` にあります。

- `damage.minimumSuccess` / `damage.maximumSuccess`: 成功ダメージ範囲
- `damage.maximumSpeed`: 速度上限
- `velocity.sampleCount` / `velocity.windowMs`: 速度計測方法
- `persuasion`: 反省度のしきい値と各補正
- `weapons`: 3武器の威力係数

## テスト

```bash
npm test
npm run build
```

## 使用ライブラリ

ブラウザ側は React、React DOM、Vite、TypeScript、Vitest、jsdomを使用します。正確なバージョンは `package.json` と `pnpm-lock.yaml` を参照してください。Python側は標準ライブラリのみで、外部依存はありません。
