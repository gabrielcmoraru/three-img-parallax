var THREE = window.THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var scene = new THREE.Scene(),
    imgLoader = new THREE.TextureLoader(),
    fontLoader = new THREE.FontLoader(),
    textGroup = new THREE.Group(),
    text1 = 'Infinite',
    camera,
    light,
    mouse,
    center,
    renderer;

var init = function() {
    fontLoader.load( 'src/fonts/criteria-thin.json', function (font) {
        var textGeometry = new THREE.TextGeometry( text1, {
            font: font,
            size: 10,
            height: 0,
            curveSegments: 20,
            // bevelEnabled: true,
            // bevelThickness: 0,
            // bevelSize: 0,
            // bevelOffset: 0,
            // bevelSegments: 0
        });

        var textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff});

        var mesh = new THREE.Mesh( textGeometry, textMaterial);
        mesh.position.set(-100,30,3);
        scene.add(mesh);
    });

    imgLoader.load("src/img/cloud.png", function(texture){
        var cloudGeo = new THREE.PlaneBufferGeometry(50,50);
        var cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });
        for(let p=0; p<10; p++) {
            let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
            cloud.position.set(
            Math.random()*300 -100,
            80,
            -5-p
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*360;
            cloud.material.opacity = 0.5;
            scene.add(cloud);
            cloudParticles.push(cloud);
        }
    });

    var flash = new THREE.PointLight(0xffffff, 30, 500 ,1.7);
    flash.position.set(200,300,300);
    scene.add(flash);
    flashObj.push(flash);

    for ( var i = 9; i>=2; i--) {
        if (i === 1) {
            material = new THREE.MeshLambertMaterial({
                map: imgLoader.load('src/img/layer-0' + i + '.jpg')
            });
        } else {
            var material = new THREE.MeshLambertMaterial({
                map: imgLoader.load('src/img/layer-0' + i + '.png')
            });
        }

        var geometry = new THREE.PlaneGeometry(280 -(i*1.8) , 200 -(i*1.8) , 20, 20);

        var mesh = new THREE.Mesh(geometry, material);
        mesh.material.transparent = true;

        mesh.position.set(0,0, i);

        textGroup.add(mesh);
        // if ( i === 3 || i === 4 || i === 7) {
        //     textGroup.add(mesh);
        // } else {
        //     scene.add(mesh);
        // }
    }

    threeImg.push(textGroup);
    scene.add(textGroup);

    light = new THREE.PointLight(0xffffff, 1,1000, 0);
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
    controls.maxAzimuthAngle = Math.PI/20;
    controls.minAzimuthAngle = -Math.PI/20;
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

// function onMouseWheel(e) {
//     console.log(e.deltaY);
//     if (e.deltaY > 0 && threeImg[0].position.y >= -45) {
//         threeImg[0].position.y -= 5;
//     } else if (e.deltaY < 0 && threeImg[0].position.y <= 0) {
//         threeImg[0].position.y += 5;
//     }
// }
function onMouseWheel(e) {

    if (e.deltaY > 0 && threeImg[0].children[3].position.y >= -45) {

        threeImg[0].children.forEach((v,k) => {
            v.position.y -= (0.1+(k/4));
        });
    } else if (e.deltaY < 0 && threeImg[0].children[3].position.y <= 0) {

        threeImg[0].children.forEach((v,k) => {
            v.position.y += (0.1+(k/4));
        });
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// main animation loop - calls 50-60 times per second.
var mainLoop = function() {
    function animate() {
        cloudParticles.forEach(p => {
          p.rotation.z -=0.001;
          p.rotation.x -=0.001;
          if(Math.random() > 0.93 || flashObj[0].power > 100) {
              if(flashObj[0].power < 100)
                flashObj[0].position.set(
                  Math.random()*400,
                  300 + Math.random() *200,
                  100
                );
              flashObj[0].power = 50 + Math.random() * 500;

      }
        });
    }
    animate();
    threeObj[0].update();
    // threeImg[0].position.y = threeObj[0].getPolarAngle ();
    // console.log(threeObj[0].getPolarAngle ());
    requestAnimationFrame(mainLoop);

    renderer.render(scene, camera);
};

init();
mainLoop();

