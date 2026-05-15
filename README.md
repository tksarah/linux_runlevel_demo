# Linux Runlevel Demo

`init` コマンドによる Linux のランレベル遷移を、ブラウザ上で視覚的に学べる静的 Web アプリです。`init 0`、`init 1`、`init 3`、`init 5`、`init 6` を入力すると、想定されるログ、サービス状態、画面イメージの変化をシミュレーションできます。

## Features

- `init 0 / 1 / 3 / 5 / 6` の代表的なランレベルを学習可能
- コマンドショートカットボタンと手入力の両方に対応
- ターミナルログ、サービス状態、画面プレビューを連動表示
- ランレベルごとの説明文をあわせて確認可能
- HTML / CSS / JavaScript だけで動作するビルド不要の構成

## Demo

GitHub Pages で公開する想定の静的サイトです。

- Repository: [https://github.com/tksarah/linux_runlevel_demo](https://github.com/tksarah/linux_runlevel_demo)
- Pages: `https://tksarah.github.io/linux_runlevel_demo/`

## Screens

アプリは次の 4 つの情報を中心に構成されています。

1. コマンド入力エリア
2. 擬似ターミナルログ
3. サービス状態の一覧
4. ランレベルごとの画面プレビューと解説

## Local Development

依存関係のインストールやビルドは不要です。以下のいずれかの方法で確認できます。

### 1. ファイルを直接開く

`index.html` をブラウザで開くだけで動作します。

### 2. ローカルサーバーで確認する

たとえば Python が使える環境なら、プロジェクト直下で次を実行します。

```bash
python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開いてください。

## Usage

1. ショートカットボタンを押すか、入力欄に `init 0` などのコマンドを入力します。
2. `実行する` ボタンまたは Enter キーでシミュレーションを開始します。
3. ターミナルログの変化を見ながら、サービス状態と画面プレビューを確認します。
4. `やり直し` ボタンで同じランレベルの初期表示に戻せます。

## Project Structure

```text
.
├─ index.html   # UI のマークアップ
├─ style.css    # レイアウトと見た目
├─ app.js       # ランレベルごとのデータと画面制御
└─ .github/workflows/static.yml  # GitHub Pages デプロイ
```

## Deployment

`main` ブランチへの push をトリガーに、GitHub Actions から GitHub Pages へ静的コンテンツをデプロイする設定になっています。

- Workflow: `.github/workflows/static.yml`
- 対象ブランチ: `main`
- 配布物: リポジトリ全体

## Notes

- このアプリは学習用のシミュレーターであり、実際の OS のランレベル変更を行うものではありません。
- 現代の Linux では `systemd` が主流ですが、本アプリでは理解しやすいように従来の `init` ベースの概念で表現しています。
