// global variable
shading = false;
isAnimating = false;

// head, neck, torso
var head = new Cube({scale:[1,1,0.7], type:2});
var neck = new Cube({scale:[0.5,0.5,0.5], type:2});
var torso = new Cube({scale:[1.5,2,1], type:2});

var wholeBody = new Cube({translation:[0,0,0], type:1});
var neckJoint = new Cube({translation:[0,-130,0], type:1});
var headJoint = new Cube({translation:[0,-80,0], type:1});

// arms
var leftUpperArm = new Cube({scale:[0.4, 1.2, 0.4], type:2})
var leftLowerArm = new Cube({scale:[0.4, 1.2, 0.4], type:2})
var rightUpperArm = new Cube({scale:[0.4, 1.2, 0.4], type:2})
var rightLowerArm = new Cube({scale:[0.4, 1.2, 0.4], type:2})

var leftUpperArmJoint = new Cube({translation:[-100,-20,0], type:1});
var leftLowerArmJoint = new Cube({translation:[0,125,0], type:1});
var rightUpperArmJoint = new Cube({translation:[100,-20,0], type:1});
var rightLowerArmJoint = new Cube({translation:[0,125,0], type:1});

leftUpperArmJoint.moveCenterToUpmost();
leftLowerArmJoint.moveCenterToUpmost();
rightUpperArmJoint.moveCenterToUpmost();
rightLowerArmJoint.moveCenterToUpmost();

// legs
var leftUpperLeg = new Cube({scale:[0.6, 1.6, 0.6], type:2}) // pake celana ceritanya
var leftLowerLeg = new Cube({scale:[0.5, 1.8, 0.5], type:2})
var rightUpperLeg = new Cube({scale:[0.6, 1.6, 0.6], type:2})
var rightLowerLeg = new Cube({scale:[0.5, 1.8, 0.5], type:2})

var leftUpperLegJoint = new Cube({translation:[-35,185,0], type:1});
var leftLowerLegJoint = new Cube({translation:[0,175,0], type:1});
var rightUpperLegJoint = new Cube({translation:[35,185,0], type:1});
var rightLowerLegJoint = new Cube({translation:[0,175,0], type:1});

leftUpperLegJoint.moveCenterToUpmost();
leftLowerLegJoint.moveCenterToUpmost();
rightUpperLegJoint.moveCenterToUpmost();
rightLowerLegJoint.moveCenterToUpmost();

// set parent
torso.setParent(wholeBody);
neckJoint.setParent(wholeBody);
neck.setParent(neckJoint);
headJoint.setParent(neckJoint);
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
    torso, head, neck, 
    headJoint, wholeBody, neckJoint,

    leftUpperArm, leftUpperArmJoint,
    leftLowerArm, leftLowerArmJoint,
    rightUpperArm, rightUpperArmJoint,
    rightLowerArm, rightLowerArmJoint,

    leftUpperLeg, leftUpperLegJoint,
    leftLowerLeg, leftLowerLegJoint,
    rightUpperLeg, rightUpperLegJoint,
    rightLowerLeg, rightLowerLegJoint,
]

wholeBody.xScale(0.75);
wholeBody.yScale(0.75);
wholeBody.zScale(0.75);
// wholeBody.xTranslation(200);
// wholeBody.yTranslation(200);

let n = 1;

function drawSceneWithAnim(time) {
    // console.log("draw scene called");
    time *= 0.0005;
  
    // update the local matrices for each object.
     wholeBody.yRotate(n);
     wholeBody.zRotate(n);

    //  neckJoint.yRotate(n);
     leftUpperArmJoint.xRotate(n);
    //  leftLowerArmJoint.zRotate(n);
    rightUpperArmJoint.xRotate(n);

    leftUpperLegJoint.xRotate(n);
    rightUpperLegJoint.xRotate(n);

     objects.forEach(obj => {
        obj.localMatrix = obj.generateMatrix();
    });
  
    wholeBody.draw();
    
    if (isAnimating) {
        requestAnimationFrame(drawSceneWithAnim);
        n+=1;
    }
    // console.log(n);
}

// drawSceneWithAnim();

// rotation
// wholeBody.xRotate(90);
// neckJoint.zRotate(0);
// head.zRotate(0);

// update & draw
objects.forEach(obj => {
    obj.localMatrix = obj.generateMatrix();
});
wholeBody.draw();