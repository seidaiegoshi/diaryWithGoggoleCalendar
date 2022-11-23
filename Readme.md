# google カレンダーと連携して日記を書きたい

https://seidaiegoshi.github.io/diaryWithGoggoleCalendar/

## 使い方

- GAPI で API キーと認証コードを取得
- google カレンダーカレンダーを新規に 1 つ作る。すでに日記用とかあればそれで OK。
- カレンダー ID を取得する。

## 参考

- GCI
  https://console.cloud.google.com/welcome

- API
  https://developers.google.com/calendar/api

- カレンダー
  https://qiita.com/kan_dai/items/b1850750b883f83b9bee

- 日付・時間
  https://www.tohoho-web.com/js/date.htm

- T で時間を区切るらしい T で split すれば日付一致ができそう
  https://ja.wikipedia.org/wiki/ISO_8601

- オブジェクト配列の検索
  https://www.techiedelight.com/ja/find-value-array-objects-javascript/

- カレンダーの更新
  https://developers.google.com/calendar/api/v3/reference/events/update?apix=true#try-it
