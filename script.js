let result_number = document.querySelector(".result_number");
let retry_btn     = document.querySelector(".result .retry");

retry_btn.addEventListener("click", () => {
	retrievNumberFromDocument();
})

retrievNumberFromDocument();
function retrievNumberFromDocument() {
	chrome.tabs.query({}, (tabs) => {
		let activeTab = tabs.find(tab => tab.active === true);
		chrome.tabs.sendMessage(
			activeTab.id,
			activeTab.id,
			null,
			onResponse
		);
	});

}

function onResponse(res){
	let err = chrome.runtime.lastError;
	if(err && err.message) {
		console.error("something went wrong : ", err?.message);
		return;
	}
	result_number.textContent = res.data.replace(/\s+/gi, "-");

	let processed_num = processNumber(res.data);
	let link = "https://wa.me/" + processed_num;
	let wa_link = document.querySelector(".wa_link");

	wa_link.textContent = "send blank msg to : " + result_number.textContent;
	wa_link.setAttribute("href", link);
	wa_link.setAttribute("target", "_blank");
	//TODO: add default message
}

/*
	* @params num - string
	*/
function processNumber(num){
	if(num[0] == "+")
		num = num.slice(1);
	let i = 0;
	while(num[i] == "0") {
		num = num.slice(1);
		i++;
	}
	let components = num.split("");
	components = components.filter(cmp => /[0-9]/gi.test(cmp) );
	num = components.join("");
	return num;
}
