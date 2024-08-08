$(document).ready(function () {

    $("#gradovi").change(function () {

        var grad = $(this).val();

        $.ajax({
            url: "http://api.weatherapi.com/v1/forecast.json",
            method: "GET",
            data: {
                key: "2d7f0ff6b88242ffa3f02054241806",
                q: grad,
                days: 3,
                aqi: "yes",
            },

            success: function (response) {
                var is_day = response.current.is_day;
             
                if (is_day == 0) {
                    var iconPath1 = "http://127.0.0.1:5500/Images/kucica.png";
                }
                else {
                    var iconPath1 = "http://127.0.0.1:5500/Images/kucicaDan.jpeg";
                }

                $(".currentTemp, .description, .tMax, .tMin, .date, .poSatima").empty();
                $(".date").append(response.location.localtime + "h");
                $(".currentTemp").append(Math.round(response['current']['temp_c']) + " °C");
                $(".description").append(response.current.condition.text);
                $(".tMin").append("L: " + Math.round(response.forecast.forecastday[0].day.mintemp_c) + " °C");
                $(".tMax").append("H: " + Math.round(response.forecast.forecastday[0].day.maxtemp_c) + " °C");

                $(".poSatima").empty();

                var currentTime = parseInt(response.location.localtime.slice(10, 13));
                for (var i = 0; i < 5; i++) {
                    var time = (currentTime + i) % 24;
                    $("#sat" + i).append(time + ":00h" + "<br>");
                    $("#sat" + i).append('<img src=" ' + response.forecast.forecastday[0].hour[time].condition.icon + ' "/>');
                    $("#sat" + i).append(Math.round(response.forecast.forecastday[0].hour[time].temp_c) + " °C");
                }

                $(".sati").click(function () {
                    $(".poSatima").empty();

                    var currentTime = parseInt(response.location.localtime.slice(10, 13));
                    for (var i = 0; i < 5; i++) {
                        var time = (currentTime + i) % 24;
                        $("#sat" + i).append(time + ":00h" + "<br>");
                        $("#sat" + i).append('<img src=" ' + response.forecast.forecastday[0].hour[time].condition.icon + ' "/>');
                        $("#sat" + i).append(Math.round(response.forecast.forecastday[0].hour[time].temp_c) + " °C");
                    }
                });

                $(".dani").click(function () {
                    $(".poSatima").empty();
                    for (var i = 0; i < 5; i++) {
                        $("#sat" + i).append(response.forecast.forecastday[i].date.slice(5, 10) + '<br>');
                        $("#sat" + i).append('<img src=" ' + response.forecast.forecastday[i].day.condition.icon + ' "/>');
                        $("#sat" + i).append("L: " + Math.round(response.forecast.forecastday[i].day.mintemp_c) + " °C" + '<br>');
                        $("#sat" + i).append("H: " + Math.round(response.forecast.forecastday[i].day.maxtemp_c) + " °C");
                    }
                });

                $(".poSatima").click(function () {
                    window.location.href = "http://127.0.0.1:5500/index2.html?_ijt=kmqdnfvnl9g7at5oobq7aardhp&_ij_reload=RELOAD_ON_SAVE";
                });

                visualizeSunny(response);
                visualizeClear(response);
                visualizeWeather(response);
                visualizeCloudy(response);
                visualizePartlyCloudy(response);
                visualizeRainy(response);


                function visualizeWeather(response) {

                    var condition = response.current.condition.text.toLowerCase();
                    if (!condition.includes("snow")) {
                        return;
                    }
                  
                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                    var renderer = new THREE.WebGLRenderer();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    document.getElementById('canvas-stranica1').appendChild(renderer.domElement);


                    var textureLoader = new THREE.TextureLoader();
                    textureLoader.load(iconPath1, function (texture) {
                        scene.background = texture;
                    });
            
                    var rainMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff, transparent: true, 
                        blending: THREE.AdditiveBlending
                    });
                    var rainDropGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

                    var rainDrops = [];
                    var rainCount = 300; 

                    for (var i = 0; i < rainCount; i++) {
                        var rainDrop = new THREE.Mesh(rainDropGeometry, rainMaterial);
                        rainDrop.position.set(
                            Math.random() * 20 - 10,
                            Math.random() * 20,     
                            Math.random() * 20 - 10  
                        );
                        rainDrops.push(rainDrop);
                        scene.add(rainDrop);
                    }
             
                    camera.position.z = 5;
                 
                    var animate = function () {
                        requestAnimationFrame(animate);
                    
                        rainDrops.forEach(function (rainDrop) {
                            rainDrop.position.y -= 0.1;
                         
                            if (rainDrop.position.y < -10) {
                                rainDrop.position.y = 10;
                                rainDrop.position.x = Math.random() * 20 - 10;
                                rainDrop.position.z = Math.random() * 20 - 10;
                            }
                        });

                        renderer.render(scene, camera);
                    };                

                    window.addEventListener('resize', onWindowResize(camera));
                    animate();
                }


                function visualizeSunny(response) {

                    var condition = response.current.condition.text.toLowerCase();
                    if (!condition.includes("sunny")) {
                        return;
                    }
                  
                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                    camera.position.set(0, 2, 5); 
                    camera.lookAt(scene.position);
                    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                    scene.add(ambientLight);
                    var renderer = new THREE.WebGLRenderer();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    document.getElementById('canvas-stranica1').appendChild(renderer.domElement);
                 
                    var textureLoader = new THREE.TextureLoader();
                    textureLoader.load(iconPath1, function (texture) {
                        scene.background = texture;
                    });
                   
                    var geometry = new THREE.SphereGeometry(0.7, 32, 32);
                    var material = new THREE.MeshBasicMaterial({
                        map: textureLoader.load('http://127.0.0.1:5500/Images/sun.png'), 
                        color: 0xffff00,
                        emissive: 0xffff00,
                        emissiveIntensity: 2.5
                    });

                    material.emissiveIntensity = 1 + Math.sin(Date.now() * 0.002) * 0.5;

                    var sun = new THREE.Mesh(geometry, material);
                    sun.position.set(0, -0.1, -4);
                    scene.add(sun);
        
                    var rayMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, opacity: 0.5, transparent: true });
                    var rays = new THREE.Group();
                    var numRays = 15;

                    for (var i = 0; i < numRays; i++) {
                        var rayGeometry = new THREE.BufferGeometry();
                        var vertices = new Float32Array([
                            0, 0, 0,
                            Math.cos((i / numRays) * Math.PI * 2) * 3,
                            Math.sin((i / numRays) * Math.PI * 2) * 3, 
                            -1
                        ]);
                        rayGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                        var ray = new THREE.Line(rayGeometry, rayMaterial);
                        rays.add(ray);
                    }

                    sun.add(rays);
             
                    var coronaGeometry = new THREE.CircleGeometry(0.9, 32);
                    var coronaMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffaa33,
                        transparent: true,
                        opacity: 0.2,
                        side: THREE.DoubleSide
                    });
                    var corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
                    corona.position.set(-0.03, - 0.1, -4);
                    corona.rotation.x = Math.PI * 2;
                    scene.add(corona);
               
                    function animate() {
                        requestAnimationFrame(animate);
            
                        sun.rotation.z += 0.001;
                        rays.rotation.z += 0.01;
                
                        corona.scale.x = 1.2 + Math.sin(Date.now() * 0.002) * 0.05;
                        corona.scale.y = 1.2 + Math.sin(Date.now() * 0.002) * 0.05;

                        renderer.render(scene, camera);
                    }

                    window.addEventListener('resize', onWindowResize(camera));

                    animate();
                }


                function visualizeClear(response) {

                    var condition = response.current.condition.text.toLowerCase();
                    if (!condition.includes("clear")) {
                        return;
                    }
                  
                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                    camera.position.set(0, 2, 5);
                    camera.lookAt(scene.position);
                    var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
                    scene.add(ambientLight);
                    var renderer = new THREE.WebGLRenderer();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    document.getElementById('canvas-stranica1').appendChild(renderer.domElement);
                 
                    var textureLoader = new THREE.TextureLoader();
                    textureLoader.load(iconPath1, function (texture) {
                        scene.background = texture;
                    });

                    var moonGeometry = new THREE.SphereGeometry(0.8, 32);
                    var moonMaterial = new THREE.MeshBasicMaterial({
                        map: textureLoader.load('http://127.0.0.1:5500/Images/moon.png'),              
                        emissive: 0x444444,
                        emissiveIntensity: 2.5
                    });

                    var moon = new THREE.Mesh(moonGeometry, moonMaterial);
                    moon.position.set(0, 0, -4);
                    scene.add(moon);
            
                    var moonLight = new THREE.PointLight(0xdddddd, 0.5, 3);
                    moonLight.position.set(0, 0, -4);
                    scene.add(moonLight);

                    var glowGeometry = new THREE.CircleGeometry(0.7, 32);
                    var glowMaterial = new THREE.MeshBasicMaterial({
                        color: 0x8888ff,
                        transparent: true,
                        opacity: 0.2,
                        side: THREE.DoubleSide,
                    });
                    var moonGlow = new THREE.Mesh(glowGeometry, glowMaterial);
                    moonGlow.position.set(0, 0, -4);
                    moonGlow.rotation.x = Math.PI;
                    scene.add(moonGlow);
            
                    function animate() {
                        requestAnimationFrame(animate);
                        moon.rotation.y += 0.001; 
                   
                        moonGlow.scale.x = 1.5 + Math.sin(Date.now() * 0.002) * 0.3;
                        moonGlow.scale.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.3;

                        renderer.render(scene, camera);
                    }               

                    window.addEventListener('resize', onWindowResize(camera));

                    animate();
                }

                function visualizeCloudy(response) {

                    var condition = response.current.condition.text.toLowerCase();
                    if (!condition.includes("cloudy")) {
                        return;
                    }
                   
                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
                    camera.position.set(0, 2, 5);
                    camera.lookAt(scene.position);

                    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                    scene.add(ambientLight);
                    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                    directionalLight.position.set(1, 1, 0).normalize();
                    scene.add(directionalLight);

                    var renderer = new THREE.WebGLRenderer();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    document.getElementById('canvas-stranica1').appendChild(renderer.domElement);

                 
                    var textureLoader = new THREE.TextureLoader();
                    textureLoader.load(iconPath1, function (texture) {
                        scene.background = texture;
                    });
                    
                    var cloudTexture = textureLoader.load('http://127.0.0.1:5500/Images/cloud.jpg'); 
                    var alphaMap = textureLoader.load('http://127.0.0.1:5500/Images/cloud3.jpg');
                   
                    var cloudMaterial = new THREE.MeshLambertMaterial({
                        map: cloudTexture,
                        alphaMap: alphaMap,
                        transparent: true,
                        opacity: 0.8,
                        depthWrite: false,
                    });
               
                    function createCloud(x, y, z, scale) {
                        var cloud = new THREE.Group();
                       
                        var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
                        var mainSphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
                        mainSphere.scale.set(scale, scale * 0.6, scale); 
                        cloud.add(mainSphere);
                      
                        var sphereCount = Math.floor(Math.random() * 5) + 3; 
                        for (var i = 0; i < sphereCount; i++) {
                            var smallSphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
                            smallSphere.position.set(
                                (Math.random() - 0.5) * 3,
                                (Math.random() - 0.5) * 2,
                                (Math.random() - 0.5) * 2
                            );
                            smallSphere.scale.set(
                                scale * (Math.random() * 0.5 + 0.3),
                                scale * (Math.random() * 0.5 + 0.3),
                                scale * (Math.random() * 0.5 + 0.3)
                            );
                            cloud.add(smallSphere);
                        }

                        cloud.position.set(x, y, z);
                        scene.add(cloud);
                        return cloud;
                    }
                    
                    var clouds = [];
                    clouds.push(createCloud(-2, 0.2, -3, 1));
                    clouds.push(createCloud(1, 0.7, -5, 1.5));
                    clouds.push(createCloud(3, 0, -4, 1.2));
                   
                    function animate() {
                        requestAnimationFrame(animate);
                       
                        clouds.forEach(function (cloud) {
                            cloud.position.x += 0.005; 
                            if (cloud.position.x > 5) {
                                cloud.position.x = -5; 
                            }
                        });

                        renderer.render(scene, camera);
                    }

                    window.addEventListener('resize', onWindowResize(camera));

                    animate();
                }


                function visualizePartlyCloudy(response) {
                    var condition = response.current.condition.text.toLowerCase();
                    if (!condition.includes("partly cloudy")) {
                        return;
                    }

                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
                    camera.position.set(0, 2, 5);
                    camera.lookAt(scene.position);

                    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                    scene.add(ambientLight);

                    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                    directionalLight.position.set(1, 1, 0).normalize();
                    scene.add(directionalLight);

                    var renderer = new THREE.WebGLRenderer();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    document.getElementById('canvas-stranica1').appendChild(renderer.domElement);

                    var textureLoader = new THREE.TextureLoader();
                    textureLoader.load(iconPath1, function (texture) {
                        scene.background = texture;
                    });

                    var cloudTexture = textureLoader.load('http://127.0.0.1:5500/Images/cloud.jpg'); 
                    var alphaMap = textureLoader.load('http://127.0.0.1:5500/Images/cloud1.jpg'); 

                    var cloudMaterial = new THREE.MeshLambertMaterial({
                        map: cloudTexture,
                        alphaMap: alphaMap,
                        transparent: true,
                        opacity: 0.8,
                        depthWrite: false,
                    });

                    function createCloud(x, y, z, scale) {
                        var cloud = new THREE.Group();

                        var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
                        var mainSphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
                        mainSphere.scale.set(scale, scale * 0.6, scale);
                        cloud.add(mainSphere);

                        var sphereCount = Math.floor(Math.random() * 5) + 3;
                        for (var i = 0; i < sphereCount; i++) {
                            var smallSphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
                            smallSphere.position.set(
                                (Math.random() - 0.5) * 3,
                                (Math.random() - 0.5) * 2,
                                (Math.random() - 0.5) * 2
                            );
                            smallSphere.scale.set(
                                scale * (Math.random() * 0.5 + 0.3),
                                scale * (Math.random() * 0.5 + 0.3),
                                scale * (Math.random() * 0.5 + 0.3)
                            );
                            cloud.add(smallSphere);
                        }

                        cloud.position.set(x, y, z);
                        scene.add(cloud);
                        return cloud;
                    }

                    function createSun(x, y, z, scale) {
                        var geometry = new THREE.SphereGeometry(0.65, 32, 32);

                        var sunTexture = textureLoader.load('http://127.0.0.1:5500/Images/sun.png'); // Putanja do teksture oblaka
                        var material = new THREE.MeshBasicMaterial({
                            color: 0xffff00,
                            map: sunTexture,
                            emissive: 0xffff00
                        });

                        var sun = new THREE.Mesh(geometry, material);
                        sun.position.set(x, y, z);
                        sun.scale.set(scale, scale, scale);
                        scene.add(sun);
                        return sun;
                    }

               
                    var clouds = [
                        createCloud(-5, -0.5, -3, 1),
                        createCloud(-3, 0, -3, 0.8),  
                        createCloud(-1, -0.2, -3, 1.2), 
                        createCloud(-6, -1, -3, 1.1) 
                    ];
                    var sun = createSun(1.5, 0, -5, 1.2); 
                  
                    var rayMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, opacity: 0.5, transparent: true });
                    var rays = new THREE.Group();
                    var numRays = 15; 
                    var rayYOffset = 0; 
                    var rayLength = 2.0;

                    for (var i = 0; i < numRays; i++) {
                        var rayGeometry = new THREE.BufferGeometry();
                        var vertices = new Float32Array([
                            1.5, rayYOffset, -5, 
                            1.5 + Math.cos((i / numRays) * Math.PI * 2) * rayLength,
                            rayYOffset + Math.sin((i / numRays) * Math.PI * 2) * rayLength, 
                            -5 
                        ]);
                        rayGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                        var ray = new THREE.Line(rayGeometry, rayMaterial);
                        rays.add(ray);
                    }

                    scene.add(rays);
                
                    var coronaGeometry = new THREE.CircleGeometry(0.6, 32);
                    var coronaMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffaa33,
                        transparent: true,
                        opacity: 0.2,
                        side: THREE.DoubleSide
                    });
                    var corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
                    corona.position.set(1.05, 0.6, -2);
                    corona.rotation.x = Math.PI;
                    scene.add(corona);

                    function animate() {
                        requestAnimationFrame(animate);
                       
                        clouds.forEach(cloud => {
                            cloud.position.x += 0.009;
                            if (cloud.position.x > 5) {
                                cloud.position.x = -5;
                            }
                        });
                      
                        sun.rotation.y += 0.005;
                      
                        corona.scale.x = 1.2 + Math.sin(Date.now() * 0.002) * 0.05;
                        corona.scale.y = 1.2 + Math.sin(Date.now() * 0.002) * 0.05;
                     
                        renderer.render(scene, camera);
                    }                 

                    window.addEventListener('resize', onWindowResize(camera));

                    animate();
                }
                function visualizeRainy(response) {

                    var condition = response.current.condition.text.toLowerCase();
                    if (!condition.includes("rain")) {
                        return;
                    }

                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                    camera.position.set(0, 2, 5);
                    camera.lookAt(scene.position);

                    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                    scene.add(ambientLight);

                    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                    directionalLight.position.set(1, 1, 0).normalize();
                    scene.add(directionalLight);

                    var renderer = new THREE.WebGLRenderer();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    document.getElementById('canvas-stranica1').appendChild(renderer.domElement);

                    var textureLoader = new THREE.TextureLoader();
                    textureLoader.load(iconPath1, function (texture) {
                        scene.background = texture;
                    });

                    var cloudTexture = textureLoader.load('http://127.0.0.1:5500/Images/cloud.jpg');
                    var alphaMap = textureLoader.load('http://127.0.0.1:5500/Images/cloud1.jpg'); 

                    var cloudMaterial = new THREE.MeshLambertMaterial({
                        map: cloudTexture,
                        alphaMap: alphaMap,
                        transparent: true,
                        opacity: 0.8,
                        depthWrite: false,
                    });

                    function createCloud(x, y, z, scale) {
                        var cloud = new THREE.Group();

                        var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
                        var mainSphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
                        mainSphere.scale.set(scale, scale * 0.6, scale);
                        cloud.add(mainSphere);

                        var sphereCount = Math.floor(Math.random() * 5) + 3;
                        for (var i = 0; i < sphereCount; i++) {
                            var smallSphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
                            smallSphere.position.set(
                                (Math.random() - 0.5) * 3,
                                (Math.random() - 0.5) * 2,
                                (Math.random() - 0.5) * 2
                            );
                            smallSphere.scale.set(
                                scale * (Math.random() * 0.5 + 0.3),
                                scale * (Math.random() * 0.5 + 0.3),
                                scale * (Math.random() * 0.5 + 0.3)
                            );
                            cloud.add(smallSphere);
                        }

                        cloud.position.set(x, y, z);
                        scene.add(cloud);
                        return cloud;
                    }

                    function createRain(x, y, z, numDrops, areaWidth, areaDepth) {
                        var rainGeometry = new THREE.BufferGeometry();
                        var rainMaterial = new THREE.PointsMaterial({
                            color: 0xaaaaaa,
                            size: 0.07,
                            transparent: true,
                            opacity: 0.8
                        });

                        var positions = new Float32Array(numDrops * 3);
                        for (var i = 0; i < numDrops; i++) {
                            positions[i * 3] = Math.random() * areaWidth - areaWidth / 2; // x
                            positions[i * 3 + 1] = Math.random() * areaDepth; // y
                            positions[i * 3 + 2] = Math.random() * areaWidth - areaWidth / 1; // z
                        }
                        rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                        var rain = new THREE.Points(rainGeometry, rainMaterial);
                        rain.position.set(x, y, z);
                        scene.add(rain);
                        return rain;
                    }

                    var cloud = createCloud(0, 0.5, -3, 1.5); 
                    var rain = createRain(0, -1, -3, 500, 4, 4); 

                    function animate() {
                        requestAnimationFrame(animate);
                       
                        var positions = rain.geometry.attributes.position.array;
                        for (var i = 0; i < positions.length; i += 3) {
                            positions[i + 1] -= 0.1;
                            if (positions[i + 1] < -2) {
                                positions[i + 1] = Math.random();
                            }
                        }
                        rain.geometry.attributes.position.needsUpdate = true;

                        renderer.render(scene, camera);
                    }                  

                    window.addEventListener('resize', onWindowResize(camera));

                    animate();
                }

                if (is_day == 0) {
                    var canvas = document.getElementById('starCanvas');
                    var ctx = canvas.getContext('2d');
                    var stars = [];
                    var numStars = 300;
                    var maxStarRadius = 3;
                    var maxY;

                    function resizeCanvas() {
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;
                        maxY = canvas.height / 3;
                        stars = [];
                        createStars();
                    }
                    resizeCanvas();
                    window.addEventListener('resize', resizeCanvas);

                    function Star(x, y, radius) {
                        this.x = x;
                        this.y = y;
                        this.radius = radius;
                        this.alpha = Math.random();
                        this.fade = (Math.random() - 0.5) * 0.1;
                    }

                    function createStars() {
                        for (var i = 0; i < numStars; i++) {
                            var x = Math.random() * canvas.width;
                            var y = Math.random() * maxY;
                            var radius = Math.random() * maxStarRadius;
                            stars.push(new Star(x, y, radius));
                        }
                    }

                    function drawStar(star) {
                        ctx.beginPath();
                        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
                        ctx.fillStyle = 'rgba(255, 255, 255,' + star.alpha + ')';
                        ctx.fill();
                        ctx.closePath();
                    }

                    function animateStars() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        stars.forEach(function (star) {
                            drawStar(star);

                            star.alpha += star.fade;
                            if (star.alpha <= 0) {
                                star.alpha = 0;
                                star.fade = -star.fade;
                            } else if (star.alpha >= 1) {
                                star.alpha = 1;
                                star.fade = -star.fade;
                            }
                        });

                        requestAnimationFrame(animateStars);
                    }
                    animateStars();

                    window.addEventListener('resize', function () {
                        camera.aspect = window.innerWidth / (window.innerHeight / 3);
                        camera.updateProjectionMatrix();
                        renderer.setSize(window.innerWidth, window.innerHeight / 3);
                    });

                }

                if (is_day == 1) {
                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                    var renderer = new THREE.WebGLRenderer({ alpha: true });
                    renderer.setSize(window.innerWidth, window.innerHeight / 3);
                    renderer.domElement.style.position = 'absolute';
                    renderer.domElement.style.top = '0';
                    renderer.domElement.style.left = '0';
                    renderer.domElement.style.pointerEvents = 'none';
                    document.body.appendChild(renderer.domElement);


                    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                    scene.add(ambientLight);
                    var pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
                    pointLight.position.set(0, 5, 5);
                    scene.add(pointLight);


                    var birdTexture = new THREE.TextureLoader().load('http://127.0.0.1:5500/Images/bird.png');
                    var birdMaterial = new THREE.SpriteMaterial({ map: birdTexture, transparent: true });
                    var birds = [];
                    var numBirds = 15;

                    for (var i = 0; i < numBirds; i++) {
                        var bird = new THREE.Sprite(birdMaterial);
                        bird.scale.set(2, 1, 1);
                        bird.position.set(
                            (Math.random() - 0.5) * 20,
                            (Math.random() - 0.5) * 10,
                            (Math.random() - 0.5) * 20
                        );
                        bird.userData = {
                            velocity: new THREE.Vector3(
                                (Math.random() - 0.5) * 0.05,
                                0,
                                (Math.random() - 0.5) * 0.05
                            )
                        };
                        birds.push(bird);
                        scene.add(bird);
                    }

                    camera.position.z = 10;


                    function animate() {
                        requestAnimationFrame(animate);

                        birds.forEach(function (bird) {
                            bird.position.add(bird.userData.velocity);
                            if (bird.position.x > 10) bird.position.x = -10;
                            if (bird.position.x < -10) bird.position.x = 10;
                            if (bird.position.y > 5) bird.position.y = -5;
                            if (bird.position.y < -5) bird.position.y = 5;
                            if (bird.position.z > 10) bird.position.z = -10;
                            if (bird.position.z < -10) bird.position.z = 10;
                        });

                        renderer.render(scene, camera);
                    }
                    animate();

                    window.addEventListener('resize', function () {
                        camera.aspect = window.innerWidth / (window.innerHeight / 3);
                        camera.updateProjectionMatrix();
                        renderer.setSize(window.innerWidth, window.innerHeight / 3);
                    });
                }

            }
        })
    });
});

function onWindowResize(camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
}
