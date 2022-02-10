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
		}
		if (this.keys.right) {
			this.cube.position.x -= this.speed;
			this.game.camera.position.x -= this.speed;
		}
		if (this.cube.position.x < this.game.bounds.right) {
			this.cube.position.x = this.game.bounds.right;
			this.game.camera.position.x = this.game.bounds.right;
		}
		if (this.cube.position.x > this.game.bounds.left) {
			this.cube.position.x = this.game.bounds.left;
			this.game.camera.position.x = this.game.bounds.left;
		}
	}
	collide(collider) {
		this.game.die();
	}
	/* Key Events */
	keydownEvent(event) {
		var key = event.key;
		var action = this.checkKeyAction(key);
		if (action > 1) {
			return;
		}
		if (action > 0) {
			this.keys.right = true;
			this.keys.left = false;
		} else {
			this.keys.left = true;
			this.keys.right = false;
		}
	}
	keyupEvent(evnet) {
		var key = event.key;
		var action = this.checkKeyAction(key);
		if (action > 1) {
			return;
		}
		if (action > 0) {
			this.keys.right = false;
		} else {
			this.keys.left = false;
		}
	}
	checkKeyAction(key) {
		if (key == window.gamedata.keybindings.selections[window.gamedata.keybindings.selection].left) {
			return 0;
		} else if (key == window.gamedata.keybindings.selections[window.gamedata.keybindings.selection].right) {
			return 1;
		} else {
			return 2;
		}
	}
}