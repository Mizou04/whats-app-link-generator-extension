const MESSAGES = [];


const CONFIG = document.querySelector(".config");
const CONFIG_BODY = CONFIG.querySelector(".body");
const ADD_BTN = document.querySelector(".add_msg");
let isEditing = false;
		
function checkForMessages() {
	let no_msg_txt = document.createElement("p");

	if(!MESSAGES.length) {
		no_msg_txt.textContent = "no entries yet";
		no_msg_txt.classList.add("no_msg");
		CONFIG_BODY.innerHTML = no_msg_txt.outerHTML;
	} else {
		let msgForm = CONFIG_BODY.querySelector(".msg_form_wrapper");
		msgForm?.remove();
		no_msg_txt?.remove();
		CONFIG_BODY.innerHTML = ""
		for(let message of MESSAGES) {
			CONFIG_BODY.innerHTML += createMsgUI(message);
		}
	}
	setAddBtnState();
}

for(let i = 0; i < 20; i++){
	MESSAGES.push({title : "id"+i, msg : "msg number " + i})
}
checkForMessages();

function setAddBtnState() {
	ADD_BTN.disabled = isEditing ? true : false;
}

setAddBtnState();

function registerNewMsgHandler(){
	ADD_BTN.addEventListener("click", renderNewMsgForm);
};

registerNewMsgHandler();

function renderNewMsgForm(e) {
	e.preventDefault();
	let form = createMsgForm();
	CONFIG_BODY.append(form);
	isEditing = true;
	setAddBtnState();
	form.scrollIntoView({behavior : "smooth", block: "start"});
}


function createMsgForm(){
	let div = document.createElement("div");
	let input = document.createElement("input");
	let text_area = document.createElement("textarea");
	let actions = document.createElement("div");
	let cancel_btn = document.createElement("button");
	let submit_btn = document.createElement("button");
	const TITLE_ERROR = document.createElement("span");
	{ // listeners block
		const inputChangeHandler = 
			disableCreateBtnIfNoMsgOrTitle(
				input,
				text_area,
				submit_btn
			);
		input.addEventListener("input", inputChangeHandler);
		text_area.addEventListener("input", inputChangeHandler);
		submit_btn.onclick = storeMsgHandler;
		cancel_btn.addEventListener("click", cancelEditingHandler);
	}
	{ // styles block
		div.classList.add("msg_form_wrapper");
		input.maxLength = 120;
		input.placeholder = "message title here...";
		input.classList.add("msg_form_title");
		TITLE_ERROR.classList.add("msg_title_error");

		text_area.classList.add("msg_form_msg");
		text_area.style.resize = "none";
		text_area.placeholder = "your message here...";

		actions.classList.add("msg_form_actions");
		cancel_btn.classList.add("cancel");
		cancel_btn.textContent = "Cancel";
		submit_btn.classList.add("submit");
		submit_btn.textContent = "Create";

		if(!input.value.length || !text_area.value.length) {
			submit_btn.disabled = true;
		} else {
			submit_btn.disabled = false;
		}
	}

	actions.append(cancel_btn, submit_btn);
	div.append(input, TITLE_ERROR, text_area, actions);
	return div;
}

let temp_global_msg_object = {};

function disableCreateBtnIfNoMsgOrTitle(input, text_area, submit_btn) {
	return function inputChangeHandler(e){
		e.preventDefault();
		const TITLE_ERROR = document.querySelector(".msg_title_error");
		temp_global_msg_object.title = input.value;
		temp_global_msg_object.msg   = text_area.value;
		TITLE_ERROR.textContent = "";
		if(!input.value.length || !text_area.value.length) {
			submit_btn.disabled = true;
		} else {
			submit_btn.disabled = false;
		}
	}
}

function storeMsgHandler(e) {
	e.preventDefault();
	let {msg, title} = temp_global_msg_object;
	if(!title.length) return;
	if(!msg.length) return;
	let duplicate = MESSAGES.filter((msg) => msg.title == title).length // > 0
	if(duplicate) {
		const TITLE_ERROR = document.querySelector(".msg_title_error");
		TITLE_ERROR.textContent = "message with same title exist already...";
		return;
	}
	MESSAGES.push({title, msg});
	temp_global_msg_object.title = temp_global_msg_object.msg = "";
	checkForMessages();
	isEditing = false;
	setAddBtnState();
}

function cancelEditingHandler(e) {
	e.preventDefault();
	temp_global_msg_object.title = temp_global_msg_object.msg = "";
	checkForMessages();
	isEditing = false;
	setAddBtnState();
}

function createMsgUI(message) {
	let msg_ui_wrapper = document.createElement("div");
	let msg_ui_title   = document.createElement("p");
	let randomizer     =  Math.floor(Math.random()*182612156133);
	let duplicateID = MESSAGES.filter(msg => msg.randomId == randomizer);
	if(duplicateID.length) createMsgUI(message);
	duplicateID = undefined;

	message.randomId = randomizer;
	msg_ui_wrapper.classList.add("msg_ui", `msg_ui--${randomizer}`);
	msg_ui_title.classList.add("msg_ui_title", `msg_ui_title--${randomizer}`);

	msg_ui_title.textContent = message.title;
	msg_ui_wrapper.appendChild(msg_ui_title);

	return msg_ui_wrapper.outerHTML;
}

document.addEventListener("click", (e) => {
	for(let message of MESSAGES) {
		let tcl = e.target.classList;
		if(null
			|| tcl.contains(`msg_ui--${message.randomId}`) 
			|| tcl.contains(`msg_ui_title--${message.randomId}`))
		{
			msgUiOnClickHandler(e, message);
		}
	}
})

function msgUiOnClickHandler(msgUiEvent, {title, msg, randomId}) {
	let form  = createMsgForm();
	let form_msg_title = form.querySelector(".msg_form_title");
	let form_msg_msg   = form.querySelector(".msg_form_msg");

	form_msg_title.value = title;
	form_msg_msg.value   = msg;

	let msg_ui_wrapper = msgUiEvent.target;
	if(msg_ui_wrapper
		.classList
		.contains(`msg_ui_title--${randomId}`))
		msg_ui_wrapper = msg_ui_wrapper.parentElement;
	//msg_ui_wrapper.style.background = "blue";
	msg_ui_wrapper.replaceWith(form);
	isEditing = true;
	setAddBtnState();

	let form_submit_btn = form.querySelector(".submit");

	form_submit_btn.onclick = (formEvent) => { // update msg
		formEvent.preventDefault();

		
		if(!form_msg_title.value.length) return;
		if(!form_msg_msg.value.length) return;
		let targetMsg = MESSAGES.find((msg) => msg.title == title) // > 0
		let duplicate = MESSAGES.filter(omsg => { //other messages
			return omsg.title != targetMsg.title && omsg.title == form_msg_title.value;
		}).length;

		{ // duplicate warning
			const TITLE_ERROR = document.querySelector(".msg_title_error");
			if(!duplicate)
				targetMsg.title = form_msg_title.value;
			else {
				TITLE_ERROR.textContent = "message with same title\
				exist already...";
				return;
			}
			TITLE_ERROR.textContent = "";
		}
		targetMsg.msg   = form_msg_msg.value;
		checkForMessages();
		isEditing = false;
		setAddBtnState();
	}
}
