
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case 'update':
		chrome.storage.sync.get(['failed'], (r) => { document.getElementById('failed').innerHTML = r.failed || 0; });
		chrome.storage.sync.get(['success'], (r) => { document.getElementById('success').innerHTML = r.success || 0; });
		chrome.storage.sync.get(['total'], (r) => { document.getElementById('total').innerHTML = r.total || 0; });
		chrome.storage.sync.get(['start'], (r) => { document.querySelector('button').innerHTML = r.start ? 'TẠM DỪNG TOOL' : 'BẮT ĐẦU TOOL' });
		chrome.storage.sync.get(['now'], (r) => { document.getElementById('now').innerHTML = r.now ? Number(r.now)+1 : 1 });
		break;
	}
});

chrome.storage.sync.get(['failed'], (r) => { document.getElementById('failed').innerHTML = r.failed || 0; });
chrome.storage.sync.get(['success'], (r) => { document.getElementById('success').innerHTML = r.success || 0; });
chrome.storage.sync.get(['total'], (r) => { document.getElementById('total').innerHTML = r.total || 0; });
chrome.storage.sync.get(['now'], (r) => { document.getElementById('now').innerHTML = r.now ? Number(r.now)+1 : 1 });
chrome.storage.sync.get(['start'], (r) => { document.querySelector('button').innerHTML = r.start ? 'TẠM DỪNG TOOL' : 'BẮT ĐẦU TOOL' });

(function() {
	document.querySelector("button").onclick = function() {
		chrome.extension.sendMessage({
			type: "Launch"
		});
		chrome.storage.sync.get(['start'], (r) =>
		{
			if (!r.start)
			{
				chrome.storage.sync.set({start: true});
			}
			else
			{
				chrome.storage.sync.set({start: false});
			}
			document.querySelector('button').innerHTML = !r.start ? 'TẠM DỪNG TOOL' : 'BẮT ĐẦU TOOL';
		});
	}

	document.getElementById('update').onclick = function(){
		chrome.extension.sendMessage({
			type: "reset"
		});
	}
	
})();