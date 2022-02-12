class Player extends Entity {
	constructor(game) {
		super(game, 20, 20, 0, 0, 1, {
			color: 0x0000ff
		});
		this.keys = {
			left: false,
			rigth: false
		}
		window.addEventListener("keydown", (event) => {
			this.keydownEvent(event);
		});
		window.addEventListener("keyup", (event) => {
			this.keyupEvent(event);
		});
		this.speed = 0.1;
	}
	update() {
		if (this.keys.left) {
			this.cube.position.x += this.speed;
			this.game.camera.position.x += this.speed;
			this.game.gameLighting.light.position.x += this.speed;
		}
		if (this.keys.right) {
			this.cube.position.x -= this.speed;
			this.game.camera.position.x -= this.speed;
			this.game.gameLighting.light.position.x -= this.speed;
		}
		if (this.cube.position.x < this.game.bounds.right) {
			this.cube.position.x = this.game.bounds.right;
			this.game.camera.position.x = this.game.bounds.right;
			this.game.gameLighting.light.position.x = this.game.bounds.right;
		}
		if (this.cube.position.x > this.game.bounds.left) {
			this.cube.position.x = this.game.bounds.left;
			this.game.camera.position.x = this.game.bounds.left;
			this.game.gameLighting.light.position.x = this.game.bounds.left;
		}
	}
	collide(collider) {
		this.game.die();
	}
	/* Key Events */
	keydownEvent(event) {
		var key = event.key;
		var action = this.checkKeyAction(key);
		if (action < 0) {
			return;
		}
		switch (action) {
			case 0:
				this.keys.left = true;
				this.keys.right = false;
				break;
			case 1:
				this.keys.right = true;
				this.keys.left = false;
				break;
			case 2:
				if (!this.game.updater) {
					break;
				}
				this.game.paused = !this.game.paused;
				if (this.game.paused) {
					document.getElementById("pauseMenu").style.display = "block";
				} else {
					document.getElementById("pauseMenu").style.display = "none";
				}
				break;
		}
	}
	keyupEvent(evnet) {
		var key = event.key;
		var action = this.checkKeyAction(key);
		if (action < 0) {
			return;
		}
		switch (action) {
			case 0:
				this.keys.left = false;
				break;
			case 1:
				this.keys.right = false;
				break;
		}
	}
	checkKeyAction(key) {
		if (key == window.gamedata.keybindings.selections[window.gamedata.keybindings.selection].left) {
			return 0;
		} else if (key == window.gamedata.keybindings.selections[window.gamedata.keybindings.selection].right) {
			return 1;
		} else if (key == window.gamedata.keybindings.selections[window.gamedata.keybindings.selection].pause) {
			return 2;
		} else {
			return -1;
		}
	}
}