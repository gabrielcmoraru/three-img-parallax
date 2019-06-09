var THREE = window.THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var parallaxHeader = {
    vars: {
        threeObj: [],
        threeImg: [],
        threeTxt: [],
        cloudParticles: [],
        flashObj: [],
        scene: new THREE.Scene(),
        imgLoader: new THREE.TextureLoader(),
        fontLoader: new THREE.FontLoader(),
        textGroup: new THREE.Group(),
        camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
        renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
        mouseTolerance: 0.02,
        cloudTexture: "src/img/cloud.png",
        textFont: 'src/fonts/criteria-thin.json',
        textFont2: 'src/fonts/flexo.json',
        textFont3: 'src/fonts/criteria-bold.json',
        text1: 'Infinite',
        text2: 'entertainment',
        text3: 'Synamedia'
    },
    minMax: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    fontLoad: function (textFont, textContent, size, posX, posY, posZ) {
        var $that = this;
        this.vars.fontLoader.load( textFont, function (font) {
            var textGeometry = new THREE.TextGeometry( textContent, {
                font: font,
                size: size,
                height: 0.5,
                curveSegments: 0,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 0
            });
            var textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff});
            var mesh = new THREE.Mesh( textGeometry, textMaterial);
            mesh.position.set(posX,posY,posZ);
            $that.vars.textGroup.add(mesh);
        });
        this.vars.scene.add(this.vars.textGroup);
        this.vars.threeTxt.push(this.vars.textGroup);
    },
    imagesLoad: function () {
        for ( var i = 9; i>=2; i--) {
            if( i === 7 ) { i-- };//replaced with 3d text
            if( i === 4 ) { i-- };//replaced with 3d text
            if( i === 3 ) { i-- };//replaced with 3d text
            var material = new THREE.MeshLambertMaterial({
                map: this.vars.imgLoader.load('src/img/layer-0' + i + '.png')
            });
            var geometry = new THREE.PlaneGeometry(280 +(i*3) , 200 +(i*3) , 30, 30);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.material.transparent = true;
            mesh.position.set(0,0,i);
            this.vars.textGroup.add(mesh);
            this.vars.scene.add(mesh);
            this.vars.threeImg.push(mesh);
        }
    },
    cloudLoad: function (cloudTexture, sizeMin, sizeMax) {
        var $that = this;
        this.vars.imgLoader.load(cloudTexture, function(texture){
            var cloudGeo = new THREE.PlaneBufferGeometry($that.minMax(sizeMin, sizeMax), $that.minMax(sizeMin, sizeMax));
            var cloudMaterial = new THREE.MeshLambertMaterial({
                map: texture,
                transparent: true
            });
            for(let p=0; p<10; p++) {
                let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
                cloud.position.set((Math.random()*300-100), 80, (-p-50));
                // cloud.rotation.x = Math.random()*100;
                // cloud.rotation.y = Math.random()*360;
                cloud.rotation.z = Math.random()*360;
                cloud.material.opacity = 0.5;
                $that.vars.scene.add(cloud);
                $that.vars.cloudParticles.push(cloud);
            }
        });
    },
    onMouseWheel: function (e) {
        if (e.deltaY > 0 && parallaxHeader.vars.threeImg[3].position.y >= -30) {
            parallaxHeader.vars.threeTxt[0].children[0].position.y -= 0.9;
            parallaxHeader.vars.threeTxt[0].children[1].position.y -= 0.5;
            parallaxHeader.vars.threeTxt[0].children[2].position.y -= 0.9;
            parallaxHeader.vars.threeImg.forEach((v,k) => {
                v.position.y -= (0.1+(k/4));
            });
        } else if (e.deltaY < 0 && parallaxHeader.vars.threeImg[3].position.y <= 0) {
            parallaxHeader.vars.threeTxt[0].children[0].position.y += 0.9;
            parallaxHeader.vars.threeTxt[0].children[1].position.y += 0.5;
            parallaxHeader.vars.threeTxt[0].children[2].position.y += 0.9;
            parallaxHeader.vars.threeImg.forEach((v,k) => {
                v.position.y += (0.1+(k/4));
            });
        }
    },
    onMouseMove: function (e) {
        var centerX = window.innerWidth * 0.5;
        var centerY = window.innerHeight * 0.5;

        parallaxHeader.vars.threeImg.forEach( img => {
            img.rotation.y = (e.clientX - centerX) / centerX * parallaxHeader.vars.mouseTolerance;
        })
        parallaxHeader.vars.threeImg.forEach( img => {
            img.rotation.x = (e.clientY - centerY) / centerY * parallaxHeader.vars.mouseTolerance;
        })

        parallaxHeader.vars.threeTxt.forEach( txt => {
            txt.rotation.y = (e.clientX - centerX) / centerX * parallaxHeader.vars.mouseTolerance;
        })
        parallaxHeader.vars.threeTxt.forEach( txt => {
            txt.rotation.x = (e.clientY - centerY) / centerY * parallaxHeader.vars.mouseTolerance;
        })
    },
    onWindowResize: function () {
        parallaxHeader.vars.camera.aspect = window.innerWidth / window.innerHeight;
        parallaxHeader.vars.camera.updateProjectionMatrix();
        parallaxHeader.vars.renderer.setSize( window.innerWidth, window.innerHeight );
    },
    cameraInit: function () {
        // create an locate the camera
        // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // var controls = new OrbitControls( this.vars.camera );

        this.vars.camera.position.z = 100;
        // this.vars.camera.position.set(140, 120, -140);
        // center = new THREE.Vector3();
        // center.z = -50;
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.9;
        // controls.autoRotate = false;
        // controls.autoRotateSpeed = 1;
        // controls.maxPolarAngle = Math.PI/2;
        // controls.minPolarAngle = 0;
        // controls.maxAzimuthAngle = Math.PI/20;
        // controls.minAzimuthAngle = -Math.PI/20;
        // controls.minDistance = 100;
        // controls.maxDistance = 100;
        // controls.enablePan = false;
        // controls.update();

        // this.vars.threeObj.push(controls);
    },
    lightThunder: function (color, intensity, distance, decay, posX, posY, posZ) {
        var flash = new THREE.PointLight(color, intensity, distance, decay);
        flash.position.set(posX, posY, posZ);
        this.vars.scene.add(flash);
        this.vars.flashObj.push(flash);
    },
    lightPoint: function (color, intensity, distance, decay, posX, posY, posZ) {
        var light = new THREE.PointLight(color, intensity,distance, decay);
        light.position.set(posX, posY, posZ);
        this.vars.scene.add(light);
    },
    renderInit: function () {
        this.vars.renderer.setSize(window.innerWidth, window.innerHeight);
        this.vars.renderer.setPixelRatio( window.devicePixelRatio );
        document.body.appendChild(this.vars.renderer.domElement);
    },
    moveClouds: function() {
        this.vars.cloudParticles.forEach(cloud => {
        cloud.position.x -= 0.02;
        if (cloud.position.x < -200) {
            cloud.rotation.z = Math.random()*360;
            cloud.position.x = 200;
        }
        });
    },
    callThunder: function () {
        if( Math.random() > 0.93 || this.vars.flashObj[0].power > 100 ) {
            if( this.vars.flashObj[0].power < 100 )
                this.vars.flashObj[0].position.set( Math.random()*400, 300 + Math.random() *200, 100 );
                this.vars.flashObj[0].power = 50 + Math.random() * 500;
            }
    },
    mainLoop: function() {
        parallaxHeader.moveClouds();
        // parallaxHeader.vars.threeObj[0].update();
        parallaxHeader.vars.renderer.render(parallaxHeader.vars.scene, parallaxHeader.vars.camera);
        requestAnimationFrame(parallaxHeader.mainLoop);
    },
    evenListeners: function () {
        var $that = this;
        window.addEventListener( 'resize', $that.onWindowResize, false );
        document.addEventListener( 'wheel', $that.onMouseWheel, false);
        document.onmousemove = this.onMouseMove;
        // if (window.DeviceOrientationEvent) { window.addEventListener('deviceorientation', function(e) { $that.mobileTilt } ) };
    },
    init: function () {
        this.renderInit();
        this.cameraInit();
        this.lightPoint(0xffffff, 1, 1000, 0, 1, 1, 100);
        this.lightThunder(0xffffff, 30, 500, 1.7, 0, 0, -5);
        this.imagesLoad();
        this.fontLoad(this.vars.textFont2, this.vars.text1, 9, -100, 30, 3);
        this.fontLoad(this.vars.textFont2, this.vars.text2, 9, 22, 13, 6);
        this.fontLoad(this.vars.textFont2, this.vars.text3, 11, -37, 50, 2);
        this.cloudLoad(this.vars.cloudTexture, 50, 100);
        this.evenListeners();
        console.log(this.vars.threeImg)
        console.log(this.vars.threeObj)
    }
}

parallaxHeader.init();
parallaxHeader.mainLoop();
