function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        login_email: document.querySelector("#login_email").value,
        login_password: document.querySelector("#login_password").value,
        refresh: document.querySelector("#refresh").value,
        notif_email: document.querySelector("#notif_email").value
    });
}

function load(tag, default_value) {
    browser.storage.local.get(tag).then(value => {
        console.log(value)
        document.querySelector("#" + tag).value = value[tag] || default_value;
    }, error => {
        console.log(`Error: ${error}`);
    }) 
}

function restoreOptions() {
    load("login_email", "");
    load("login_password", "");
    load("refresh", 60);
    load("notif_email", "");
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
