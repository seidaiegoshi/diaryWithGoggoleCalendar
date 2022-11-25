/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
let CLIENT_ID = "";
let API_KEY = "";
let CALENDAR_ID = "";

let events;
let isEventId;
let thisMonthEvents;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
	gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
	await gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: [DISCOVERY_DOC],
	});
	gapiInited = true;
	maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
	tokenClient = google.accounts.oauth2.initTokenClient({
		client_id: CLIENT_ID,
		scope: SCOPES,
		callback: "", // defined later
	});
	gisInited = true;
	maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
	if (gapiInited && gisInited) {
		document.getElementById("authorize_button").style.visibility = "visible";
	}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
	tokenClient.callback = async (resp) => {
		if (resp.error !== undefined) {
			throw resp;
		}
		document.getElementById("signout_button").style.visibility = "visible";
		document.getElementById("authorize_button").innerText = "Refresh";
		// await listUpcomingEvents();

		await getThisMonthEvents(getThisMonthDayFirst(year, month), getThisMonthDayEnd(year, month));
		showDiaryHistory(thisMonthEvents);
	};

	if (gapi.client.getToken() === null) {
		// Prompt the user to select a Google Account and ask for consent to share their data
		// when establishing a new session.
		tokenClient.requestAccessToken({ prompt: "consent" });
	} else {
		// Skip display of account chooser and consent dialog for an existing session.
		tokenClient.requestAccessToken({ prompt: "" });
	}
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
	const token = gapi.client.getToken();
	if (token !== null) {
		google.accounts.oauth2.revoke(token.access_token);
		gapi.client.setToken("");
		document.getElementById("content").innerText = "";
		document.getElementById("authorize_button").innerText = "Authorize";
		document.getElementById("signout_button").style.visibility = "hidden";
	}
}

function showDiaryHistory(events) {
	// Flatten to string to display
	let htmlElement = "";
	events = events.sort((a, b) => {
		return (a.start?.dateTime || a.start?.date) > (b.start?.dateTime || b.start?.date) ? -1 : 1;
	});

	events.forEach((element) => {
		if (element.summary && (element.start.dateTime || element.start.date) && element.description) {
			htmlElement += `
      <div class="eventHeader"><span class="eventSummary">${element.summary}</span>
      <span class="eventDateTime">${element.start.dateTime || element.start.date} </span></div>
      <div class=eventDescription style="white-space: pre-wrap">${element.description}</div>
		`;
		}
	});
	$("#content").html(htmlElement);

	addClassToCalenderTd(events);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
async function listUpcomingEvents() {
	let response;
	try {
		const request = {
			calendarId: CALENDAR_ID,
			// timeMin: new Date().toISOString(),
			showDeleted: false,
			singleEvents: false,
			// maxResults: 10,
			orderBy: "updated",
		};
		response = await gapi.client.calendar.events.list(request);
	} catch (err) {
		document.getElementById("content").innerText = err.message;
		return;
	}

	events = response.result.items;
	console.log(events);
	if (!events || events.length == 0) {
		document.getElementById("content").innerText = "No events found.";
		return;
	}
	// Flatten to string to display
	let htmlElement = "";
	events = events.sort((a, b) => {
		return (a.start?.dateTime || a.start?.date) < (b.start?.dateTime || b.start?.date) ? -1 : 1;
	});
	for (let i = events.length - 1; 0 < i; i--) {
		if (events[i].summary && (events[i].start.dateTime || events[i].start.date) && events[i].description) {
			htmlElement += `
      <div class="eventHeader"><span class="eventSummary">${events[i].summary}</span>
      <span class="eventDateTime">${events[i].start.dateTime || events[i].start.date} </span></div>
      <div class=eventDescription style="white-space: pre-wrap">${events[i].description}</div>
		`;
		}
	}
	$("#content").html(htmlElement);

	addClassToCalenderTd(events);
}

//カレンダーで表示している月のイベントを取得する。
async function getThisMonthEvents(dateFrom, dateTo) {
	// dateFrom : string ex.) "2022/11/14"
	// dateTo : string  ex.) "2022/11/14"
	let response;
	try {
		const request = {
			calendarId: CALENDAR_ID,
			timeMin: new Date(dateFrom).toISOString(),
			timeMax: new Date(dateTo).toISOString(),
			showDeleted: false,
			singleEvents: false,
			orderBy: "updated",
		};
		// console.log("request");
		// console.log(request);
		response = await gapi.client.calendar.events.list(request);
	} catch (err) {
		// console.log(err.message);
		return;
	}

	thisMonthEvents = response.result.items;
	// console.log("thisMonthEvents");
	// console.log(thisMonthEvents);
}

function zeroPadding(str) {
	if (str.length == 1) {
		str = "0" + str;
	}
	return str;
}

$("#btnKeySet").on("click", () => {
	CLIENT_ID = $("#clientId").val();
	API_KEY = $("#apiKey").val();
	CALENDAR_ID = $("#calendarId").val();
	gapiLoaded();
	gisLoaded();
});

// イベント登録ボタン
$("#btnSendDiary").on("click", async () => {
	// Refer to the JavaScript quickstart on how to setup the environment:
	// https://developers.google.com/calendar/quickstart/js
	// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
	// stored credentials.
	const date = $("#date").text().replace(/\//g, "-");
	const event = {
		summary: $("#title").val(),
		description: $("#detail").val(),
		start: {
			date: date,
		},
		end: {
			date: date,
		},
	};

	//カレンダーのイベントを登録する。
	// すでにイベントがあったら
	if (isEventId) {
		await gapi.client.calendar.events
			.update({
				calendarId: CALENDAR_ID,
				eventId: isEventId,
				resource: event,
			})
			.then(
				(response) => {
					console.log("Response", response);
					//カレンダー情報更新
					getThisMonthEvents(getThisMonthDayFirst(year, month), getThisMonthDayEnd(year, month));
				},
				(err) => {
					console.error("Execute error", err);
				}
			);
	} else {
		// イベントがなかったら
		await gapi.client.calendar.events
			.insert({
				calendarId: CALENDAR_ID,
				resource: event,
			})
			.then(
				(response) => {
					console.log("Response", response);
					//カレンダー情報更新
					getThisMonthEvents(getThisMonthDayFirst(year, month), getThisMonthDayEnd(year, month));
				},
				(err) => {
					console.error("Execute error", err);
				}
			);
	}

	// カレンダーを更新する
	showCalendar(year, month);
});
