class Game {
	constructor() {
		/* Init events */
		this.startEvent = new CustomEvent("start", {
			detail: {
				
			}
		})
		this.threeInit();
		this.init();
	}
	threeInit() {
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
	}
	init() {
		/* Game Components */
		this.bounds = {
			left: 50,
			right: -50
		};
		
		this.gameFloor = new GameFloor(this);
		this.player = new Player(this);
		this.gameLighting = new GameLighting(this, 0, 5, -5, 0xffffff, 0);
		//this.leftLighting = new GameLighting(this, this.bounds.left, 0, 20, 0xffffff, 2);
		//this.rightLighting = new GameLighting(this, this.bounds.right, 0, 20, 0xffffff, 2);
		//this.movingSpotLight = new MovingSpotLight(this);

		this.paused = false;
		this.gameStartTime = null;
		this.dead = false;

		/* Levels */
		this.level = 1;
		this.levelChanges = false;
		this.levelTimeSwitch = 20000;
		this.levelStartTime = null;

		/* Obstacles */
		this.obstacles = [];
		this.obstacleMax = 20 + Math.floor(this.bounds.left * 0.2);
		this.obstacleIndex = 0;
		this.obstacleSpeed = 0.2;
		
		this.updater = null;
		/* Initalize Key Bindings */
		if (!localStorage.getItem("keybindings")) {
			console.log("No localStorage keybindings");
			window.gamedata = {
				keybindings: {
					selection: "default",
					selections: {
						default: {
							left: "a",
							right: "d",
							pause: "p"
						},
						arrows: {
							left: "ArrowLeft",
							right: "ArrowRight",
							pause: "p"
						}
					}
				}
			};
			localStorage.setItem("keybindings", JSON.stringify(window.gamedata.keybindings));
		} else {
			window.gamedata = {
				keybindings: {
					
				}
			};
			window.gamedata.keybindings = JSON.parse(localStorage.getItem("keybindings"));
		}

		/* Initalize stats */
		if (!localStorage.getItem("stats")) {
			console.log("No localStorage stats");
			window.gamedata.stats = {
				player: {
					highscore: 0,
					totalDeaths: 0
				}
			}
			localStorage.setItem("stats", JSON.stringify(window.gamedata.stats));
		} else {
			window.gamedata.stats = JSON.parse(localStorage.getItem("stats"));
		}

		console.log(window.gamedata);

		document.addEventListener("visibilitychange", () => {
			if (document.hidden && this.updater) {
				this.pause();
			}
		});
	}
	start() {
		this.gameStartTime = (new Date()).getTime();
		this.levelStartTime = this.gameStartTime;
		document.getElementById("info").style.top = 0;
		document.getElementById("startMenu").style.display = "none";
		document.getElementById("bg").style.display = "none";
		this.updater = window.setInterval(() => {
			this.update();
		}, (1000/60));
		// Dispatch start event
		window.dispatchEvent(this.startEvent);
	}
	restart() {
		// Reset game
	}
	die() {
		this.dead = true;
		console.log("game ended.");
		// Save game data
		this.updateStats();
		// End Game
		document.getElementById("gameOver").style.display = "block";
		window.clearInterval(this.updater);
		this.updater = null;
	}
	update() {
		var now = (new Date).getTime();
		if (now % 100 == 0) {
			this.updateStats();
		}
		if (this.paused) {
			return;
		}
		/* Game level update */
		if (now - this.levelStartTime >= this.levelTimeSwitch) {
			this.level += 1;
			this.levelStartTime = now;
			this.levelChanged = true;
			this.levelTimeSwitch += 1;
			this.obstacleMax += parseInt(0.2 * this.obstacleMax);
		}
		if (this.levelChanged) {
			this.obstacleSpeed += 0.01;
			this.levelChanged = false;
		}
		/* Update score */
		this.player.score = Math.floor((this.player.scoreFactor * this.player.distanceTraveled) * 100) / 100;
		if (this.player.score > window.gamedata.stats.player.highscore) {
			window.gamedata.stats.player.highscore = this.player.score;
		}
		
		/* Update Labels */
		document.getElementById("levelDisplay").innerHTML = this.level;
		if ((now % 10) == 0) {
			var els = document.getElementsByClassName("javascript-score-label");
			for (var i = 0; i < els.length; i++) {
				els[i].innerHTML = Math.floor(this.player.score).toLocaleString();
			}
		}
		var els = document.getElementsByClassName("javascript-version-label");
		for (var i = 0; i < els.length; i++) {
			els[i].innerHTML = "v" + VERSION + " " + VERSION_SUFFIX;
		}
		document.getElementById("obstmax").innerHTML = this.obstacleMax;
		/* Three update */
		this.updateSize();
		/* Update Entities */
		if (this.gameLighting.light.intensity < 1) {
			this.gameLighting.light.intensity += Math.floor(this.gameLighting.light.intensity * 0.1) ? Math.floor(this.gameLighting.light.intensity * 0.1) : 0.01;
		}
		this.updateObstacles();
		this.player.update();
		/* Render */
		this.renderer.render(this.scene, this.camera);
	}
	updateStats() {
		// Save
		localStorage.setItem("stats", JSON.stringify(window.gamedata.stats));
		console.log("Updated game stats.");
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
			var r = Math.floor(Math.random() * 10);
			switch (r) {
				case 10:
				case 9:
					this.spawnRotatingObstacle();
					break;
				case 8:
				case 7:
				case 6:
				case 5:
					this.spawnRectObstacle();
					break;
				default:
					this.spawnBasicObstacle();
					break;
			}
		}
	}
	
	// Obstacle Spawning
	spawnBasicObstacle() {
		var x = Math.floor(Math.random() * (this.bounds.left * 1));
		// Make even values negative
		if (x % 2 == 0) {
			x *= -1;
		}
		var y = 0;
		var z = 100;
		var newobst = new BasicObstacle(this, x, y, z, this.obstacleIndex);
		this.obstacleIndex += 1;
		this.obstacles.push(newobst);
	}
	
	spawnRotatingObstacle() {
		var x = Math.floor(Math.random() * (this.bounds.left * 1));
		// Make even values negative
		if (x % 2 == 0) {
			x *= -1;
		}
		var y = 0;
		var z = 100;
		var axs = ["x", "y", "z"];
		var newobst = new RotatingObstacle(this, x, y, z, this.obstacleIndex, 0.01, axs[(Math.floor(Math.random() * 3))]);
		this.obstacleIndex += 1;
		this.obstacles.push(newobst);
	}

	spawnRectObstacle() {
		var x = Math.floor(Math.random() * (this.bounds.left * 1));
		// Make even values negative
		if (x % 2 == 0) {
			x *= -1;
		}
		var y = 0;
		var z = 100;
		var axs = ["x","z"];
		var newobst = new RectangularObstacle(
			this,
			x, y, z,
			this.obstacleIndex,
			axs[(Math.floor(Math.random() * axs.length))],
			Math.floor(Math.random() * 5) + 1,
			{
				distortAnimations: {
					loop: {
						incr: 0.1
					}
				}
			}
		);
		this.obstacleIndex += 1;
		this.obstacles.push(newobst);
	}
	
	// Pause and Unpause
	pause() {
		this.paused = true;
		document.getElementById("pauseMenu").style.display = "block";
	}
	unpause() {
		this.paused = false;
		document.getElementById("pauseMenu").style.display = "none";
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