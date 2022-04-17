// head, neck, torso
var head = new Cube({scale:[2,2,1]});

var wholeBody = new Cube({translation:[0,0,0], withColor:false});
var headJoint = new Cube({translation:[0,-80,0], withColor:false});

// arms
var leftUpperArm = new Cube({scale:[0.4, 0.7, 0]})
var leftLowerArm = new Cube({scale:[0.4, 0.3, 0]})
var rightUpperArm = new Cube({scale:[0.4, 0.7, 0]})
var rightLowerArm = new Cube({scale:[0.4, 0.3, 0]})

var leftUpperArmJoint = new Cube({translation:[-122,-10,0], withColor:false});
var leftLowerArmJoint = new Cube({translation:[0,53,0], withColor:false});
var rightUpperArmJoint = new Cube({translation:[122,-10,0], withColor:false});
var rightLowerArmJoint = new Cube({translation:[0,53,0], withColor:false});

// legs
var leftUpperLeg = new Cube({scale:[0.5, 1.5, 0]})
var leftLowerLeg = new Cube({scale:[0.6, 0.3, 0]})
var rightUpperLeg = new Cube({scale:[0.5, 1.5, 0]})
var rightLowerLeg = new Cube({scale:[0.6, 0.3, 0]})

var leftUpperLegJoint = new Cube({translation:[-36,100,0], withColor:false});
var leftLowerLegJoint = new Cube({translation:[0,101,0], withColor:false});
var rightUpperLegJoint = new Cube({translation:[36,100,0], withColor:false});
var rightLowerLegJoint = new Cube({translation:[0,101,0], withColor:false});

// set parent
headJoint.setParent(wholeBody);
head.setParent(headJoint);

leftUpperArmJoint.setParent(wholeBody);
leftUpperArm.setParent(leftUpperArmJoint);
leftLowerArmJoint.setParent(leftUpperArmJoint);
leftLowerArm.setParent(leftLowerArmJoint);

rightUpperArmJoint.setParent(wholeBody);
rightUpperArm.setParent(rightUpperArmJoint);
rightLowerArmJoint.setParent(rightUpperArmJoint);
rightLowerArm.setParent(rightLowerArmJoint);

leftUpperLegJoint.setParent(wholeBody);
leftUpperLeg.setParent(leftUpperLegJoint);
leftLowerLegJoint.setParent(leftUpperLegJoint);
leftLowerLeg.setParent(leftLowerLegJoint);

rightUpperLegJoint.setParent(wholeBody);
rightUpperLeg.setParent(rightUpperLegJoint);
rightLowerLegJoint.setParent(rightUpperLegJoint);
rightLowerLeg.setParent(rightLowerLegJoint);

objects = [
    head, 
    headJoint, wholeBody,

    leftUpperArm, leftUpperArmJoint,
    leftLowerArm, leftLowerArmJoint,
    rightUpperArm, rightUpperArmJoint,
    rightLowerArm, rightLowerArmJoint,

    leftUpperLeg, leftUpperLegJoint,
    leftLowerLeg, leftLowerLegJoint,
    rightUpperLeg, rightUpperLegJoint,
    rightLowerLeg, rightLowerLegJoint,
]

// wholeBody.xScale(0.5);
// wholeBody.yScale(0.5);
// wholeBody.zScale(0.5);

let n = 1;

function drawSceneWithAnim(time) {
    // console.log("draw scene called");
    time *= 0.0005;
  
    // update the local matrices for each object.
     //wholeBody.zRotate(n);
     // neckJoint.yRotate(n);
     //leftUpperLegJoint.yRotate(n);

     objects.forEach(obj => {
        obj.localMatrix = obj.generateMatrix();
    });
  
    wholeBody.draw();
  
    requestAnimationFrame(drawSceneWithAnim);
    n+=0.5;
    console.log(n);
}

requestAnimationFrame(drawSceneWithAnim);

// aksi
// console.log(torso.rotate);
wholeBody.zRotate(0);
head.zRotate(0);
// console.log(torso.rotate);

// update & draw
objects.forEach(obj => {
    obj.localMatrix = obj.generateMatrix();
});
wholeBody.draw();