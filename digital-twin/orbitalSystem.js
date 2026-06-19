const satellites = [];
const debris = [];

/* =====================================
   SATELLITE MODEL
===================================== */

function createSatellite(){

  const satellite = new THREE.Group();

  const body = new THREE.Mesh(

    new THREE.BoxGeometry(2,1.2,1.2),

    new THREE.MeshStandardMaterial({

      color:0xc0c0c0,
      metalness:1,
      roughness:0.3

    })

  );

  satellite.add(body);

  function panel(x){

    const solar = new THREE.Mesh(

      new THREE.BoxGeometry(
        5,
        0.08,
        2
      ),

      new THREE.MeshStandardMaterial({

        color:0x003cff,
        emissive:0x001133,
        metalness:0.7

      })

    );

    solar.position.x = x;

    return solar;

  }

  satellite.add(panel(-4));
  satellite.add(panel(4));

  return satellite;
}

/* =====================================
   CREATE SATELLITES
===================================== */

for(let i=0;i<20;i++){

  const orbitGroup = new THREE.Group();

  scene.add(orbitGroup);

  const mesh = createSatellite();

  const radius =
    150 + Math.random()*220;

  mesh.position.x = radius;

  orbitGroup.rotation.x =
    Math.random()*Math.PI;

  orbitGroup.rotation.z =
    Math.random()*Math.PI;

  orbitGroup.add(mesh);

  satellites.push({

    mesh,
    orbitGroup,

    speed:
      0.0005 + Math.random()*0.002,

    rotation:
      0.01 + Math.random()*0.02,

    danger:false

  });

}

/* =====================================
   CREATE DEBRIS
===================================== */

for(let i=0;i<300;i++){

  const orbit = new THREE.Group();

  scene.add(orbit);

  const mesh = new THREE.Mesh(

    new THREE.SphereGeometry(0.5,6,6),

    new THREE.MeshBasicMaterial({
      color:0xff5522
    })

  );

  const radius =
    130 + Math.random()*260;

  mesh.position.x = radius;

  orbit.rotation.x =
    Math.random()*Math.PI;

  orbit.rotation.z =
    Math.random()*Math.PI;

  orbit.add(mesh);

  debris.push({

    mesh,
    orbit,

    speed:
      0.001 + Math.random()*0.004

  });

}

/* =====================================
   UPDATE SYSTEM
===================================== */

function updateOrbitalSystem(){

  satellites.forEach((sat)=>{

    sat.orbitGroup.rotation.y +=
      sat.speed;

    sat.mesh.rotation.y +=
      sat.rotation;

  });

  debris.forEach((deb)=>{

    deb.orbit.rotation.y +=
      deb.speed;

  });

  const threats = detectThreats(
    satellites,
    debris
  );

  updateTelemetry({

    satellites:satellites.length,
    debris:debris.length,
    threats:threats,
    highRisk:Math.floor(threats*0.3)

  });

}

/* =====================================
   MAIN ANIMATION LOOP
===================================== */

function orbitalAnimationLoop(){

  requestAnimationFrame(
    orbitalAnimationLoop
  );

  updateOrbitalSystem();

}

orbitalAnimationLoop();