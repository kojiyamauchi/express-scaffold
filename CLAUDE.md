# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Express ScaffoldはExpress.js、MySQL、Prisma ORM、TypeScript、Sassを使用したフルスタック開発テンプレートです。MonorepoアーキテクチャでYarn Workspacesによって管理されています。

## アーキテクチャ構造

```
express-scaffold/
├── apps/                 # サーバーサイドアプリケーション（Express.js）
│   ├── resource/
│   │   ├── controllers/  # ルートハンドラー
│   │   ├── models/      # データモデル
│   │   ├── routes/      # ルーティング設定
│   │   ├── views/       # EJSテンプレート
│   │   ├── prisma/      # Prisma設定とマイグレーション
│   │   └── libs/        # MySQLとPrismaクライアント
│   └── package.json     # サーバー依存関係
├── client/              # フロントエンド資産（CSS/JS）
│   ├── resource/        # Sass、TypeScriptファイル
│   └── gulpfile.mjs     # Gulpビルドプロセス
└── delivery/            # 本番用静的ファイル
```

## 開発コマンド

### 基本コマンド

- `make ssl` - HTTPS証明書を生成
- `make build` - クライアント資産をビルドしてDockerイメージを構築
- `make up` - 開発環境を起動（Express + MySQL）
- `make stop` - コンテナを停止
- `make down` - コンテナを停止し削除

### Yarn Workspaceコマンド

- `yarn dev` - 両ワークスペースの開発サーバーを並行起動
- `yarn build` - 両ワークスペースをビルド
- `yarn clean` - ビルドファイルをクリーンアップ
- `yarn dev:apps` - Expressサーバーのみを開発モードで起動
- `yarn dev:client` - Gulpウォッチタスクを起動

### リンティングとテスト

- `yarn lint:apps` - サーバーサイドESLint
- `yarn lint:client` - クライアントサイドESLint
- `yarn stylelint` - Sass/SCSSのスタイルリント
- `yarn typecheck:apps` - サーバーサイドTypeScript型チェック
- `yarn typecheck:client` - クライアントサイドTypeScript型チェック
- `yarn jest:apps` - サーバーサイドテスト
- `yarn jest:client` - クライアントサイドテスト
- `yarn spellcheck` - スペルチェック

### Prisma操作

- `yarn prisma:generate` - Prismaクライアントを生成
- `yarn prisma:migrate:dev` - 開発環境でマイグレーション実行
- `yarn prisma:migrate:reset` - データベースをリセット
- `yarn prisma:seed` - シードデータを投入
- `yarn prisma:studio` - Prisma Studioを起動
- `yarn prisma:validate` - スキーマを検証

## データベース設計

Prismaスキーマ（`apps/resource/prisma/schema.prisma`）には以下のモデルが定義されています：

- `User` - ユーザー情報（name, url, phone, email）
- `Item` - 商品情報（product_name, price）
- `Order` - 注文情報（userId, order_date, total_price）
- `OrderItem` - 注文商品の中間テーブル（order_id, item_id, quantity）

## 技術スタック

### バックエンド

- Express.js 5.x（TypeScript）
- MySQL 8.1
- Prisma ORM
- EJSテンプレートエンジン
- Express Session、Cookie Parser

### フロントエンド

- TypeScript
- Sass/SCSS
- Gulp（ビルドツール）
- Webpack（バンドル）
- Browser Sync（ライブリロード）

### 開発ツール

- ESLint + Prettier（コードフォーマット）
- Jest（テスト）
- Husky（Gitフック）
- Docker Compose（開発環境）

## 開発環境

Docker Composeによる開発環境：

- Express Server: `https://localhost:3000`
- MySQL Database: `https://localhost:3306`
- Browser Sync: `https://localhost:8000`
- Browser Sync UI: `http://localhost:9999`

## 重要なパス

- サーバーサイドエントリーポイント: `apps/resource/serve.ts`
- ルート定義: `apps/resource/routes/index.ts`
- コントローラー: `apps/resource/controllers/index.ts`
- フロントエンドビルド設定: `client/gulpfile.mjs`
- Webpack設定: `client/webpack/webpack.*.mjs`

## 注意事項

- Package Manager: Yarn 4.6.0を使用（npmは使用不可）
- このプロジェクトはHTTPS必須のため、開発前に`make ssl`を実行
- 新しい機能を追加する際は、既存のコード規約に従うこと
- Prismaスキーマ変更時は必ずマイグレーションを作成
- 静的ファイルは`delivery/`ディレクトリに出力される
