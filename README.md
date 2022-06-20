# このリポジトリについて
miroボードの付箋内容をAsanaタスクに同期作成するGoogle Apps Scrpit(以下GAS)です。

## 動作イメージ

1. miroに付箋を作成。
2. GASを実行。
3. Asana側にmiroの"付箋内容"と"URL"を記録したタスクを作成。
4. miroの付箋に作成したAsanaタスクのURLを追記。

![demo]("./img/DEMO.gif")

## 事前準備

miroのAPIとAsanaのAPIが必要になります。

- miro
  - 参考: [miro REST API Quickstart](https://developers.miro.com/docs/rest-api-build-your-first-hello-world-app)
    - 必要なスコープは「boards:read」と「boards:write」です。
- Asana
  - 参考: [Asana API Guide](https://asana.com/ja/guide/help/api/api)
    - [Asanaのデベロッパーコンソール](https://app.asana.com/0/my-apps)から"個人アクセストークン" を発行すれば良いです。

## 利用方法(手動でデプロイする場合)

1. 任意のGAS環境を用意する。
2. 本リポジトリのscriptsフォルダ配下のものを手動でコピペしてください。
   - 手動でコピペする場合は「appsscript.json」は不要なので無視してください。
   - コピペ対象は複数ファイルあるので後述するClaspによるデプロイのほうがラクです。
3. GASを開く。
4. スクリプトプロパティに下記のように保管する。
   - ![img]("./img/script_property_img.png ")
   - ※GASの共有者は必要最小限にしてください。
     - 下記で設定するTokenが参照可能になってしまうためです。
   - asana_api_token
     - 事前準備で準備したAsanaのAPI Token。
   - miro_api_token
     - 事前準備で準備したmiroのAPI Token。
5. 「main」関数を実行してmiroの付箋をAsanaに同期する。

## 利用方法(Claspを利用してデプロイする場合)

※Clasp環境の準備は割愛します。まだ準備していない方は[こちら](https://github.com/google/clasp)を参考に準備ください。

1. `clasp login --no-localhost` を実行して画面の指示に従い認証処理をする。
2. ローカル環境で任意のフォルダを作成し、そのフォルダに移動後、`clasp create` を実行。
   - 表示される選択肢は「standalone」を選択する。
3. 本リポジトリのscriptsフォルダ配下のファイルを上記で作成したフォルダに上書き保存する。
   - 「appsscript.json」が上書き対象になる想定です。
4. `clasp push` コマンドでGASにデプロイ。
   - `Manifest file has been updated. Do you want to push and overwrite?` と聞かれた場合は`y`を選択。
5. `clasp open` でデプロイしたGASを開く。
6. スクリプトプロパティに下記のように保管する。
   - ![img]("./img/script_property_img.png ")
   - ※GASの共有者は必要最小限にしてください。
     - 下記で設定するTokenが参照可能になってしまうためです。
   - asana_api_token
     - 事前準備で準備したAsanaのAPI Token。
   - miro_api_token
     - 事前準備で準備したmiroのAPI Token。
7. 「main」関数を実行してmiroの付箋をAsanaに同期する。

## 定期実行する場合

- トリガーで任意の時間で定期実行してください。
- 設定方法は["GAS トリガー"](https://www.google.com/search?q=GAS+%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC&oq=GAS+%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC&aqs=chrome..69i57j69i59j0i512l3j69i60l3.3238j0j4&sourceid=chrome&ie=UTF-8) といった形でググればわかりやすい手順は多数あるので割愛します。