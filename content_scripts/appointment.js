console.log("Appointment");

// Yep, it's in plain text, I don't care
const emailjsUserId = "user_fj3TLlg7QqLXWFSWiVllC";
const emailjsServiceId = "service_qd2344k";
const emailjsTemplateId = "template_9a7e712";

var sentence = {
    "en-fr": "Consulate Appointment",
    "en-be": "Consulate Appointment",
    "fr-fr": "Rendez-vous au consulat"
};
var lang = document.URL.match(/\/(\w{2}-\w{2})\//i)[1];
console.log("Current language: %s", lang);

emailjs.init(emailjsUserId);

var closeButton = document.getElementsByClassName("button secondary")[0];

// Get saved email
var email = null
browser.storage.local.get("notif_email")
    .then(result => {
    email = result["notif_email"];
    if (!email) {
        console.error("No email found for notification");
        return;
    }
    console.log("saved email ", email);
    checkMeetings();
}, error => {
    console.error(`Error: ${error}`);
});

// Configure refresh
browser.storage.local.get("refresh")
    .then(result => {
        refresh_rate = result["refresh"];
        console.log(`Appointment refresh_rate: ${refresh_rate} minutes`);
        console.log(`Next refresh: ${new Date(Date.now() + (refresh_rate * 60 * 1000))}`);
        setTimeout(function () {
            browser.runtime.sendMessage({ reload: true });
        }, refresh_rate * 60 * 1000);
    }, error => {
        console.error(`Error: ${error}`);
    });

// Get planned meeting date
var planned_meeting = null;
browser.storage.local.get("meeting")
    .then(result => {
        saved_meeting = new Date(result["meeting"]);
        console.log(`Saved\t appointment: ${saved_meeting.toDateString()}`);
        var card = document.getElementsByClassName("consular-appt")[0];
        planned_meeting = new Date(card.innerText.match(/\d{1,2} \w+, \d{4}/)[0]);
        console.log(`Current\t appointment: ${planned_meeting.toDateString()}`);
        if (planned_meeting.toDateString() != saved_meeting.toDateString()) {
            browser.storage.local.set({ meeting: planned_meeting });
            console.log("New Meeting date");
            console.log(planned_meeting.toDateString());
            console.log("Reloading tab");
            setTimeout(function () {
                browser.runtime.sendMessage({ reload: true });
            }, 500);
        } else {
            console.log('Same appointment date');
            checkMeetings();
        }
    })

// GET APPOINTMENT DAYS
const json_url = "/days/44.json?appointments[expedite]=false";
console.log(document.URL + json_url);
var earliest_meeting = null;
fetch(document.URL + json_url)
    .then(status)
    .then(json)
    .then(function (data) {
        earliest_meeting = new Date(data[0].date);
        console.log("Earliest appointment:", earliest_meeting.toDateString());
        checkMeetings();
    }).catch(function (error) {
        console.log('Request failed', error);
        closeButton.click();
    });

// GET PREVIOUS EARLIEST DAY
var previous_earliest = null
browser.storage.local.get("previous_earliest")
    .then(result => {
        var save = result["previous_earliest"];
        if (!save || save == null) {
            browser.storage.local.set({
                previous_earliest: (new Date(Date.now())).toDateString()
            });
            browser.runtime.sendMessage({ reload: true });
        } else {
            console.log("Previous earliest:", save)
            previous_earliest = save
            checkMeetings();
        }
    });

// MEETINGS COMPARISONS
function checkMeetings() {
    if (!earliest_meeting || !planned_meeting || !email || !previous_earliest) {
        return;
    }
    var emailParams = {
        date: earliest_meeting.toDateString(),
        to_send: email
    };

    if (earliest_meeting < planned_meeting) {
        if (earliest_meeting.toDateString() == previous_earliest) {
            console.log("This meeting has already been reported, dismissing");
        } else {
            console.log(`Possible new meeting.\r\nOld: ${planned_meeting}\r\nNew: ${earliest_meeting}`)
            browser.storage.local.set({
                previous_earliest: earliest_meeting.toDateString()
            });
            emailjs.send(emailjsServiceId, emailjsTemplateId, emailParams)
                .then(res => {
                    console.log("Email sent", res.status, res.text);
                }, error => {
                    console.error("Failure: ", error);
                });
        }
    } else {
        console.log("No relevant meeting")
    }
}


// Utils
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function json(response) {
    return response.json();
}
