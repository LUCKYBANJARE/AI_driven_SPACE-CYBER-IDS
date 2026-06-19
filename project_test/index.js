/**
 * ==========================================================
 * SPACE CYBERSECURITY IDS
 * REALISTIC ORBITAL DIGITAL TWIN
 * ==========================================================
 */

const TEXTURE_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/123879/';

let scene;
let camera;
let renderer;
let controls;
let earth;
let clouds;
let atmosphere;
let stars;
let sunLight;
let earthGroup;
let satellites = [];
let debrisObjects = [];
let collisionLines = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let selectedSatellite = null;
let orbitalEvents = [];

let cyberAlerts = [];

let aiPredictions = [];

let maneuverRecommendations = [];

let congestionLevel = "LOW";

let workflowState = {

    ingestion:"ACTIVE",

    twin:"SYNCED",

    ai:"RUNNING",

    cyber:"MONITORING",

    maneuver:"READY",

    dashboard:"ONLINE"
};

const EARTH_RADIUS = 80;
// const SATELLITE_COUNT = 25;
const DEBRIS_COUNT = 120;

const tleData = [

{
name:"STARLINK-ALPHA-01",
tle1:"1 91001U 26001A   26136.50000000  .00001234  00000-0  10270-3 0  9991",
tle2:"2 91001  53.0500 120.0000 0001200  85.0000 275.0000 15.05500000100001",
cluster:"A"
},

{
name:"STARLINK-ALPHA-02",
tle1:"1 91002U 26001B   26136.50000000  .00001250  00000-0  10280-3 0  9992",
tle2:"2 91002  53.0510 120.0020 0001250  86.0000 274.0000 15.05505000100002",
cluster:"A"
},

{
name:"STARLINK-ALPHA-03",
tle1:"1 91003U 26001C   26136.50000000  .00001260  00000-0  10290-3 0  9993",
tle2:"2 91003  53.0495 120.0030 0001300  84.0000 276.0000 15.05510000100003",
cluster:"A"
},

{
name:"DEBRIS-CLOUD-01",
tle1:"1 91004U 26001D   26136.50000000  .00015000  00000-0  20270-3 0  9994",
tle2:"2 91004  53.0505 120.0015 0005000  88.0000 272.0000 15.05502000100004",
cluster:"A",
debris:true
},

{
name:"DEBRIS-CLOUD-02",
tle1:"1 91005U 26001E   26136.50000000  .00015500  00000-0  20280-3 0  9995",
tle2:"2 91005  53.0520 120.0040 0005500  89.0000 271.0000 15.05507000100005",
cluster:"A",
debris:true
},

{
name:"OBSERVATION-SAT-01",
tle1:"1 91006U 26002A   26136.50000000  .00000800  00000-0  85270-4 0  9996",
tle2:"2 91006  97.4500 250.0000 0002000 120.0000 240.0000 14.95000000100006",
cluster:"B"
},

{
name:"OBSERVATION-SAT-02",
tle1:"1 91007U 26002B   26136.50000000  .00000810  00000-0  85280-4 0  9997",
tle2:"2 91007  97.4510 250.0020 0002100 121.0000 239.0000 14.95005000100007",
cluster:"B"
},

{
name:"DEBRIS-POLAR-01",
tle1:"1 91008U 26002C   26136.50000000  .00018000  00000-0  25270-3 0  9998",
tle2:"2 91008  97.4495 250.0010 0007000 122.0000 238.0000 14.95004000100008",
cluster:"B",
debris:true
},

{
name:"CUBE-SAT-01",
tle1:"1 91009U 26003A   26136.50000000  .00002000  00000-0  11270-3 0  9999",
tle2:"2 91009  51.6000 180.0000 0003000 150.0000 210.0000 15.20000000100009",
cluster:"C"
},

{
name:"CUBE-SAT-02",
tle1:"1 91010U 26003B   26136.50000000  .00002020  00000-0  11280-3 0  9990",
tle2:"2 91010  51.6010 180.0010 0003100 151.0000 209.0000 15.20005000100010",
cluster:"C"
},

{
name:"CUBE-SAT-03",
tle1:"1 91011U 26003C   26136.50000000  .00002050  00000-0  11290-3 0  9991",
tle2:"2 91011  51.6020 180.0020 0003200 152.0000 208.0000 15.20010000100011",
cluster:"C"
},

{
name:"ROCKET-BODY-01",
tle1:"1 91012U 26003D   26136.50000000  .00030000  00000-0  35270-3 0  9992",
tle2:"2 91012  51.6015 180.0015 0012000 153.0000 207.0000 15.20008000100012",
cluster:"C",
debris:true
},

{
name:"MILSAT-01",
tle1:"1 91013U 26004A   26136.50000000  .00000500  00000-0  65270-4 0  9993",
tle2:"2 91013  70.0000 300.0000 0001500 200.0000 160.0000 14.20000000100013",
cluster:"D"
},

{
name:"MILSAT-02",
tle1:"1 91014U 26004B   26136.50000000  .00000520  00000-0  65280-4 0  9994",
tle2:"2 91014  70.0010 300.0010 0001600 201.0000 159.0000 14.20004000100014",
cluster:"D"
},

{
name:"DEBRIS-MIL-01",
tle1:"1 91015U 26004C   26136.50000000  .00012000  00000-0  15270-3 0  9995",
tle2:"2 91015  70.0005 300.0005 0009000 202.0000 158.0000 14.20003000100015",
cluster:"D",
debris:true
}

];
init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        5000
    );

    camera.position.set(0, 120, 260);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 130;
    controls.maxDistance = 800;

    createLights();
    createEarth();
    createAtmosphere();
    createStars();
    createSatellites();
    createDebrisField();
    createHUD();
    createNavbarPages();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
}

function createLights() {

    const ambient = new THREE.AmbientLight(0x223344, 1.2);
    scene.add(ambient);

    sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(400, 100, 200);
    sunLight.castShadow = true;

    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x0066ff, 1.5, 1500);
    blueLight.position.set(-300, 50, -300);

    scene.add(blueLight);
}

function createEarth() {

    earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const geometry = new THREE.SphereGeometry(EARTH_RADIUS, 128, 128);

    const loader = new THREE.TextureLoader();

    const earthTexture = loader.load(TEXTURE_PATH + 'ColorMap.jpg');
    const bumpTexture = loader.load(TEXTURE_PATH + 'Bump.jpg');
    const specTexture = loader.load(TEXTURE_PATH + 'SpecMask.jpg');

    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpTexture,
        bumpScale: 1.5,
        specularMap: specTexture,
        specular: new THREE.Color(0x333333),
        shininess: 20
    });

    earth = new THREE.Mesh(geometry, material);
    earth.castShadow = true;
    earth.receiveShadow = true;

    earth.rotation.z = THREE.MathUtils.degToRad(23.5);

    earthGroup.add(earth);

    const cloudGeometry = new THREE.SphereGeometry(EARTH_RADIUS + 1, 128, 128);

    const cloudTexture = loader.load(TEXTURE_PATH + 'alphaMap.jpg');

    const cloudMaterial = new THREE.MeshPhongMaterial({
        alphaMap: cloudTexture,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
    });

    clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);

    earthGroup.add(clouds);
}

function createAtmosphere() {

    const geometry = new THREE.SphereGeometry(EARTH_RADIUS + 4, 128, 128);

    const material = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0) * intensity;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });

    atmosphere = new THREE.Mesh(geometry, material);

    scene.add(atmosphere);
}

function createStars() {

    const geometry = new THREE.BufferGeometry();

    const starVertices = [];

    for (let i = 0; i < 12000; i++) {

        const x = (Math.random() - 0.5) * 5000;
        const y = (Math.random() - 0.5) * 5000;
        const z = (Math.random() - 0.5) * 5000;

        starVertices.push(x, y, z);
    }

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(starVertices, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.1,
        transparent: true,
        opacity: 0.9
    });

    stars = new THREE.Points(geometry, material);

    scene.add(stars);
}

function createSatelliteLabel(name) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 512;
    canvas.height = 128;

    context.fillStyle = 'rgba(0,0,0,0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = '40px Arial';
    context.fillStyle = '#00ffff';
    context.fillText(name, 30, 75);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(18, 5, 1);

    return sprite;
}

function createRealisticSatellite(name) {

    const satellite = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3, 3),
        new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 1,
            roughness: 0.3
        })
    );

    satellite.add(body);

    function createPanel(side) {

        const panelGroup = new THREE.Group();

        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(10, 0.12, 4),
            new THREE.MeshStandardMaterial({
                color: 0x003cff,
                emissive: 0x001144,
                metalness: 0.8,
                roughness: 0.2
            })
        );

        panelGroup.add(panel);

        panelGroup.position.x = side;

        return panelGroup;
    }

    satellite.add(createPanel(-8));
    satellite.add(createPanel(8));

    const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 5),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 1
        })
    );

    antenna.position.y = 3;

    satellite.add(antenna);

    const engineGlow = new THREE.PointLight(0x00aaff, 3, 25);
    engineGlow.position.z = -4;

    satellite.add(engineGlow);

    const label = createSatelliteLabel(name);
    label.position.y = 8;

    satellite.add(label);

    return satellite;
}

function createOrbitRing(radius) {

    const geometry = new THREE.RingGeometry(radius - 0.15, radius + 0.15, 256);

    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
    });

    const ring = new THREE.Mesh(geometry, material);

    ring.rotation.x = Math.PI / 2;

    return ring;
}

// function createSatellites() {

//     for (let i = 0; i < SATELLITE_COUNT; i++) {

//         const orbitGroup = new THREE.Group();

//         scene.add(orbitGroup);

//         const sat = createRealisticSatellite(`SAT-${1000 + i}`);

//         const orbitRadius = 130 + Math.random() * 220;

//         sat.position.x = orbitRadius;

//         sat.scale.setScalar(0.7 + Math.random() * 0.6);

//         orbitGroup.rotation.x = Math.random() * Math.PI;
//         orbitGroup.rotation.y = Math.random() * Math.PI;
//         orbitGroup.rotation.z = Math.random() * Math.PI;

//         orbitGroup.add(sat);
//         orbitGroup.add(createOrbitRing(orbitRadius));

//         const telemetry = {
//             velocity: (7 + Math.random() * 3).toFixed(2),
//             fuel: (60 + Math.random() * 40).toFixed(1),
//             risk: (Math.random() * 0.4).toFixed(3)
//         };

//         satellites.push({
//             orbitGroup,
//             satellite: sat,
//             orbitRadius,
//             speed: 0.0005 + Math.random() * 0.002,
//             rotationSpeed: 0.01 + Math.random() * 0.02,
//             telemetry,
//             maneuvering: false
//         });
//     }
// }


function createSatellites() {

    satellites = [];

    tleData.forEach((data,index)=>{

        const orbitGroup = new THREE.Group();

        scene.add(orbitGroup);

        const sat = createRealisticSatellite(data.name);

        let orbitRadius = 180 + (index * 10);

        // FORCE SAME ORBIT FOR COLLISION PAIR
        if(
            data.name === "STARLINK-ALPHA-01" ||
            data.name === "DEBRIS-CLOUD-01"
        ){
            orbitRadius = 220;
        }

        sat.position.x = orbitRadius;

        orbitGroup.rotation.x =
            THREE.MathUtils.degToRad(
                63
            );

        orbitGroup.rotation.z =
            THREE.MathUtils.degToRad(
                20
            );

        // INITIAL OFFSET
        if(data.name === "STARLINK-ALPHA-01"){

            sat.rotationOffset = 0;
        }

        if(data.name === "DEBRIS-CLOUD-01"){

            sat.rotationOffset = Math.PI;
        }

        orbitGroup.add(sat);

        orbitGroup.add(
            createOrbitRing(orbitRadius)
        );

        satellites.push({

            name:data.name,

            satellite:sat,

            orbitGroup,

            orbitRadius,

            cluster:data.cluster,

            debris:data.debris || false,

            destroyed:false,

            angle:
                sat.rotationOffset || Math.random()*Math.PI*2,

            // DIFFERENT SPEEDS
            speed:
                data.name==="STARLINK-ALPHA-01"
                ? 0.010
                : data.name==="DEBRIS-CLOUD-01"
                ? -0.009
                : 0.002 + Math.random()*0.002,

            telemetry:{
                velocity:(7+Math.random()*2).toFixed(2),
                fuel:(70+Math.random()*20).toFixed(1),
                risk:0
            }
        });
    });
}

function createDebrisField() {

    for (let i = 0; i < DEBRIS_COUNT; i++) {

        const debris = new THREE.Mesh(
            new THREE.SphereGeometry(0.3 + Math.random() * 0.8, 8, 8),
            new THREE.MeshStandardMaterial({
                color: 0xff5533,
                emissive: 0x441100,
                metalness: 0.6
            })
        );

        const radius = 140 + Math.random() * 260;
        const angle = Math.random() * Math.PI * 2;

        debris.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 100,
            Math.sin(angle) * radius
        );

        debris.velocity = 0.001 + Math.random() * 0.003;

        scene.add(debris);

        debrisObjects.push(debris);
    }
}

function createHUD() {

    const hud = document.createElement('div');

    hud.innerHTML = `
        <div style="
            position:fixed;
            top:15px;
            left:15px;
            width:340px;
            background:rgba(0,0,0,0.7);
            border:1px solid #00ffff;
            color:#00ffff;
            padding:18px;
            font-family:Arial;
            z-index:1000;
            border-radius:10px;
        ">
            <h2 style="margin-top:0;">SPACE CYBERSECURITY IDS</h2>
            <div id="telemetryData">
                Select satellite for telemetry
            </div>
        </div>
    `;

    document.body.appendChild(hud);
}



function createNavbarPages() {

    const navbar = document.createElement('div');

    navbar.innerHTML = `
        <div style="
            position:fixed;
            top:15px;
            right:15px;
            display:flex;
            gap:10px;
            z-index:1000;
        ">
            <button class="navBtn" onclick="showPanel('overview')">Overview</button>
            <button class="navBtn" onclick="showPanel('collision')">Collision</button>
            <button class="navBtn" onclick="showPanel('ai')">AI Engine</button>
            <button class="navBtn" onclick="showPanel('cyber')">Cyber SOC</button>
        </div>

        <div id="floatingPanel" style="
            position:fixed;
            right:15px;
            top:70px;
            width:320px;
            min-height:220px;
            background:rgba(0,0,0,0.75);
            border:1px solid #00ffff;
            color:#ffffff;
            padding:18px;
            z-index:1000;
            border-radius:12px;
            font-family:Arial;
        ">
            <h3>Mission Overview</h3>
            <p>Real-time orbital traffic monitoring active.</p>
        </div>
    `;

    document.body.appendChild(navbar);

    const style = document.createElement('style');

    style.innerHTML = `
        .navBtn {
            background:#001122;
            color:#00ffff;
            border:1px solid #00ffff;
            padding:10px 16px;
            border-radius:8px;
            cursor:pointer;
            font-weight:bold;
        }

        .navBtn:hover {
            background:#003355;
        }
    `;

    document.head.appendChild(style);
}

window.showPanel = function(type) {

    const panel = document.getElementById('floatingPanel');

    if (type === 'overview') {

        panel.innerHTML = `
            <h3>Mission Overview</h3>
            <p>Total Satellites: ${SATELLITE_COUNT}</p>
            <p>Debris Objects: ${DEBRIS_COUNT}</p>
            <p>Tracking Status: ACTIVE</p>
            <p>AI Collision Engine: ONLINE</p>
        `;
    }

    if (type === 'collision') {

        panel.innerHTML = `
            <h3>Collision Avoidance</h3>
            <p>Autonomous maneuver system active.</p>
            <p>Fuel optimization enabled.</p>
        `;
    }

    if (type === 'ai') {

        panel.innerHTML = `
            <h3>Reinforcement Learning Engine</h3>
            <p>Model: Double DQN</p>
            <p>Velocity adjustment optimization running.</p>
        `;
    }

    if (type === 'cyber') {

        panel.innerHTML = `
            <h3>Cybersecurity SOC</h3>
            <p>Satellite communication monitoring active.</p>
            <p>Encrypted uplink secured.</p>
        `;
    }
};

function onMouseMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick() {

    raycaster.setFromCamera(mouse, camera);

    const meshes = satellites.map(s => s.satellite);

    const intersects = raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {

        const object = intersects[0].object;

        const satData = satellites.find(s =>
            s.satellite === object.parent ||
            s.satellite.children.includes(object)
        );

        if (satData) {

            selectedSatellite = satData;

            updateTelemetry(satData);
        }
    }
}

// function updateTelemetry(data) {

//     const telemetry = document.getElementById('telemetryData');

//     telemetry.innerHTML = `
//         <hr>
//         <p><b>Velocity:</b> ${data.telemetry.velocity} km/s</p>
//         <p><b>Fuel Efficiency:</b> ${data.telemetry.fuel}%</p>
//         <p><b>Collision Risk:</b> ${data.telemetry.risk}</p>
//         <p><b>AI Maneuver:</b> ${data.maneuvering ? 'ACTIVE' : 'STABLE'}</p>
//         <p><b>Status:</b> SECURE</p>
//     `;
// }


function updateTelemetry(data) {

    const congestionLevel =
        collisionLines.length;

    const telemetry =
        document.getElementById(
            'telemetryData'
        );

    telemetry.innerHTML = `

        <hr>

        <p>
        <b>Total Objects:</b>
        ${satellites.length}
        </p>

        <p>
        <b>Congestion Zones:</b>
        4 Active
        </p>

        <p>
        <b>High Risk Conjunctions:</b>
        ${collisionLines.length}
        </p>

        <p>
        <b>Congestion Level:</b>
        ${
            congestionLevel>6
            ? "CRITICAL"
            : congestionLevel>3
            ? "HIGH"
            : "MODERATE"
        }
        </p>

        <p>
        <b>Cyber IDS:</b>
        ACTIVE
        </p>

        <p>
        <b>AI Collision Engine:</b>
        RUNNING
        </p>
    `;
}

// function simulateCollisionAvoidance() {

//     collisionLines.forEach(line => scene.remove(line));
//     collisionLines = [];

//     satellites.forEach((sat, index) => {

//         const debris = debrisObjects[index % debrisObjects.length];

//         const satPosition = new THREE.Vector3();
//         sat.satellite.getWorldPosition(satPosition);

//         const distance = satPosition.distanceTo(debris.position);

//         if (distance < 35) {

//             sat.maneuvering = true;

//             sat.telemetry.risk = (1 - distance / 35).toFixed(3);

//             sat.satellite.position.x += Math.sin(Date.now() * 0.001) * 0.15;

//             sat.telemetry.fuel = Math.max(
//                 0,
//                 sat.telemetry.fuel - 0.02
//             ).toFixed(1);

//             const geometry = new THREE.BufferGeometry().setFromPoints([
//                 satPosition,
//                 debris.position
//             ]);

//             const line = new THREE.Line(
//                 geometry,
//                 new THREE.LineBasicMaterial({ color: 0xff0000 })
//             );

//             scene.add(line);
//             collisionLines.push(line);
//         }

//         else {

//             sat.maneuvering = false;
//         }
//     });
// }

function simulateCollisionAvoidance() {

    collisionLines.forEach(
        line => scene.remove(line)
    );

    collisionLines = [];

    const satA =
        satellites.find(
            s => s.name==="STARLINK-ALPHA-01"
        );

    const satB =
        satellites.find(
            s => s.name==="DEBRIS-CLOUD-01"
        );

    if(
        !satA ||
        !satB ||
        satA.destroyed ||
        satB.destroyed
    ) return;

    const posA = new THREE.Vector3();
    const posB = new THREE.Vector3();

    satA.satellite.getWorldPosition(posA);
    satB.satellite.getWorldPosition(posB);

    const distance =
        posA.distanceTo(posB);

    // CONJUNCTION LINE
    if(distance < 80){

        const geometry =
            new THREE.BufferGeometry()
            .setFromPoints([
                posA,
                posB
            ]);

        const line =
            new THREE.Line(

                geometry,

                new THREE.LineBasicMaterial({
                    color:0xff0000
                })
            );

        scene.add(line);

        collisionLines.push(line);

        document.getElementById(
            "alerts"
        ).innerHTML = `

        <div style="
            color:red;
            line-height:1.8;
            font-size:15px;
        ">

        🚨 HIGH RISK CONJUNCTION<br>

        STARLINK-ALPHA-01<br>

        ⚠ approaching ⚠<br>

        DEBRIS-CLOUD-01<br>

        Distance:
        ${distance.toFixed(2)} km

        </div>
        `;
    }

    // COLLISION
    if(distance < 10){

        satA.destroyed = true;
        satB.destroyed = true;

        satA.satellite.visible = false;
        satB.satellite.visible = false;

        createExplosion(posA);

        // BREAKUP DEBRIS
        for(let i=0;i<120;i++){

            const debris = new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.4 + Math.random()*0.8,
                    8,
                    8
                ),

                new THREE.MeshStandardMaterial({
                    color:0xff5522,
                    emissive:0x441100
                })
            );

            debris.position.copy(posA);

            debris.velocity = new THREE.Vector3(

                (Math.random()-0.5)*3,

                (Math.random()-0.5)*3,

                (Math.random()-0.5)*3
            );

            debris.orbitRadius =
                220 + Math.random()*15;

            debris.angle =
                Math.random()*Math.PI*2;

            debris.life = 999999;

            scene.add(debris);

            debrisObjects.push(debris);
        }

        document.getElementById(
            "alerts"
        ).innerHTML = `

        <div style="
            color:red;
            font-size:18px;
            line-height:2;
        ">

        💥 CATASTROPHIC COLLISION 💥<br>

        STARLINK-ALPHA-01<br>

        DESTROYED<br>

        DEBRIS-CLOUD-01<br>

        Massive debris field generated

        </div>
        `;
    }

    // DEBRIS PHYSICS
    debrisObjects.forEach(debris=>{

        if(debris.velocity){

            debris.position.add(
                debris.velocity.clone()
                .multiplyScalar(0.08)
            );

            debris.velocity.multiplyScalar(
                0.992
            );

            debris.angle += 0.002;

            debris.position.x =
                Math.cos(debris.angle)
                * debris.orbitRadius;

            debris.position.z =
                Math.sin(debris.angle)
                * debris.orbitRadius;
        }
    });
}

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    earth.rotation.y += 0.0009;
    clouds.rotation.y += 0.0012;

    stars.rotation.y += 0.00005;

    // satellites.forEach(sat => {

    //     sat.orbitGroup.rotation.y += sat.speed;

    //     sat.satellite.rotation.y += sat.rotationSpeed;

    //     sat.telemetry.velocity = (
    //         7 + Math.sin(Date.now() * 0.001 + sat.speed) * 1.5
    //     ).toFixed(2);
    // });
    satellites.forEach(sat => {

    if(sat.destroyed) return;

    sat.angle += sat.speed;

    sat.satellite.position.x =
        Math.cos(sat.angle)
        * sat.orbitRadius;

    sat.satellite.position.z =
        Math.sin(sat.angle)
        * sat.orbitRadius;

    sat.satellite.rotation.y += 0.03;

    sat.telemetry.velocity = (
        7 +
        Math.sin(
            Date.now()*0.001
        ) * 1.2
    ).toFixed(2);
});

    debrisObjects.forEach((debris, index) => {

        const angle = Date.now() * debris.velocity * 0.0001 + index;

        debris.position.x = Math.cos(angle) * (160 + index * 0.5);
        debris.position.z = Math.sin(angle) * (160 + index * 0.5);
    });

    simulateCollisionAvoidance();

    if (selectedSatellite) {
        updateTelemetry(selectedSatellite);
    }

    renderer.render(scene, camera);
}

function onResize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createExplosion(position){

    const geometry =
        new THREE.SphereGeometry(2,32,32);

    const material =
        new THREE.MeshBasicMaterial({
            color:0xff0000,
            transparent:true,
            opacity:1
        });

    const explosion =
        new THREE.Mesh(
            geometry,
            material
        );

    explosion.position.copy(position);

    scene.add(explosion);

    const alert = document.createElement("div");

    alert.innerHTML = `
    <div style="
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        background:red;
        color:white;
        padding:25px;
        font-size:28px;
        z-index:9999;
        border:3px solid white;
        border-radius:12px;
        box-shadow:0 0 40px red;
        animation:flash 0.2s infinite;
    ">
    🚨 COLLISION DETECTED 🚨
    </div>
    `;

    document.body.appendChild(alert);

    let scale = 1;

    const interval = setInterval(()=>{

        scale += 0.4;

        explosion.scale.set(
            scale,
            scale,
            scale
        );

        explosion.material.opacity -= 0.03;

        if(explosion.material.opacity <=0){

            clearInterval(interval);

            scene.remove(explosion);

            document.body.removeChild(alert);
        }

    },30);
}