var THREE = window.THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var scene = new THREE.Scene(),
    loader = new THREE.TextureLoader(),
    textGroup = new THREE.Group(),
    camera,
    light,
    mouse,
    center,
    renderer;


var init = function() {

    for ( var i = 9; i>=1; i--) {
        if (i === 1) {
            material = new THREE.MeshLambertMaterial({
                map: loader.load('src/img/layer-0' + i + '.jpg')
            });
        } else {
            var material = new THREE.MeshLambertMaterial({
                map: loader.load('src/img/layer-0' + i + '.png')
            });
        }

        var geometry = new THREE.PlaneGeometry(280 -(i*1.8) , 200 -(i*1.8) , 20, 20);

        var mesh = new THREE.Mesh(geometry, material);
        mesh.material.transparent = true;

        mesh.position.set(0,0, i);

        if ( i === 3 || i === 4 || i === 7) {
            textGroup.add(mesh);
        } else {
            scene.add(mesh);
        }
    }

    threeImg.push(textGroup);
    scene.add(textGroup);

    light = new THREE.PointLight(0xffffff, 1,1000, 0.5);
    light.position.set(1,1,100);
    scene.add(light);


    // create an locate the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var controls = new OrbitControls( camera );

    camera.position.z = 100;
    // camera.position.set(140, 120, -140);
    // center = new THREE.Vector3();
    // center.z = -50;
    controls.update();
    controls.enableDamping = true;
    controls.dampingFactor = 0.9;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1;
    controls.maxPolarAngle = Math.PI/2;
    // controls.minPolarAngle = 0;
    controls.maxAzimuthAngle = Math.PI/12;
    controls.minAzimuthAngle = -Math.PI/12;
    controls.minDistance = 100;
    controls.maxDistance = 100;
    controls.enablePan = false;

    threeObj.push(controls);

    // create the renderer
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );

    document.body.appendChild(renderer.domElement);
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'wheel', onMouseWheel, false);

};

function onMouseWheel(e) {
    console.log(e.deltaY);
    if (e.deltaY > 0 && threeImg[0].position.y >= -45) {
        threeImg[0].position.y -= 5;
    } else if (e.deltaY < 0 && threeImg[0].position.y <= 0) {
        threeImg[0].position.y += 5;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// main animation loop - calls 50-60 times per second.
var mainLoop = function() {
    threeObj[0].update();
    // threeImg[0].position.y = threeObj[0].getPolarAngle ();
    // console.log(threeObj[0].getPolarAngle ());
    requestAnimationFrame(mainLoop);

    renderer.render(scene, camera);
};

init();
mainLoop();

