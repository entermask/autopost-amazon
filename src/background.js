// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.type) {
		case "Launch":
		amazonLaunch();
		break;
		case "reset":
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.sendMessage(tab.id, {type: "reset"});
		});
		break;
	}
	return true;
});

// send a message to the content script

var amazonLaunch = function(){
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.sendMessage(tab.id, {type: "Launch"});
	});
}