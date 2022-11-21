const weeks = ["日", "月", "火", "水", "木", "金", "土"];
const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;

function showCalendar(year, month) {
	const calendarHtml = createCalendar(year, month);
	$("#calendar").html(calendarHtml);

	month++;
	if (month > 12) {
		year++;
		month = 1;
	}
}

function createCalendar(year, month) {
	const startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
	const endDate = new Date(year, month, 0); // 月の最後の日を取得
	const endDayCount = endDate.getDate(); // 月の末日
	const lastMonthEndDate = new Date(year, month - 1, 0); // 前月の最後の日の情報
	const lastMonthendDayCount = lastMonthEndDate.getDate(); // 前月の末日
	const startDay = startDate.getDay(); // 月の最初の日の曜日を取得
	let dayCount = 1; // 日にちのカウント
	let calendarHtml = ""; // HTMLを組み立てる変数

	// calendarHtml += "<h1>" + year + "/" + month + "</h1>";
	$("#year").text(year);
	$("#month").text(month);
	calendarHtml += "<table>";

	// 曜日の行を作成
	for (let i = 0; i < weeks.length; i++) {
		calendarHtml += "<td class='weeks' >" + weeks[i] + "</td>";
	}

	for (let w = 0; w < 6; w++) {
		calendarHtml += "<tr>";

		for (let d = 0; d < 7; d++) {
			if (w == 0 && d < startDay) {
				// 1行目で1日の曜日の前
				let num = lastMonthendDayCount - startDay + d + 1;
				calendarHtml += `<td class="calendarTd isDisabled" data-date="${month == 1 ? year - 1 : year}/${
					month == 1 ? 12 : month - 1
				}/${num}">${num}</td>`;
			} else if (dayCount > endDayCount) {
				// 末尾の日数を超えた
				let num = dayCount - endDayCount;
				calendarHtml += `<td class="calendarTd isDisabled" data-date="${month == 12 ? year + 1 : year}/${
					month == 12 ? 1 : month + 1
				}/${num}">${num}</td>`;
				dayCount++;
			} else {
				if (year == date.getFullYear() && month == date.getMonth() + 1 && dayCount == date.getDate()) {
					// 今日にマークをつける
					calendarHtml += `<td class="calendarTd isToday" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
				} else {
					calendarHtml += `<td class="calendarTd" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
				}
				dayCount++;
			}
		}
		calendarHtml += "</tr>";
	}
	calendarHtml += "</table>";

	return calendarHtml;
}

function getThisMonthDayEnd(yy, mm) {
	const endDate = new Date(yy, mm, 0); // 月の最後の日を取得
	const endDayCount = endDate.getDate(); // 月の末日
	return yy + "/" + mm + "/" + endDayCount;
}
function getThisMonthDayFirst(yy, mm) {
	return yy + "/" + mm + "/1";
}

function moveCalendar(e) {
	//カレンダー消す
	document.querySelector("#calendar").innerHTML = "";

	if (e.target.id === "calendarPre") {
		month--;
		if (month < 1) {
			year--;
			month = 12;
		}
	}

	if (e.target.id === "calendarNext") {
		month++;
		if (month > 12) {
			year++;
			month = 1;
		}
	}

	//表示した月のデータとってくる。
	getThisMonthEvents(getThisMonthDayFirst(year, month), getThisMonthDayEnd(year, month));

	//カレンダー作る
	showCalendar(year, month);
}

// 最初に実行
showCalendar(year, month);
$("#date").text(`${year}/${month}/${date.getDate()}`);

// 前の月ボタンクリック時
$("#calendarPre").on("click", (e) => {
	moveCalendar(e);
});
// 次の月ボタン
$("#calendarNext").on("click", (e) => {
	moveCalendar(e);
});

// カレンダーをクリックしたとき。
$(document).on("click", (e) => {
	if (e.target.classList.contains("calendarTd")) {
		// カレンダー上でクリックした場合

		// TODO 記入途中だったらきえるけどいい？の確認
		isEventId = "";
		$("#title").val("日記");
		$("#detail").val("");

		// console.log(e.target.dataset.date);
		// console.log(e.target);
		calendarDate = e.target.dataset.date;
		$("#date").text(e.target.dataset.date);

		calendarDate = calendarDate.replace(/\//g, "-");
		// console.log(thisMonthEvents);
		// console.log(thisMonthEvents[0].start.date);
		// console.log(thisMonthEvents[0].start.date?.split(/T/)[0]);
		// console.log(thisMonthEvents[0].start.dateTime?.split(/T/)[0]);
		// console.log(calendarDate);

		thisMonthEvents.forEach((event, i) => {
			if (
				event.start.date?.split(/T/)[0] == calendarDate ||
				event.start.dateTime?.split(/T/)[0] == calendarDate
			) {
				$("#title").val(event.summary);
				$("#detail").val(event.description);
				isEventId = event.id;
				//IDで既存のイベントを持ってきて、メモに反映する処理
			}
		});
	}
});

const addClassToCalenderTd = (events) => {
	// カレンダーにイベントがあるなら、classを追加
	events.forEach((ev) => {
		const date = ev.start?.dateTime?.split("T")[0].split("-") || ev.start?.date?.split("-");
		if (date) {
			const td = $(`[data-date="${date[0]}/${date[1]}/${date[2]}"]`)[0];
			if (td) {
				td.className += " haveEvent";
				console.log(td);
			}
		}
	});
};
