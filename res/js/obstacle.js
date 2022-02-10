class Obstacle extends Entity {
	constructor(game, x, y, z, index) {
		super(game, 10, 10, x, y, z, {
			color: 0xff0000
		});
		this.index = index;
	}
	update() {
		// Update position
		this.cube.position.z -= this.game.obstacleSpeed;
		// Check if off map
		if (this.cube.position.z < -5) {
			// Find self
			for (var i = 0; i < this.game.obstacles.length; i++) {
				var c = this.game.obstacles[i];
				if (c.index == this.index) {
					this.game.scene.remove(
						this.cube
					);
					this.game.obstacles.splice(i, 1);
					delete this;
				}
			}
		}
		// Check collision
		for (var vertexIndex = 0; vertexIndex < this.cube.geometry.attributes.position.array.length; vertexIndex++) {
			var localVertex = new THREE.Vector3().fromBufferAttribute(this.cube.geometry.attributes.position, vertexIndex).clone();
			var globalVertex = localVertex
				.applyMatrix4(this.cube.matrix);
			var directionVector = globalVertex
				.sub(this.cube.position);
			var ray = new THREE.Raycaster(
				this.cube.position,
				directionVector
					.normalize()
					.clone()
			);
			var collisionResults = ray.intersectObjects([this.game.player.cube]);
			if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
				this.game.player.collide(this);
			}
		}
	}
}