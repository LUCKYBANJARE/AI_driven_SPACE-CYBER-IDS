const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth/window.innerHeight,
  0.1,
  10000
);

camera.position.set(0,120,320);

const renderer = new THREE.WebGLRenderer({
  antialias:true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.setPixelRatio(window.devicePixelRatio);

renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild(renderer.domElement);

/* =========================================
   CONTROLS
========================================= */

const controls = new THREE.OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

/* =========================================
   LIGHTS
=========================================*/
const ambient = new THREE.AmbientLight(
  0xffffff,
  0.4
);

scene.add(ambient);

const sun = new THREE.PointLight(
  0xffffff,
  2
);

sun.position.set(400,200,300);

scene.add(sun);

/* =========================================
   EARTH TEXTURES
========================================= */

const loader = new THREE.TextureLoader();

const earthTexture = loader.load(
  "assets/earth.jpg"
);

const bumpTexture = loader.load(
  "assets/earth_bump.jpg"
);

const cloudsTexture = loader.load(
  "assets/earth_clouds.png"
);

/* =========================================
   EARTH
========================================= */

const earth = new THREE.Mesh(

  new THREE.SphereGeometry(
    100,
    128,   128
  ),

  new THREE.MeshPhongMaterial({

    map:earthTexture,
    bumpMap:bumpTexture,
    bumpScale:1.5,

  })

);

scene.add(earth);

/* =========================================
   CLOUDS
========================================= */

const clouds = new THREE.Mesh(

  new THREE.SphereGeometry(
    101,
    128,
    128
),
  new THREE.MeshPhongMaterial({

    map:cloudsTexture,
    transparent:true,
    opacity:0.4

  })

);

scene.add(clouds);

/* =========================================
   ATMOSPHERE
========================================= */

const atmosphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    104,
    64,
    64
  ),

  new THREE.MeshBasicMaterial({

    color:0x00aaff,
    transparent:true,
    opacity:0.08,
    side:THREE.BackSide

  })

);scene.add(atmosphere);

/* =========================================
   STARS
========================================= */

const starGeometry = new THREE.BufferGeometry();

const starVertices = [];

for(let i=0;i<10000;i++){

  const x = (Math.random()-0.5)*5000;
  const y = (Math.random()-0.5)*5000;
  const z = (Math.random()-0.5)*5000;

  starVertices.push(x,y,z);
}

starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(
    starVertices,
    3
  )
);

const starMaterial = new THREE.PointsMaterial({
  color:0xffffff,
  size:1
});

const stars = new THREE.Points(
  starGeometry,
  starMaterial
);

scene.add(stars);

/* =========================================
   GLOBAL ANIMATION LOOP
========================================= */

function animate(){

  requestAnimationFrame(animate);

  earth.rotation.y += 0.0007;

  clouds.rotation.y += 0.001;

  controls.update();

  renderer.render(scene,camera);

}

animate();

window.addEventListener(
  'resize',
  ()=>{

    camera.aspect =
      window.innerWidth/window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);
