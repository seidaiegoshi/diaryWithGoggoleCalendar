/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
let CLIENT_ID = "";
let API_KEY = "";
let CALENDAR_ID = "";

let events;

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
		await listUpcomingEvents();
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
	for (let i = events.length - 1; 0 < i; i--) {
		if (events[i].summary) {
			htmlElement += `
      <div class="eventHeader"><span class="eventSummary">${events[i].summary}</span>
      <span class="eventDateTime">${events[i].start.dateTime || events[i].start.date} </span></div>
      <div class=eventDescription style="white-space: pre-wrap">${events[i].description}</div>
		`;
		}
	}
	$("#content").html(htmlElement);
}

$("#btnKeySet").on("click", () => {
	CLIENT_ID = $("#clientId").val();
	API_KEY = $("#apiKey").val();
	CALENDAR_ID = $("#calendarId").val();
	gapiLoaded();
	gisLoaded();
});

$("#btnSendDiary").on("click", async () => {
	// Refer to the JavaScript quickstart on how to setup the environment:
	// https://developers.google.com/calendar/quickstart/js
	// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
	// stored credentials.
	const date = $("#date").text().split(/\//);

	const year = date[0];
	const month = date[1];
	const day = date[2];
	const allDay = year + "-" + month + "-" + day;
	const event = {
		summary: $("#title").val(),
		description: $("#detail").val(),
		start: {
			date: allDay,
		},
		end: {
			date: allDay,
		},
	};

	//カレンダーのイベントを登録する。
	await gapi.client.calendar.events
		.insert({
			calendarId: CALENDAR_ID,
			resource: event,
		})
		.then(
			(response) => {
				console.log("Response", response);
			},
			(err) => {
				console.error("Execute error", err);
			}
		);

	//データ持ってくる。
	listUpcomingEvents();

	// カレンダーを更新する
	showCalendar(year, month);
});
