class Entity {
	constructor(game, width, height, x, y, z, config = {}) {
		this.game = game;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.z = z;
		if (config.color) {
			this.color = config.color;
		} else {
			this.color = "rgb(255, 255, 255)";
		}
		this.geometry = new THREE.BoxGeometry();
		this.material = new THREE.MeshLambertMaterial({
			color: this.color
		});
		this.cube = new THREE.Mesh(
			this.geometry,
			this.material
		);
		this.game.scene.add(this.cube);
		this.cube.position.x = this.x;
		this.cube.position.y = this.y;
		this.cube.position.z = this.z;
		this.cube.castShadow = true;
		this.cube.reciveShadow = true;
	}
	update() {
		
	}
}