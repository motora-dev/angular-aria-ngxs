# angular-ngxs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21.0.0-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![NGXS](https://img.shields.io/badge/NGXS-20.1.0-3B99FC?logo=redux&logoColor=white)](https://www.ngxs.io/)
[![NestJS](https://img.shields.io/badge/NestJS-11.1.9-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Storybook](https://img.shields.io/badge/Storybook-10.1.2-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org/)
[![RxAngular](https://img.shields.io/badge/RxAngular-20.1.0-B7178C?logo=reactivex&logoColor=white)](https://www.rx-angular.io/)
[![esbuild](https://img.shields.io/badge/esbuild-0.27.0-FFCF00?logo=esbuild&logoColor=white)](https://esbuild.github.io/)
[![ESLint](https://img.shields.io/badge/ESLint-9.39.1-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![husky](https://img.shields.io/badge/husky-9.1.7-42B983?logo=git&logoColor=white)](https://typicode.github.io/husky/)
[![lint-staged](https://img.shields.io/badge/lint--staged-16.2.7-F05032?logo=git&logoColor=white)](https://github.com/lint-staged/lint-staged)
[![Node.js](https://img.shields.io/badge/Node.js-24.11.1-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.24.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Prettier](https://img.shields.io/badge/Prettier-3.7.1-F7B93E?logo=prettier&logoColor=white)](https://prettier.io/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SWC](https://img.shields.io/badge/SWC-1.15.3-F8C457?logo=swc&logoColor=white)](https://swc.rs/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.6.1-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.0.14-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

Angular + NestJS + NGXS を使用したフルスタックモノレポテンプレートです。

## 特徴

### フロントエンド (Angular)

- **Angular 21** - 最新の Angular フレームワーク
- **Angular SSR** - サーバーサイドレンダリング対応
- **NGXS** - シンプルで型安全な状態管理
- **Angular ARIA/CDK** - アクセシビリティ対応コンポーネント
- **Tailwind CSS 4** - ユーティリティファースト CSS
- **Storybook** - UI コンポーネントカタログ
- **RxAngular** - 高性能リアクティブユーティリティ
- **Vitest** - 高速なユニットテスト

### バックエンド (NestJS)

- **NestJS 11** - スケーラブルなサーバーサイドフレームワーク
- **esbuild + SWC** - デコレーターに対応した超高速ビルド
- **CQRS** - コマンドクエリ責務分離パターン
- **Prisma 7** - ESModule 対応の型安全な ORM
- **Vitest** - SWC を使った高速なユニット/E2E テスト

### 共通

- **Turborepo** - 高速なビルドシステムとキャッシング
- **pnpm Catalogs** - 依存関係のバージョンを一元管理
- **ESLint Flat Config** - 最新の ESLint 設定形式
- **共有設定パッケージ** - ESLint・TypeScript 設定を共通化
- **GitHub Actions CI** - 自動テスト・ビルド

## プロジェクト構成

```
angular-aria-ngxs/
├── apps/
│   ├── client/             # Angular クライアント (SSR対応)
│   └── server/             # NestJS サーバー
├── packages/
│   ├── database/           # Prisma データベース設定
│   ├── eslint-config/      # 共有 ESLint 設定
│   └── typescript-config/  # 共有 TypeScript 設定
├── turbo.json              # Turborepo 設定
└── pnpm-workspace.yaml     # pnpm ワークスペース設定
```

## 技術的な背景

### Angular + NGXS の選定理由

Angular は強力な型システムと DI（依存性注入）を備えた本格的なフレームワークです。NGXS は Redux パターンをシンプルに実装でき、TypeScript のデコレーターを活用した直感的な API を提供します。

RxAngular を組み合わせることで、Zone.js に依存しない高性能なリアクティブ処理が可能になります。

### Prisma の ESModule 対応

Prisma 7.x 以降、`@prisma/client` は ESModule として提供されるようになりました。これにより、`"type": "module"` を指定した Node.js プロジェクトでネイティブに動作します。

### esbuild を使う理由

従来の `tsc`（TypeScript コンパイラ）では、ESModule 環境での以下の問題がありました：

- **パスエイリアスの解決不可** - `$domains/*` などのカスタムパスが解決できない
- **Prisma クライアントのインポート問題** - ESModule 形式の Prisma クライアントを正しくバンドルできない

esbuild を使用することで、これらの問題を解決しつつ、ビルド速度が劇的に向上しました。

### 開発体験の向上

| 項目           | 従来（tsc + Jest） | 現在（esbuild + Vitest） |
| -------------- | ------------------ | ------------------------ |
| ビルド         | 数十秒             | **数百ミリ秒**           |
| テスト         | 数秒〜数十秒       | **数百ミリ秒〜数秒**     |
| ホットリロード | なし               | **対応**                 |

ビルドとテストが劇的に高速化され、開発体験が大幅に向上しています。

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/motora-dev/angular-aria-ngxs.git
cd angular-aria-ngxs

# 依存関係をインストール
pnpm install

# すべてのチェックを実行
pnpm check-all
```

## コマンド一覧

### ルートコマンド

| コマンド             | 説明                            |
| -------------------- | ------------------------------- |
| `pnpm build`         | すべてのパッケージをビルド      |
| `pnpm start`         | 開発サーバーを起動              |
| `pnpm check-all`     | lint, format, tsc, test を実行  |
| `pnpm lint`          | ESLint を実行                   |
| `pnpm lint:fix`      | ESLint で自動修正               |
| `pnpm format`        | Prettier でフォーマットチェック |
| `pnpm format:fix`    | Prettier で自動フォーマット     |
| `pnpm tsc`           | TypeScript 型チェック           |
| `pnpm test`          | テストを実行                    |
| `pnpm test:coverage` | カバレッジ付きテスト            |
| `pnpm clean`         | ビルド成果物を削除              |

### クライアント固有コマンド

| コマンド                                          | 説明                         |
| ------------------------------------------------- | ---------------------------- |
| `pnpm --filter @monorepo/client storybook`        | Storybook を起動             |
| `pnpm --filter @monorepo/client build-storybook`  | Storybook をビルド           |
| `pnpm --filter @monorepo/client serve:ssr:client` | SSR サーバーを起動           |
| `pnpm --filter @monorepo/client test:watch`       | テストをウォッチモードで実行 |

### サーバー固有コマンド

| コマンド                                   | 説明                 |
| ------------------------------------------ | -------------------- |
| `pnpm --filter @monorepo/server start:prd` | 本番サーバーを起動   |
| `pnpm --filter @monorepo/server test:unit` | ユニットテストを実行 |
| `pnpm --filter @monorepo/server test:e2e`  | E2E テストを実行     |

## 注意事項

### pnpm-workspace.yaml の YAML アンカー名

`pnpm-workspace.yaml` で YAML アンカーを使用する場合、アンカー名に `@` 記号を含めると Turborepo が正しく動作しません。

```yaml
# ❌ ダメ
versions:
  '@types/jest': &@types/jest 30.0.0

# ✅ OK
versions:
  '@types/jest': &types-jest 30.0.0
```

## ライセンス

[MIT](LICENSE)
