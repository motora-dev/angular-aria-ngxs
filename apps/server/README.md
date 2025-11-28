# @monorepo/server

NestJS + esbuild + Vitest による高速開発環境を備えたサーバーアプリケーションです。

## 概要

このサーバーは以下の技術スタックで構築されています：

- **NestJS** - スケーラブルな Node.js フレームワーク
- **esbuild** - 超高速 JavaScript バンドラー
- **SWC** - Rust 製の超高速 TypeScript/JavaScript コンパイラ
- **Vitest** - Vite ベースの高速テストフレームワーク
- **Prisma** - 型安全な ORM

## ビルドシステム（esbuild + SWC）

### なぜ esbuild を使うのか

従来の NestJS プロジェクトでは `tsc`（TypeScript コンパイラ）を使用していましたが、以下の問題がありました：

1. **ビルド速度が遅い** - プロジェクトが大きくなるとビルドに数十秒かかる
2. **ESModule 環境でのパス解決問題** - `$domains/*` などのパスエイリアスが解決できない
3. **Prisma クライアントの問題** - Prisma 7.x 以降の ESModule 形式クライアントを正しく処理できない

esbuild を使用することで、これらすべての問題を解決しています。

### SWC プラグインによるデコレーターサポート

NestJS は TypeScript のデコレーターを多用しますが、esbuild 単体ではデコレーターメタデータ（`emitDecoratorMetadata`）をサポートしていません。

そこで、SWC を esbuild のプラグインとして使用し、デコレーターを正しく変換しています：

```javascript
// esbuild.config.mjs より抜粋
function swcPlugin() {
  return {
    name: 'swc-decorator',
    setup(build) {
      build.onLoad({ filter: /\.ts$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        const result = await swc.transform(source, {
          jsc: {
            parser: { syntax: 'typescript', decorators: true },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true, // ここがポイント
            },
          },
        });
        return { contents: result.code, loader: 'js' };
      });
    },
  };
}
```

### ホットリロード対応の開発サーバー

`--watch` フラグを付けてビルドすると、ファイル変更を検知して自動的にリビルド＆サーバー再起動が行われます：

```bash
# 開発サーバーを起動（ホットリロード + デバッガー）
pnpm start
```

### デバッガー対応

`--debug` フラグを使用すると、Node.js のインスペクターがポート 9229 で起動します。VS Code などの IDE からアタッチしてデバッグできます。

## テスト環境（Vitest + SWC）

### なぜ Vitest を使うのか

Jest と比較して以下の利点があります：

1. **高速な起動** - ESModule ネイティブで起動が速い
2. **SWC によるトランスパイル** - テストファイルの変換が高速
3. **Vite エコシステムとの統合** - 設定の共通化が可能

### テストの種類

テストは 2 種類に分離されています：

| テスト種別     | ファイルパターン | 説明                   |
| -------------- | ---------------- | ---------------------- |
| ユニットテスト | `*.test.ts`      | 単体機能のテスト       |
| E2E テスト     | `*.spec.ts`      | エンドツーエンドテスト |

### SWC による高速トランスパイル

Vitest でも SWC を使用してデコレーターを変換しています：

```typescript
// vitest.config.ts より抜粋
const swcPlugin = swc.vite({
  jsc: {
    parser: { syntax: 'typescript', decorators: true },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
    },
  },
});
```

### V8 カバレッジ

V8 エンジンのネイティブカバレッジ機能を使用しており、高速にカバレッジレポートを生成できます：

```bash
# カバレッジ付きでテスト実行
pnpm test:coverage
```

## 開発体験の改善

### ビルド・テストの劇的な高速化

| 項目           | 従来（tsc + Jest） | 現在（esbuild + Vitest） | 改善率        |
| -------------- | ------------------ | ------------------------ | ------------- |
| ビルド         | 20〜30 秒          | **200〜500 ミリ秒**      | 約 50〜100 倍 |
| テスト起動     | 5〜10 秒           | **500 ミリ秒〜1 秒**     | 約 10〜20 倍  |
| ホットリロード | 非対応             | **対応**                 | -             |

この高速化により、開発中のフィードバックループが劇的に短縮され、開発体験が大幅に向上しています。

## Prisma ESModule 対応

### 背景

Prisma 7.x 以降、`@prisma/client` は ESModule として提供されるようになりました。これは Node.js の ESModule 移行に対応するための変更です。

### `type: "module"` 環境での注意点

このプロジェクトは `"type": "module"` を指定しており、すべてのファイルが ESModule として扱われます。これに伴い、以下の対応が必要でした：

1. **esbuild の使用が必須** - `tsc`（TypeScript コンパイラ）や SWC では ESModule 環境でのパス解決やバンドルができない
2. **`format: 'esm'` の指定** - esbuild の出力形式を ESModule に設定
3. **`reflect-metadata` のインポート** - バナーで先頭にインポート文を追加

```javascript
// esbuild.config.mjs より
const config = {
  format: 'esm',
  banner: {
    js: "import 'reflect-metadata';",
  },
};
```

### Prisma クライアントの配置

Prisma クライアントは `packages/database` パッケージで管理され、モノレポ内で共有されています：

```
packages/database/
├── prisma/
│   └── schema.prisma       # スキーマ定義
└── src/
    └── generated/
        └── prisma-client/  # 生成されたクライアント
```

## アーキテクチャ

このプロジェクトは **Vertical Slice Architecture** と **Clean Architecture（CQRS）** を組み合わせた設計を採用しています。

### Vertical Slice Architecture

機能（ドメイン）ごとにコードを垂直に分割し、各スライスが独立して開発・テスト可能な構造です。

- **凝集度が高い** - 関連するコードが同じディレクトリにまとまる
- **変更の影響範囲が限定的** - 機能追加・修正が他のドメインに影響しにくい
- **スケーラブル** - チームやマイクロサービスへの分割が容易

#### 設計方針とトレードオフ

各ドメインの**境界（コンテキスト）を明確化**することで、関心ごとの分離とコードの認知しやすさの向上を図っています。

一方で、このアプローチでは**共通処理がドメインごとに重複する**ことがあります。これは意図的なトレードオフであり、ドメイン間の結合度を下げることを優先しています。

#### shared と modules の使い分け

| 配置場所   | 用途                                                                  | 例                         |
| ---------- | --------------------------------------------------------------------- | -------------------------- |
| `shared/`  | インフラ層のアダプター、純粋なユーティリティ                          | Prisma アダプター、ロガー  |
| `modules/` | Repository を使う共通処理、複数ドメインから参照されるビジネスロジック | ユーザー認証、権限チェック |

`shared/` では共通化が難しい **Repository を使うような処理**（例：ユーザー認証、アクセス制御など）は、`modules/` フォルダを作成して各ドメインから参照する形を取ります。

#### ESLint による依存関係チェック

アーキテクチャの依存ルールは `eslint-plugin-boundaries` で自動チェックされます。

```
domains/ ──参照可→ modules/ ──参照可→ shared/
    │                 │
    └──参照可─────────┘

※ 逆方向の参照は禁止
```

| 参照元     | domains | modules | shared |
| ---------- | ------- | ------- | ------ |
| `domains/` | -       | ✅      | ✅     |
| `modules/` | ❌      | -       | ✅     |
| `shared/`  | ❌      | ❌      | -      |

これにより、依存関係の逆転を防ぎ、アーキテクチャの整合性を維持しています。

### Clean Architecture + CQRS

NestJS の `@nestjs/cqrs` パッケージを使用し、コマンド（書き込み）とクエリ（読み取り）を分離しています。

- **queries/** - 読み取り専用の処理（Query + Handler）
- **commands/** - 書き込み処理（Command + Handler）※必要に応じて追加
- **repositories/** - データアクセス層の抽象化
- **services/** - ドメインロジック

## ディレクトリ構成

```
src/
├── main.ts                 # エントリーポイント
├── app.module.ts           # ルートモジュール
├── domains/                # ドメイン層（Vertical Slice）
│   └── user/               # User ドメイン
│       ├── dto/            # データ転送オブジェクト
│       ├── queries/        # CQRS クエリハンドラー
│       ├── repositories/   # リポジトリ（データアクセス抽象化）
│       ├── services/       # ドメインサービス
│       ├── user.controller.ts
│       └── user.module.ts  # ドメインモジュール定義
├── modules/                # 共通モジュール（Repository を使う処理）
│   └── auth/               # 認証モジュール（例）
│       ├── auth.module.ts
│       ├── auth.service.ts
│       └── auth.guard.ts
└── shared/                 # 共有コンポーネント（純粋なインフラ層）
    └── adapters/
        └── prisma/         # Prisma アダプター
```

### 新しいドメインの追加方法

新しいドメイン（例: `product`）を追加する場合：

```
src/domains/product/
├── dto/
│   └── get-product.dto.ts
├── queries/
│   └── get-product/
│       ├── get-product.query.ts
│       └── get-product.handler.ts
├── repositories/
│   └── product.repository.ts
├── services/
│   └── product.service.ts
├── product.controller.ts
└── product.module.ts
```

## 参考資料

- [esbuild](https://esbuild.github.io/)
- [SWC](https://swc.rs/)
- [Vitest](https://vitest.dev/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
