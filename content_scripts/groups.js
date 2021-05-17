console.log("Groups -> Schedule")

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
            }, 200);
        } else {
            console.log('Same appointment date');
        }
    })

for (let button of document.getElementsByClassName("button primary small")) {
    if (button.href.includes("continue_actions")) {
        setTimeout(function () {
            button.click()
        }, 500)
        break
    }
}
