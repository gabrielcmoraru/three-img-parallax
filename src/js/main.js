var THREE = window.THREE = require('three');
var Stats = require('stats-js');

var parallaxHeader = {
    vars: {
        threeObj: [],
        threeImg: [],
        threeTxt: [],
        threeSun: [],
        cloudParticles: [],
        flashObj: [],
        scene: new THREE.Scene(),
        imgLoader: new THREE.TextureLoader(),
        fontLoader: new THREE.FontLoader(),
        textGroup: new THREE.Group(),
        camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
        renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
        mouseTolerance: 0.02,
        thundeTime: 0,
        fps: new Stats(),
        clock: new THREE.Clock,
        sunR: 500,
        sunTheta: 0,
        sunDTheta: 2 * Math.PI / 1000,
        cloudTexture: "src/img/cloud.png",
        textFont: 'src/fonts/criteria-thin.json',
        textFont2: 'src/fonts/flexo.json',
        textFont3: 'src/fonts/criteria-bold.json',
        text1: 'Infinite',
        text2: 'entertainment',
        text3: 'Synamedia'
    },
    showFPS: function () {
        this.vars.fps.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.vars.fps.dom );
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
            mesh.name = `text-${textContent}`;
            mesh.castShadow = true;
            mesh.receiveShadow = false;
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
            var geometry = new THREE.PlaneGeometry(300 +(i*3) , 200 +(i*3) , 30, 30);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.material.transparent = true;
            mesh.name = `imagelayer-${i}`;
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
            for(let i=0; i<10; i++) {
                let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
                cloud.position.set((Math.random()*300-100), $that.minMax(90, 150), (-i-50));
                cloud.rotation.z = Math.random()*360;
                cloud.name = `cloud-${i}`;
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

        // parallaxHeader.vars.cloudParticles.forEach( cloud => {
        //     cloud.rotation.y = (e.clientX - centerX) / centerX * parallaxHeader.vars.mouseTolerance;
        // })
        // parallaxHeader.vars.cloudParticles.forEach( cloud => {
        //     cloud.rotation.x = (e.clientY - centerY) / centerY * parallaxHeader.vars.mouseTolerance;
        // })

    },
    onMouseClick: function (e) {
        var raycaster = new THREE.Raycaster();
        raycaster.far = 170;
        raycaster.near = 135;
        var mouse = new THREE.Vector2();

        e.preventDefault();

        mouse.x = ( e.clientX / parallaxHeader.vars.renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / parallaxHeader.vars.renderer.domElement.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, parallaxHeader.vars.camera );

        var intersects = raycaster.intersectObjects( parallaxHeader.vars.scene.children );
        if ( intersects.length > 0 ) {
            parallaxHeader.vars.thundeTime = 20;
        }
    },
    onWindowResize: function () {
        parallaxHeader.vars.camera.aspect = window.innerWidth / window.innerHeight;
        parallaxHeader.vars.camera.updateProjectionMatrix();
        parallaxHeader.vars.renderer.setSize( window.innerWidth, window.innerHeight );
    },
    cameraInit: function () {
        this.vars.camera.position.z = 100;
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
    lightSun: function (color, intensity, distance, decay, posX, posY, posZ ) {
        var sun = new THREE.PointLight(color, intensity, distance, decay);
        sun.position.set(posX, posY, posZ);
        this.vars.scene.add( sun );
        this.vars.threeSun.push( sun );
     },
    renderInit: function () {
        this.vars.scene.background = new THREE.Color( '#7ec0ee' );
        this.vars.renderer.setSize(window.innerWidth, window.innerHeight);
        this.vars.renderer.setPixelRatio( window.devicePixelRatio );
        document.body.appendChild(this.vars.renderer.domElement);
    },
    moveClouds: function() {
        if (parallaxHeader.vars.thundeTime > 0) {
            parallaxHeader.callThunder();
            parallaxHeader.vars.thundeTime--;
        }
        this.vars.cloudParticles.forEach(cloud => {
            cloud.position.x -= 0.02;
            if (cloud.position.x < -200) {
            cloud.rotation.z = Math.random()*360;
            cloud.position.x = 200;
        }
        });
    },
    moveSun: function () {
        this.vars.sunTheta += this.vars.sunDTheta;
        this.vars.threeSun[0].position.z = this.vars.sunR *  Math.cos(this.vars.sunTheta);
        this.vars.threeSun[0].position.x = (this.vars.sunR *  Math.cos(this.vars.sunTheta))/1000;
    },
    callThunder: function () {
        this.vars.flashObj[0].position.set( this.minMax(50, 400), this.minMax(300, 600), 100 );
        this.vars.flashObj[0].power = this.minMax(100, 1000);
        if( this.vars.thundeTime <= 1 ) {
            this.vars.flashObj[0].power = 370;
            this.vars.flashObj[0].position.set( 0, 0, -5);
        }
    },
    mainLoop: function() {
        parallaxHeader.vars.fps.update();
        parallaxHeader.moveClouds();
        parallaxHeader.moveSun();
        parallaxHeader.vars.renderer.render(parallaxHeader.vars.scene, parallaxHeader.vars.camera);
        requestAnimationFrame(parallaxHeader.mainLoop);
    },
    evenListeners: function () {
        var $that = this;
        window.addEventListener( 'resize', $that.onWindowResize, false );
        document.addEventListener( 'wheel', $that.onMouseWheel, false);
        document.addEventListener( 'click', $that.onMouseClick, false);
        document.onmousemove = this.onMouseMove;
    },
    init: function () {
        this.renderInit();
        this.cameraInit();
        this.lightPoint(0xffffff, 1, 1000, 0, 1, 1, 100);
        this.lightThunder(0xffffff, 30, 500, 1.7, 0, 0, -5);
        this.lightSun('#FDB813', 1.5*Math.PI, 250, 2, -1000, 150, 1000);
        this.callThunder();
        this.imagesLoad();
        this.fontLoad(this.vars.textFont2, this.vars.text1, 9, -100, 30, 3);
        this.fontLoad(this.vars.textFont2, this.vars.text2, 9, 22, 13, 6);
        this.fontLoad(this.vars.textFont2, this.vars.text3, 11, -37, 50, 2);
        this.cloudLoad(this.vars.cloudTexture, 50, 100);
        this.evenListeners();
        this.showFPS();
    }
}

parallaxHeader.init();
parallaxHeader.mainLoop();
