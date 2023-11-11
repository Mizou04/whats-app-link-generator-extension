const 
	APP_BODY = document.querySelector(".app .body"),
	TABS_KIDS  = Array.from(document.querySelectorAll(".tabs a")),
	MAIN_TAB   = TABS_KIDS[0],
	CONFIG_TAB = TABS_KIDS[1];

document.querySelector('#options').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('config.html'));
  }
});
//MAIN_TAB.addEventListener("click", () => console.log("main"));
//CONFIG_TAB.addEventListener("click", config_tab_handler);
//
//function config_tab_handler(e){
//	//e.preventDefault();
//	MAIN_TAB.classList.remove("active");
//	CONFIG_TAB.classList.add("active");
//	//APP_BODY.innerHTML = ("config page");
//	console.log("config page");
//}
