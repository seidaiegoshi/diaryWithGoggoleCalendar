const weeks = ["日", "月", "火", "水", "木", "金", "土"];
const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;

function showCalendar(year, month) {
	const calendarHtml = createCalendar(year, month);
	const sec = document.createElement("section");
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
		calendarHtml += "<td>" + weeks[i] + "</td>";
	}

	for (let w = 0; w < 6; w++) {
		calendarHtml += "<tr>";

		for (let d = 0; d < 7; d++) {
			if (w == 0 && d < startDay) {
				// 1行目で1日の曜日の前
				let num = lastMonthendDayCount - startDay + d + 1;
				calendarHtml += '<td class="isDisabled">' + num + "</td>";
			} else if (dayCount > endDayCount) {
				// 末尾の日数を超えた
				let num = dayCount - endDayCount;
				calendarHtml += '<td class="isDisabled">' + num + "</td>";
				dayCount++;
			} else {
				dayCount++;
				if (year == date.getFullYear() && month == date.getMonth() + 1 && dayCount == date.getDate()) {
					// 今日にマークをつける
					calendarHtml += "<td class='isToday'>" + dayCount + "</td>";
				} else {
					calendarHtml += "<td>" + dayCount + "</td>";
				}
			}
		}
		calendarHtml += "</tr>";
	}
	calendarHtml += "</table>";

	return calendarHtml;
}

function moveCalendar(e) {
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

	showCalendar(year, month);
}

$("#calendarPre").on("click", moveCalendar);
$("#calendarNext").on("click", moveCalendar);

showCalendar(year, month);
