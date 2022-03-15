var game = new Game();

// Connect "buttons" on the home screen to the game
var startButton = document.getElementById("startButton");
var helpButton = document.getElementById("helpButton");
var creditsButton = document.getElementById("creditsButton");
var settingsButton = document.getElementById("settingsButton");
var loadingDiv = document.getElementById("loadingDiv");

startButton.onclick = () => {
	window.setTimeout(() => {
		/*
		// Play woosh sound
		var wooshSound = new Audio("res/sound/woosh.mp3")
		wooshSound.play();
		*/
		loadingDiv.classList.remove("fade-in");
		game.start();
	}, 2500);
	//document.getElementById("startMenu").classList.add("fade");
	startButton.classList.add("fade");
	creditsButton.classList.add("fade");
	helpButton.classList.add("fade");
	settingsButton.classList.add("fade");
	loadingDiv.classList.add("fade-in");
	//startButton.classList.add("spin-dont-[save");
	var menuHiderUpdater = window.setTimeout(() => {
		console.log("update");
		if (!game.updater) {
			return;
		}
		startButton.classList.remove("fade");
		creditsButton.classList.remove("fade");
		helpButton.classList.remove("fade");
		settingsButton.classList.remove("fade");
		alert("clearing");
		window.clearTimeout(menuHiderUpdater);
	}, 500);
};

helpButton.onclick = () => {
	var el = document.createElement("iframe");
	el.src = "help.html";
	el.id = "helpIframe";
	el.classList.add("iframeWindow");
	//el.style.display = "none";
	document.body.appendChild(el);
	el.onload = () => {
		//el.style.display = "block";
		el.classList.add("slide-up");
	}
}

creditsButton.onclick = () => {
	//creditsButton.classList.add("spin-dont-save");
	rollCredits();
};

settingsButton.onclick = () => {
	var el = document.createElement("iframe");
	el.id = "settingsIframe";
	el.src = "settings.html";
	el.classList.add("iframeWindow");
	document.body.appendChild(el);
	el.onload = () => {
		el.classList.add("slide-up");
	}
}

function rollCredits() {
	var el = document.createElement("iframe");
	el.src = "credits.html";
	el.id = "creditsIframe";
	el.classList.add("iframeWindow");
	el.style.display = "none";
	document.body.appendChild(el);
	el.onload = () => {
		el.style.display = "block";
		el.classList.add("slide-up");
	}
}

window.onmessage = (event) => {
	switch (event.data) {
		case "creditsEnded":
			window.setTimeout(() => {
				document.body.removeChild(
					document.getElementById("creditsIframe")
				);
			}, 1000);
			break;
		case "helpEnded":
			window.setTimeout(() => {
				document.body.removeChild(
					document.getElementById("helpIframe")
				);
			}, 1000);
		case "settingsEnded":
			window.setTimeout(() => {
				document.body.removeChild(
					document.getElementById("settingsIframe")
				);
			}, 1000);
	}
}