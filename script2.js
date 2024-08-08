$(document).ready(function () {
    var grad = ["Belgrade", "Novi Sad", "Kragujevac"];
    for (var i = 0; i < 3; i++) {
        (function (i) {
            $.ajax({
                url: "http://api.weatherapi.com/v1/forecast.json",
                method: "GET",
                data: {
                    key: "2d7f0ff6b88242ffa3f02054241806",
                    q: grad[i],
                    days: 1,
                    aqi: "yes",
                },
                success: function (response) {
                    var is_day = response.current.is_day;                
                    var iconPath;

                    if (is_day == 0) {
                    var iconPath1 = "http://127.0.0.1:5500/Images/kucica1.png";
                }
                    else {
                    var iconPath1 = "http://127.0.0.1:5500/Images/kucica1Dan.jpeg";
                }
                    var code = response.current.condition.code;
                    

                    if (code == 1000 && is_day == 0) {
                        iconPath = "Images/vedro.png";
                    } else if (code == 1000 && is_day == 1) {
                        iconPath = "Images/suncano.png";
                    } else if (code == 1003 && is_day == 0) {
                        iconPath = "Images/delimicno_oblacno.png";
                    } else if (code == 1003 && is_day == 1) {
                        iconPath = "Images/delimicnoOblacnoDan.png";
                    } else if (code == 1006 || code == 1009) {
                        iconPath = "Images/oblacno.png";
                    } else if (code == 1063) {
                        iconPath = "Images/mestimicnoKisaUBlizini.png";
                    }


                    $(".img" + i).append('<img src="' + iconPath + '"/>');
                    $(".currentTemp" + i).append(Math.round(response.current.temp_c) + " °C" + "<br>");
                    $(".descriptionTemp" + i).append(response.current.condition.text + "<br>");
                    $(".tMin" + i).append("L: " + Math.round(response.forecast.forecastday[0].day.mintemp_c) + " °C");
                    $(".tMax" + i).append("H: " + Math.round(response.forecast.forecastday[0].day.maxtemp_c) + " °C" + "<br>");
                    $(".city" + i).append(response.location.name + "/ " + response.location.country + "<br>");

                    if (is_day == 0) {
                        nightClouds(iconPath1);
                    } else {
                        dayDandelion(iconPath1);
                    }
                }
            });
        })(i);
    }

    function nightClouds(backgroundImage) {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-stranica2').appendChild(renderer.domElement);
      
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load(backgroundImage, function (texture) {
            scene.background = texture;
        });

        var ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        var pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
        pointLight.position.set(0, 5, 5);
        scene.add(pointLight);

        var cloudTexture1 = new THREE.TextureLoader().load('http://127.0.0.1:5500/Images/cloud3.png');
        var cloudTexture2 = new THREE.TextureLoader().load('http://127.0.0.1:5500/Images/cloud4.png');
        var cloudMaterials = [
            new THREE.SpriteMaterial({ map: cloudTexture1, transparent: true, opacity: 0.8 }),
            new THREE.SpriteMaterial({ map: cloudTexture2, transparent: true, opacity: 0.8 })
        ];

        var maxSpeed = 0.01;
        var clouds = [];
        var numClouds = 50;
        for (var i = 0; i < numClouds; i++) {
            var randomMaterial = cloudMaterials[Math.floor(Math.random() * cloudMaterials.length)];
            var cloud = new THREE.Sprite(randomMaterial);
            cloud.scale.set(3, 1.5, 1);
            cloud.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            cloud.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * maxSpeed / 2,
                    (Math.random() - 0.5) * maxSpeed / 2,
                    (Math.random() - 0.5) * maxSpeed / 2
                )
            };
            clouds.push(cloud);
            scene.add(cloud);
        }
        camera.position.z = 5;

        function animate() {
            requestAnimationFrame(animate);

            clouds.forEach(function (cloud) {
                cloud.position.add(cloud.userData.velocity);
                if (cloud.position.x > 5) cloud.position.x = -5;
                if (cloud.position.x < -5) cloud.position.x = 5;
                if (cloud.position.y > 5) cloud.position.y = -5;
                if (cloud.position.y < -5) cloud.position.y = 5;
                if (cloud.position.z > 5) cloud.position.z = -5;
                if (cloud.position.z < -5) cloud.position.z = 5;
            });

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', onWindowResize(camera));
     
    }

    function dayDandelion(backgroundImage) {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-stranica2').appendChild(renderer.domElement);

        var textureLoader = new THREE.TextureLoader();
        textureLoader.load(backgroundImage, function (texture) {
            scene.background = texture;
        });


        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        var pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
        pointLight.position.set(0, 5, 5);
        scene.add(pointLight);


        var dandelionTexture = new THREE.TextureLoader().load('http://127.0.0.1:5500/Images/maslacak1.png');
        var dandelionMaterial = new THREE.SpriteMaterial({ map: dandelionTexture, transparent: true });
        var dandelions = [];
        var numDandelions = 100;
        for (var i = 0; i < numDandelions; i++) {
            var dandelion = new THREE.Sprite(dandelionMaterial);
            dandelion.scale.set(3, 3, 1);
            dandelion.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            dandelion.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05
                )
            };
            dandelions.push(dandelion);
            scene.add(dandelion);
        }

        camera.position.z = 5;

        function animate() {
            requestAnimationFrame(animate);

            dandelions.forEach(function (dandelion) {
                dandelion.position.add(dandelion.userData.velocity);
                if (dandelion.position.x > 10) dandelion.position.x = -10;
                if (dandelion.position.x < -10) dandelion.position.x = 10;
                if (dandelion.position.y > 10) dandelion.position.y = -10;
                if (dandelion.position.y < -10) dandelion.position.y = 10;
                if (dandelion.position.z > 10) dandelion.position.z = -10;
                if (dandelion.position.z < -10) dandelion.position.z = 10;
            });

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', onWindowResize(camera));
  
    }
});

function onWindowResize(camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
}