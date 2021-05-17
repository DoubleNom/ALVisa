function reload(id) {
    // browser.tabs.reload(id, {bypassCache: true})
}

function handleMessage(request, sender, sendResponse) {
    console.log("Received message from " + sender.tab.id)
    // if (request.hasOwnProperty("reload")) {
    //     reload(sender.tab.id)
    // }
}

browser.runtime.onMessage.addListener(handleMessage);
