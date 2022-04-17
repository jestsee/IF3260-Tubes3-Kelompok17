var head = new Cube({translation:[0,-200,0], /* scale:[1,1,0.7] */});
var neck = new Cube({translation:[0,-120,0], /* scale:[0.5,0.5,0.5] */});
var torso = new Cube({translation:[0,10,0], /* scale:[1.5,2,1] */});

objects = [head, neck, torso]

head.setParent(neck);
neck.setParent(torso);

let n = 1;

function drawSceneWithAnim(time) {
    console.log("draw scene called");
    time *= 0.0005;
  
    // update the local matrices for each object.
     torso.zRotate(n);
     head.zRotate(n);

     objects.forEach(obj => {
        obj.localMatrix = obj.generateMatrix();
    });
  
    torso.draw();
  
    requestAnimationFrame(drawSceneWithAnim);
    n++;
    console.log(n);
}

// // aksi
// // console.log(torso.rotate);
// torso.zRotate(9);
// neck.zRotate(10);
// head.yRotate(10);
// // console.log(torso.rotate);

// // update & draw
// objects.forEach(obj => {
//     obj.localMatrix = obj.generateMatrix();
// });
// torso.draw();

requestAnimationFrame(drawSceneWithAnim);