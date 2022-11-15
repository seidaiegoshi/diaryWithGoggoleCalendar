# google カレンダーと連携して日記を書きたい

## TODO

できるところまですすめる。

- [x] google カレンダー API と連携
- [x] google カレンダーの情報をとってくる
- [x] google カレンダーに書き込みする
- [x] カレンダーを作る
- [x] カレンダーから日付を選択して書き込み
- [ ] カレンダーをクリックして過去の日記をみれるようにする
  - [x] カレンダー表示するときに、その月のデータをとってきて、
  - [x] カレンダーの日付をクリックして日付検索で その日の日記の ID をとってくる。
  - [x] 登録ボタンをおしたとき、更新なら、更新処理を。新規なら新規でイベントを追加する。
- [ ] カレンダーでいつ日記をかいたかわかるようにする。
- [ ] 以前作ったタグ日記と合体させる

## 参考

API
https://developers.google.com/calendar/api
カレンダー
https://qiita.com/kan_dai/items/b1850750b883f83b9bee
日付・時間
https://www.tohoho-web.com/js/date.htm
T で時間を区切るらしい T で split すれば日付一致ができそう
https://ja.wikipedia.org/wiki/ISO_8601
オブジェクト配列の検索
https://www.techiedelight.com/ja/find-value-array-objects-javascript/
カレンダーの更新
https://developers.google.com/calendar/api/v3/reference/events/update?apix=true#try-it
