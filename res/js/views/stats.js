function done() {
	document.getElementsByTagName("main")[0].classList.add("shrink");
	document.getElementById("close").classList.add("shrink");
	document.body.classList.add("fade");
	window.setTimeout(() => {
		window.parent.postMessage("statsEnded", "*");
	}, 1);
}

function saveStats() {
	var el = document.createElement("a");
	var file = new Blob([JSON.stringify(window.parent.gamedata, false, 4)], {type: "application/json"});
	el.href= URL.createObjectURL(file);
	el.download = "cubeRunGameData.json";
	el.click();
}

async function loadStats() {
	// Request file
	var fileHandle;
	[fileHandle] = await window.parent.showOpenFilePicker({
		types: [
			{
				description: "JSON",
				accept: {
					"application/json": [".json"]
				}
			}
		],
		multiple: false
	});
	// Load file contents
	var fileData = await fileHandle.getFile();
	fileData = await fileData.text();
	fileData = JSON.parse(fileData);
	// Overwrite current gamedata
	window.parent.gamedata.stats = fileData.stats;
	// Reload page information
	loadPageInfo();
	// Alert user of successful operation
	alert("Game Data successfully overwritten.");
}

function loadPageInfo() {
	var els = document.getElementsByTagName("span");
	highscoreLabels = [];
	totalDeathsLabels = [];
	for (var i = 0; i < els.length; i++) {
		var atr = els[i].getAttribute("javascript-label");
		if (atr == "highscore") {
			highscoreLabels.push(els[i]);
		} else if (atr == "totalDeaths") {
			totalDeathsLabels.push(els[i]);
		}
	}
	highscoreLabels.forEach((item) => {
		item.innerHTML = window.parent.gamedata.stats.player.highscore;
	});
	totalDeathsLabels.forEach((item) => {
		item.innerHTML = window.parent.gamedata.stats.player.totalDeaths;
	})
}

loadPageInfo();