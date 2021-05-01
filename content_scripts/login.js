console.log("Filling login information");
var email = document.getElementById("user_email");
var password = document.getElementById("user_password");
var checkbox = document.getElementsByClassName("icheck-input")[0];
var button = document.getElementsByClassName("button primary")[0];

// Will fail if already checked, but will try again instantly and succeed
checkbox.click();

browser.storage.local.get("login_email")
    .then(result => {
        if (!result["login_email"]) {
            console.error("Missing email in parameters");
            return;
        }
        email.value = result["login_email"];
        login();
    }, error => {
        console.error(`Error: ${error}`);
    });

browser.storage.local.get("login_password")
    .then(result => {
        if (!result["login_password"]) {
            console.error("Missing password in parameters");
            return;
        }
        password.value = result["login_password"];
        login();
    }, error => {
        console.error(`Error: ${error}`);
    });

function login() {
    console.log(email.value)
    console.log(password.value)
    if (email.value && password.value ) {
        setTimeout(function () {
            button.click();
        }, 1000);
    }
}