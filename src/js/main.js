var THREE = window.THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var scene = new THREE.Scene(),
    camera,
    light,
    mouse,
    center,
    renderer;

var sceneWrapp = function () {
    var geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    var material = new THREE.MeshPhongMaterial({color: 'black', shininess: 500, side: THREE.DoubleSide, wireframe:false });

    var sceneWrapp = new THREE.Mesh(geometry, material);
    sceneWrapp.rotation.x = Math.PI / 2;
    sceneWrapp.position.y = -5;

    scene.add(sceneWrapp);
}

var init = function() {
    scene.background = new THREE.Color().setRGB( 125, 125, 125 );
    scene.fog = new THREE.Fog( scene.background, 0.1, 10000 );


    // create an locate the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    var controls = new OrbitControls( camera );
    camera.position.z = 100;
    camera.position.set(140, 120, -140);
    center = new THREE.Vector3();
    center.z = -500;
    controls.update();
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.maxPolarAngle = Math.PI/2;
    controls.maxDistance = 300;
    controls.enablePan = false;

    threeObj.push(controls);
    //THIS IS IMPORTANT !!!
    var hemiLight = new THREE.HemisphereLight( 'black', 'white', 1 );
    scene.add( hemiLight );


    // topLight.position.set(0,150,0);
    // // topLight.angle = 0.5;
    // // topLight.penumbra = 0.2;
    // topLight.distance = 200;
    // topLight.castShadow = true;
    // scene.add( topLight );

    // var topLightHelper = new THREE.SpotLightHelper(topLight);
    // scene.add( topLightHelper );

    sceneWrapp();


    // create the renderer
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );

    document.body.appendChild(renderer.domElement);
    window.addEventListener( 'resize', onWindowResize, false );

};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// main animation loop - calls 50-60 times per second.
var mainLoop = function() {
    threeObj[0].update();
    requestAnimationFrame(mainLoop);

    renderer.render(scene, camera);
};

init();
mainLoop();

