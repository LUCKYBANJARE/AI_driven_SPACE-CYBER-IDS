function detectThreats(
  satellites,
  debris
){

  let threats = 0;

  satellites.forEach((sat)=>{

    sat.danger = false;

    const satPos =
      sat.mesh.getWorldPosition(
        new THREE.Vector3()
      );

    debris.forEach((deb)=>{

      const debPos =
        deb.mesh.getWorldPosition(
          new THREE.Vector3()
        );

      const distance =
        satPos.distanceTo(debPos);

      if(distance < 20){

        threats++;

        sat.danger = true;

        sat.mesh.traverse((child)=>{

          if(child.material){
            child.material.color.set(0xff0000);
          }

        });

      }
 });

    if(!sat.danger){

      sat.mesh.traverse((child)=>{

        if(child.material){
          child.material.color.set(0xc0c0c0);
        }

      });

    }

  });

  return threats;
}