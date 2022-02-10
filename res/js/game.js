class Game {
	constructor() {
		/* Three.js Components */
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.z = -5;
		this.camera.position.y = 2;
		this.camera.rotation.y = 15.708;
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(
			window.innerWidth,
			window.innerHeight
		);
		document.body.appendChild(this.renderer.domElement);
		/* Game Components */
		this.gameFloor = new GameFloor(this);
		this.player = new Player(this);

		this.paused = false;

		/* Levels */
		this.level = 1;
		this.levelChanges = false;
		this.levelTimeSwitch = 10000;
		this.levelStartTime = null;
		
		/* Obstacles */
		this.obstacles = [];
		this.obstacleMax = 10;
		this.obstacleIndex = 0;
		this.obstacleSpeed = 0.1;
		
		this.updater = null;
		/* Set Default Key Bindings */
		window.gamedata = {
			keybindings: {
				selection: "default",
				selections: {
					default: {
						left: "a",
						right: "d"
					}
				}
			}
		};

		document.addEventListener("visibilitychange", (event) => {
			if (document.hidden) {
				this.paused = true;
			} else {
				this.paused = false;
			}
		});
	}
	start() {
		this.levelStartTime = (new Date).getTime();
		this.updater = window.setInterval(() => {
			this.update();
		}, (1000/60));
	}
	die() {
		window.clearInterval(this.updater);
	}
	update() {
		if (this.paused) {
			return;
		}
		/* Game level update */
		var now = (new Date).getTime();
		if (now - this.levelStartTime >= this.levelTimeSwitch) {
			this.level += 1;
			this.levelStartTime = now;
			this.levelChanged = true;
			this.levelTimeSwitch += 1000;
		}
		if (this.levelChanged) {
			this.obstacleSpeed += 0.01;
			this.levelChanged = false;
		}
		/* Update Labels */
		document.getElementById("levelDisplay").innerHTML = this.level;
		/* Three update */
		this.updateSize();
		/* Update Entities */
		this.updateObstacles();
		this.player.update();
		/* Render */
		this.renderer.render(this.scene, this.camera);
	}
	updateSize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	updateObstacles() {
		var i = 0;
		for (i = 0; i < this.obstacles.length; i++) {
			this.obstacles[i].update();
		}
		if (this.obstacles.length >= this.obstacleMax) {
			return;
		}
		this.spawnObstacle();
	}
	spawnObstacle() {
		var x = Math.floor(Math.random() * 20);
		// Make even values negative
		if (x % 2 == 0) {
			x *= -1;
		}
		var y = 0;
		var z = 100;
		var newobst = new Obstacle(this, x, y, z, this.obstacleIndex);
		this.obstacleIndex += 1;
		this.obstacles.push(newobst);
	}
}

class GameFloor {
	constructor(game) {
		this.game = game;
		this.geometry = new THREE.PlaneGeometry(1, 1);
		this.material = new THREE.MeshBasicMaterial({
			color: "rgb(255, 255, 255)",
			side: THREE.DoubleSide
		});
		this.mesh = new THREE.Mesh(
			this.geometry,
			this.material
		);
		this.mesh.rotation.x += 1.5708;
		this.mesh.scale.x = window.innerWidth;
		this.mesh.scale.y = window.innerHeight;
		this.mesh.position.z += window.innerHeight / 4;
		this.mesh.position.y -= 0.5;
		this.game.scene.add(this.mesh);
	}
	update() {
		
	}
}