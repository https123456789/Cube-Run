var game = new Game();

// Connect "buttons" on the home screen to the game
var startButton = document.getElementById("startButton");
var creditsButton = document.getElementById("creditsButton");

startButton.onclick = () => {
	window.setTimeout(() => {
		game.start();
	}, 2500);
	document.getElementById("startMenu").classList.add("fade");
};

creditsButton.onclick = () => {
	rollCredits();
};

function rollCredits() {
	var el = document.createElement("iframe");
	el.src = "credits.html";
	el.id = "creditsIframe";
	//el.style.opacity = "0";
	el.classList.add("slide-up");
	document.body.appendChild(el);
}

window.onmessage = (event) => {
	if (event.data == "creditsEnded") {
		window.setTimeout(() => {
			document.body.removeChild(
				document.getElementById("creditsIframe")
			);
		}, 1000);
		document.getElementById("creditsIframe").classList.remove("slide-up");
		document.getElementById("creditsIframe").classList.add("slide-off-screen");
	}
}