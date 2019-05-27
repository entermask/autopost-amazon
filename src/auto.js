chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case 'Launch':
		chrome.storage.sync.get(['start'], (r) =>
		{
			if (r.start == 1)
			{
				console.log('TOOL RUNNING');
				window.location.reload();
			}
			else 
			{
				stopped();
				window.location.reload();
			}
		});
		break;
		case 'reset':
		{
			sessionStorage.setItem('_step', 1);
			sessionStorage.setItem('failed', 0);
			sessionStorage.setItem('success', 0);
			sessionStorage.setItem('now', 0);
			console.log('RESET SUCCESS !');
			chrome.storage.sync.set({now: sessionStorage.getItem('now'), total: 0, failed: sessionStorage.getItem('failed'), success: sessionStorage.getItem('success')});
			chrome.extension.sendMessage({
				type: "update"
			});
			window.location.reload();
		}
	}
});

function pressChar(e, char)
{
	$(e).trigger({type: 'keydown', key: char});
}


chrome.storage.sync.get(['start'], (r) => {
	if(r.start)
	{
		chrome.extension.sendMessage({
			type: "update"
		});
		if (!sessionStorage.getItem('_step'))
			sessionStorage.setItem('_step', 1);
		if (!sessionStorage.getItem('now'))
			sessionStorage.setItem('now', 0);
		if (!sessionStorage.getItem('failed'))
			sessionStorage.setItem('failed', 0);
		if (!sessionStorage.getItem('success'))
			sessionStorage.setItem('success', 0);
		var step = sessionStorage.getItem('_step');
		var now = sessionStorage.getItem('now');

		console.log('TOOL RUNNING');
		console.log(now);

		(async function amazon() {

			var dem = 0;

			for (var i = 0; i < content.length; i++)
			{
				if(!content[i].ASIN || !Number(content[i].Price))
					continue;
				dem++;
			}

			chrome.storage.sync.set({now: sessionStorage.getItem('now'), total: dem, failed: sessionStorage.getItem('failed'), success: sessionStorage.getItem('success')});

			for (var i = now; i < content.length; i++)
			{

				if(!content[i].ASIN || !Number(content[i].Price))
				{
					sessionStorage.setItem('now',Number(sessionStorage.getItem('now'))+1);
					sessionStorage.setItem('failed', Number(sessionStorage.getItem('failed'))+1);
					continue;
				}

				const _price = content[i].Price;

				if (step == 1)
					await new Promise(function(res) {
						window.location.href = 'https://sellercentral.amazon.com/abis/listing/syh?asin='+content[i].ASIN+'&ref_=xx_catadd_dnav_xx';
						sessionStorage.setItem('_step', 2);
						res(true);
					});
				else if (location.href != 'https://sellercentral.amazon.com/abis/listing/syh?asin='+content[i].ASIN+'&ref_=xx_catadd_dnav_xx') {
					sessionStorage.setItem('_step', 1);
					window.location.reload();
				}

				var checked = await new Promise(function(res){ 
					setTimeout(function(){

						if(!document.querySelector('.reconciled-image') || !document.querySelector('.reconciled-image').getAttribute('src') || !document.querySelectorAll('[data-value="new, new"]').length)
							res(false);
						if(document.querySelector('.slider.round')){
							$('.slider.round').click();
							res(true);
						}

					}, 7000);
				}).catch((e) => fasle);

				if(checked){
					await new Promise(function(res){
						setTimeout(function(){

							$('[data-value="new, new"]').click();
							$('[data-value="new, new"]').click();
							
							(async function(){

								for (var p = 0; p < _price.length; p++)
								{
									console.log(_price);
									console.log(_price[p]);
									await new Promise(r => setTimeout(function(){
										pressChar('#standard_price input', _price[p]);
										r(true);
									}, 100));
								}

								var quanrand = (Math.floor(Math.random() * (21 - 16) + 16)).toString();

								for (var i = 0; i < quanrand.length; i++)
								{
									await new Promise(r => setTimeout(function(){
										pressChar('#quantity input', quanrand[i]);
										r(true);
									}, 100));
								}

								await new Promise(r => setTimeout(function(){
									pressChar('#fulfillment_latency input', '5');
									r(true);
								}, 100));

							})();

							res(true);
						}, 500);
					});

					var done = await new Promise(function(res){
						setTimeout(function(){
							// document.querySelector('[label="Save"]').click();
							sessionStorage.setItem('now',Number(sessionStorage.getItem('now'))+1);
							sessionStorage.setItem('_step', 1);
							sessionStorage.setItem('success', Number(sessionStorage.getItem('success'))+1);
							res(true);
						}, 3500);
					});

					if (done)
					{
						await new Promise(function(res){
							setTimeout(function(){
								window.location.reload();
								res(true);
							}, Math.floor(Math.random() * (36 - 15) + 15)*1000);
						});
					}
				} else {
					sessionStorage.setItem('failed', Number(sessionStorage.getItem('failed'))+1);
					sessionStorage.setItem('now',Number(sessionStorage.getItem('now'))+1);
					console.log('LỖI !');
					window.location.reload();
				}
			}
		})();
	}
	else
		stopped();
});

function stopped()
{
	console.log('TOOL STOPPED !');
} 