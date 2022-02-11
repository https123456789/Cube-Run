class Obstacle extends Entity {
	constructor(game, x, y, z, index) {
		super(game, 10, 10, x, y, z, {
			color: 0xff0000
		});
		this.index = index;
	}
	update() {
		// Update position
		this.updatePosition();
		// Check if off map
		this.mapBoundsCheck();
		// Check collision
		this.preformCollisionCheck();
	}
	updatePosition() {
		this.cube.position.z -= this.game.obstacleSpeed;
	}
	mapBoundsCheck() {
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
	}
	preformCollisionCheck() {
		for (var vertexIndex = 0; vertexIndex < this.cube.geometry.attributes.position.array.length; vertexIndex++) {
			var localVertex = new THREE.Vector3()
				.fromBufferAttribute(
					this.cube.geometry.attributes.position,
					vertexIndex
				).clone();
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

class RectangularObstacle extends Obstacle {
	constructor(game, x, y, z, index, distortAxis, distortAmount = 2, config = {}) {
		super(game, x, y, z, {
			color: "rgb(255, 0, 0)"
		});
		this.index = index;
		this.config = config;
		this.distortAxis = distortAxis;
		this.distortAmount = distortAmount;
		this.cube.scale[this.distortAxis] *= this.dirstorAmount;
	}
	update() {
		// Update position
		this.updatePosition();
		// Distortions
		this.updateDistortions();
		// Check if off map
		this.mapBoundsCheck();
		// Check collision
		this.preformCollisionCheck();
	}
	updateDistortions() {
		if (this.config.distortAnimations) {
			if (this.config.distortAnimations.loop) {
				
			}
		}
	}
}

class BasicObstacle extends Obstacle {
	constructor(game, x, y, z, index) {
		super(game, x, y, z, index);
	}
}

class RotatingObstacle extends Obstacle {
	constructor(game, x, y, z, index, rotspeed, rotAxis) {
		super(game, x, y, z, index);
		this.rotspeed = rotspeed;
		this.rotAxis = rotAxis;
		this.cube.material.color.setHex(0x00ff00);
	}
	update() {
		// Update position
		this.updatePosition();
		// Add rotation
		this.updateRotation();
		// Check if off map
		this.mapBoundsCheck();
		// Check collision
		this.preformCollisionCheck();
	}
	updateRotation() {
		this.cube.rotation[this.rotAxis] += this.rotspeed;
	}
}