class GameLighting {
	constructor(game, x, y, z, color = 0xffffff, intensity = 1) {
		this.game = game;
		this.light = new THREE.PointLight(color, intensity, 100);
		this.light.position.set(x, y, z);
		this.light.castShadow = true;
		this.game.scene.add(this.light);
		this.light.shadow.mapSize.width = 512;
		this.light.shadow.mapSize.height = 512;
		this.light.shadow.camera.near = 0.5;
		this.light.shadow.camera.far = 500;
	}
}

class MovingSpotLight extends GameLighting {
	constructor(game) {
		super(
			game,
			Math.floor(Math.random() * game.bounds.left),
			5,
			Math.abs(Math.floor(Math.random() * 500))
		);
		this.timeout = 500;
		this.idir = 1;
	}
	update() {
		if (this.timeout == 0) {
			this.timeout = 500;
		} else {
			this.timeout -= 1;
			return;
		}
		var x = Math.floor(Math.random() * this.game.bounds.left);
		var y = 5;
		var z = Math.abs(Math.floor(Math.random() * 500));
		this.light.position.x = x;
		this.light.position.y = y;
		this.light.position.z = z;
	}
}