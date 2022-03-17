const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("viewport").appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material1 = new THREE.MeshLambertMaterial({
	color: "rgb(255, 0, 0)"
});
const material2 = new THREE.MeshPhongMaterial({
	color: "rgb(255, 25, 0)"
});
const material3 = new THREE.MeshPhongMaterial({
	color: "rgb(255, 50, 0)"
});
const cube = new THREE.Mesh( geometry, [
	material1,
	material1,
	material1,
	material1,
	material1,
	material1
]);
cube.rotation.y = (Math.PI / 180) * 45;
cube.rotation.x = (Math.PI / 180) * 25;
scene.add(cube);

var wireframe = new THREE.WireframeGeometry(geometry);
var lines = new THREE.LineSegments(wireframe);
lines.rotation.y = (Math.PI / 180) * 45;
lines.rotation.x = (Math.PI / 180) * 15;
//scene.add(lines);
var lightMin = -2;
var lightMax = 2;
var lightDir = 1;

var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 1, 2);
scene.add(light);
				   
var sdate = (new Date()).getTime();
var ndate = sdate;

camera.position.z = 2;
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();

window.setInterval(() => {
	cube.rotation.y += (Math.PI / 180) * 1;
	//light.position.x += lightDir * 0.01;
	if (light.position.x >= lightMax || light.position.x <= lightMin) {
		lightDir *= -1;
	}
	if ((new Date()).getTime() % 20 == 0) {
		
	}
}, 15);

window.setInterval(() => {
	//cube.rotation.x += (Math.PI / 180) * 5;
}, 1000);

window.onresize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}