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
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		document.body.appendChild(this.renderer.domElement);
		/* Game Components */
		this.gameFloor = new GameFloor(this);
		this.player = new Player(this);
		this.gameLighting = new GameLighting(this);

		this.bounds = {
			left: 5,
			right: -5
		};

		this.paused = false;
		this.textCanvas = document.getElementById("textCanvas");
		this.textCanvasCtx = this.textCanvas.getContext("2d");
		this.textCanvasCtx.height = 200;
		this.textCanvasCtx.width = 200;

		/* Levels */
		this.level = 1;
		this.levelChanges = false;
		this.levelTimeSwitch = 20000;
		this.levelStartTime = null;

		/* Obstacles */
		this.obstacles = [];
		this.obstacleMax = 20;
		this.obstacleIndex = 0;
		this.obstacleSpeed = 0.2;
		
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
		//this.textCanvas.style.display = "block";
		this.textCanvasUpdate();
		this.textCanvasCtx.font = '50px serif';
		this.textCanvasCtx.fillStyle = "rgb(255, 255, 255)";
		this.textCanvasCtx.fillText(
			"Game Over!",
			(
				0.1 * this.textCanvas.width
			),
			(
				0.5 * this.textCanvas.height
			),
			this.textCanvas.width
		);
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
			this.levelTimeSwitch += 100;
			this.obstacleMax += parseInt(0.1 * this.obstacleMax);
		}
		if (this.levelChanged) {
			this.obstacleSpeed += 0.01;
			this.levelChanged = false;
		}
		/* Update Labels */
		document.getElementById("levelDisplay").innerHTML = this.level;
		document.getElementById("version").innerHTML = VERSION;
		document.getElementById("versionSuffix").innerHTML = VERSION_SUFFIX;
		document.getElementById("obstmax").innerHTML = this.obstacleMax;
		/* Three update */
		this.updateSize();
		/* Update Entities */
		this.updateObstacles();
		this.player.update();
		/* Render */
		this.renderer.render(this.scene, this.camera);
	}
	textCanvasUpdate() {
		this.textCanvasCtx.fillStyle = "rgb(0, 0, 0)";
		this.textCanvasCtx.fillRect(
			0,
			0,
			this.textCanvasCtx.canvas.width,
			this.textCanvasCtx.canvas.height
		);
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
		if ((new Date).getTime() % 10 == 0) {
			this.spawnObstacle();
		}
	}
	spawnObstacle() {
		var x = Math.floor(Math.random() * (this.bounds.left * 2));
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
		this.material = new THREE.MeshPhongMaterial({
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
		this.mesh.reciveShadow = true;
		this.mesh.castShadow = false;
		this.game.scene.add(this.mesh);
	}
	update() {
		
	}
}

class GameLighting {
	constructor(game) {
		this.game = game;
		this.light = new THREE.PointLight("rgb(255, 255, 255)", 1, 100);
		this.light.position.set(0, 5, -5);
		this.light.castShadow = true;
		this.game.scene.add(this.light);
		this.light.shadow.mapSize.width = 512;
		this.light.shadow.mapSize.height = 512;
		this.light.shadow.camera.near = 0.5;
		this.light.shadow.camera.far = 500;
	}
}