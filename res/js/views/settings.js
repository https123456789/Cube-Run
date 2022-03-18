function done() {
	document.getElementsByTagName("main")[0].classList.add("shrink");
	document.getElementById("close").classList.add("shrink");
	document.body.classList.add("fade");
	window.setTimeout(() => {
		window.parent.postMessage("settingsEnded", "*");
	}, 1);
}

function save() {
	var kkeys = Object.keys(window.parent.gamedata.keybindings.selections);
	for (var i = 0; i < kkeys.length; i++) {
		var id = "leftKeybinding-" + i;
		saveKeybinding(
			"left",
			kkeys[i],
			document.getElementById(id).value
		);
		id = "rightKeybinding-" + i
		saveKeybinding(
			"right",
			kkeys[i],
			document.getElementById(id).value
		);
	}
	
	var saveButtons = document.getElementsByClassName("saveBtn");
	for (var i = 0; i < saveButtons.length; i++) {
		var element = saveButtons[i];
		element.classList.add("saved");
		element.style.pointerEvents = "none";
	}
	window.setTimeout(() => {
		var saveButtons = document.getElementsByClassName("saveBtn");
		for (var i = 0; i < saveButtons.length; i++) {
			var element = saveButtons[i];
			element.classList.remove("saved");
			element.style.pointerEvents = "auto";
		}
	}, 2000);
}

function loadKeybindings() {
	var top = document.getElementById("keybindings");
	var kkeys = Object.keys(window.parent.gamedata.keybindings.selections);
	for (var i = 0; i < kkeys.length; i++) {
		var wrapper = document.createElement("div");
		wrapper.classList.add("wrapper");
		var label = document.createElement("p");
		label.innerHTML = kkeys[i];
		wrapper.appendChild(label);

		var l1 = document.createElement("div");
		l1.classList.add("container");
		var l1i1 = document.createElement("div");

		var l2i1 = document.createElement("p");
		l2i1.innerHTML = "Left";
		var l2i2 = document.createElement("input");
		l2i2.autocomplete = "off";
		l2i2.value = window.parent.gamedata.keybindings.selections[kkeys[i]].left;
		l2i2.type = "text";
		l2i2.id = "leftKeybinding-" + i;
		
		l1i1.appendChild(l2i1);
		l1i1.appendChild(l2i2);
		
		var l1i2 = document.createElement("div");

		var l3i1 = document.createElement("p");
		l3i1.innerHTML = "Right";
		var l3i2 = document.createElement("input");
		l3i2.autocomplete = "off";
		l3i2.value = window.parent.gamedata.keybindings.selections[kkeys[i]].right;
		l3i2.type = "text";
		l3i2.id = "rightKeybinding-" + i;

		l1i2.appendChild(l3i1);
		l1i2.appendChild(l3i2);
		
		l1.appendChild(l1i1);
		l1.appendChild(l1i2);
		wrapper.appendChild(l1);

		var sbtn = document.createElement("button");
		sbtn.onclick = () => {
			save();
		};
		sbtn.classList.add("saveBtn");
		sbtn.innerHTML = "Save";
		wrapper.appendChild(sbtn);
		top.appendChild(wrapper);
	}
}

function loadKeybindingSelections() {
	var dom = document.getElementById("keybindingsSelection");
	var kkeys = Object.keys(window.parent.gamedata.keybindings.selections);
	for (var i = 0; i < kkeys.length; i++) {
		var nel = `<button id="setKeybindingSelection-${i}" class="keybindingSelection ${((kkeys[i] == window.parent.gamedata.keybindings.selection) ? "keybindingSelection-active" : "")}" onclick="setKeybingingSelection(${i})">${kkeys[i]}</button>`;
		dom.innerHTML += nel;
	}
}

function setKeybingingSelection(i) {
	window.parent.gamedata
		.keybindings
		.selection = Object.keys(window.parent.gamedata
		.keybindings
		.selections)[i];
	var keys = Object.keys(
		window.parent.gamedata
			.keybindings
			.selections
	);
	for (var q = 0; q < keys.length; q++) {
		var el = 
document.getElementById("setKeybindingSelection-" + q);
		el.classList.remove("keybindingSelection-active");
		if (q == i) {
			el.classList.add("keybindingSelection-active");
		}
	}
}

function saveKeybinding(key, selectionName, value) {
	window.parent.gamedata
		.keybindings
		.selections[selectionName][key] = value;
	window.parent
		.localStorage.setItem(
			"keybindings",
			JSON.stringify
			(
				window.parent
					.gamedata.keybindings
			)
		);
}

window.onload = () => {
	loadKeybindings();
	loadKeybindingSelections();
}