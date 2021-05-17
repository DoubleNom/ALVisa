console.log("Schedule -> Appointment")
// BE EXTRA CAREFUL!!
// YOU DON'T WANT TO CANCEL THE MEETING
var sentence = {
    "en-fr": "Reschedule Appointment",
    "en-be": "Consulate Appointment",
    "fr-fr": ""
}
var lang = document.URL.match(/\/(\w{2}-\w{2})\//i)[1]
var button = document.getElementsByClassName("button primary small")[3]

console.log("Current language: %s", lang)
if (button.text == sentence[lang]) {
    setTimeout(function () {
        button.click()
    }, 500)
}