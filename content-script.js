// this the script that access DOM tree
// it will be injected
let tab_id = null;
console.info("content-script injected successfully");


window.addEventListener("load", (e) => {
	let phonenumber = document.querySelector(".phonenumber");
	//can receive messages also
	chrome.runtime.onMessage.addListener((msg, msg_sender, sendRes) => {
		tab_id = parseInt(msg);
		console.log(tab_id, "from", msg_sender);
		sendRes({data : phonenumber.textContent});
	})
})

