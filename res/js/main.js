var game = new Game();

// Connect "buttons" on the home screen to the game
var startButton = document.getElementById("startButton");
var creditsButton = document.getElementById("creditsButton");

startButton.onclick = () => {
	game.start();
};

creditsButton.onclick = () => {
	rollCredits();
};

function rollCredits() {
	var el = document.createElement("iframe");
	el.src = "credits.html";
	el.id = "creditsIframe";
	document.body.appendChild(el);
}

window.onmessage = (event) => {
	if (event.data == "creditsEnded") {
		document.body.removeChild(
			document.getElementById("creditsIframe")
		);
	}
}