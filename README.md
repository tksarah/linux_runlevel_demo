# Linux Runlevel Demo

Linux の runlevel と systemd target をブラウザ上で学ぶための静的 Web アプリです。

STEP 0 では、Linux 起動前に表示される GRUB2 メニューから編集モードへ入り、`linux` 行の末尾に `systemd.unit=...` で systemd target を追加して起動する流れを体験できます。STEP 1 以降では、Linux が起動している状態を前提に `init` または `systemctl` コマンドで runlevel 相当の状態へ変更した時のログ、サービス状態、画面イメージを確認できます。

## Features

- GRUB2 メニューで `e` を押し、編集モードで target 指定を手動入力する流れを学習
- 対象 target: `rescue.target`, `emergency.target`, `multi-user.target`, `graphical.target`
- `Ctrl + X` または `F10` で起動する操作イメージをログ付きで表示
- target 指定の記述が違う場合は「その記述では起動できません」と表示
- `init 0 / 1 / 3 / 5 / 6` と対応する `systemctl` コマンドの代表的な遷移を学習
- terminal ログ、サービス状態、画面プレビュー、解説を連動表示
- HTML / CSS / JavaScript だけで動作するビルド不要の構成

## Demo

GitHub Pages で公開する想定の静的サイトです。

- Repository: [https://github.com/tksarah/linux_runlevel_demo](https://github.com/tksarah/linux_runlevel_demo)
- Pages: `https://tksarah.github.io/linux_runlevel_demo/`

## Screens

アプリは次の学習領域で構成されています。

1. GRUB2 から systemd target を指定して起動する STEP 0
2. 起動済み Linux 上で `init` または `systemctl` コマンドを入力する STEP 1
3. 起動ログの確認
4. サービス状態と画面プレビューの確認
5. runlevel / target の簡単な解説

## Local Development

依存関係のインストールやビルドは不要です。

### 1. ファイルを直接開く

`index.html` をブラウザで開くだけで動作します。

### 2. ローカルサーバーで確認する

Python が使える環境なら、プロジェクト直下で次を実行します。

```bash
python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開きます。

## Usage

1. STEP 0 の初期状態で GRUB メニューを確認し、`e を押して編集` を押します。
2. `linux` 行末へ追加する文字列として `systemd.unit=rescue.target` などを手動入力します。
3. `Ctrl + X / F10 で起動` を押すか、入力欄で `Ctrl + X`、`F10`、Enter のいずれかを押して起動します。
4. STEP 1 で `init 0` や `systemctl poweroff` などを選ぶか、端末欄へ直接入力します。
5. `実行する` ボタンまたは Enter キーでシミュレーションを開始し、ログと画面変化を確認します。

## STEP 1 systemctl 対応表

| runlevel | init コマンド | systemctl コマンド |
| --- | --- | --- |
| 0 相当 | `init 0` | `systemctl poweroff` |
| 1 相当 | `init 1` | `systemctl rescue` |
| 3 相当 | `init 3` | `systemctl isolate multi-user.target` |
| 5 相当 | `init 5` | `systemctl isolate graphical.target` |
| 6 相当 | `init 6` | `systemctl reboot` |

## Project Structure

```text
.
├── index.html   # UI のマークアップ
├── style.css    # レイアウトと見た目
├── app.js       # target / runlevel データと画面制御
└── .github/workflows/static.yml  # GitHub Pages デプロイ
```

## Notes

- このアプリは学習用シミュレータであり、実際の OS の起動設定や runlevel を変更するものではありません。
- 現在の Linux では systemd target が主流ですが、runlevel との対応関係も理解しやすいように併記しています。
